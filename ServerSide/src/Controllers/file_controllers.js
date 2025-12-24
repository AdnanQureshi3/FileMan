
import s3 from "../config/s3.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";  
import nodemailer from "nodemailer";
import shortid from "shortid";
import QRCode from "qrcode";
import path from "path";
import {  GetObjectCommand  , PutObjectCommand , DeleteObjectCommand , HeadObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { get } from "http";

const prisma = new PrismaClient();


const getFolder = (mime) => {
  if (mime.startsWith("image/")) return "images";
  if (mime.startsWith("video/")) return "videos";
  if (mime === "application/pdf") return "pdfs";
  return "others";
};

 const presignFiles = async (req, res) => {
  const { metadata } = req.body;
  const userId = Number(req.id);
  console.log("Presign request received", metadata );

  if (!metadata || metadata.length === 0)
    return res.status(400).json({ error: "No metadata" });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  let remaining = user.TotalSizeLimit - user.UsedStorage;
  const uploads = [];

  for (const file of metadata) {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > remaining)
      return res.status(400).json({ error: "Insufficient storage" });

    const folder = getFolder(file.type);
    const ext = path.extname(file.name);
    const key = `file-share-app/${folder}/${file.name.replace(/\s+/g, "_")}_${shortid.generate()}${ext}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: file.type,
      }),
      { expiresIn: 120 }
    );
    console.log(uploadUrl , "presigned url");

    uploads.push({ key, uploadUrl, contentType: file.type });
    remaining -= sizeMB;
  }

  res.json({ uploads });
};


 const confirmUploads = async (req, res) => {
  console.log("Confirm uploads request received", req.body);
  const { files , enablePassword, password, enableExpiry, expiryDate } = req.body;
  const userId = Number(req.id);

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files to confirm" });
  }

  let spaceUsed = 0;

  for (const file of files) {
    // 1️⃣ Verify file really exists in S3
    await s3.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.key,
      })
    );
    const shortCode = shortid.generate();
    const shortUrl = `/f/${shortCode}`;

    // 2️⃣ Insert DB record
    await prisma.file.create({
      data: {
        path: file.key,
        name: file.name,
        type: file.type,
        size: file.size,
        createdById: userId,
        isPasswordProtected: enablePassword || false,
        password: enablePassword ? await bcrypt.hash(password, 10) : null,
        hasExpiry: enableExpiry || false,
        expiresAt: enableExpiry ? new Date(expiryDate) : new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
        status: "active",
        shortUrl: shortUrl,

      },
    });

    spaceUsed += file.size / (1024 * 1024);
  }

  // 3️⃣ Update user storage
  await prisma.user.update({
    where: { id: userId },
    data: {
      UsedStorage: { increment: spaceUsed },
      total_upload: { increment: files.length },
    },
  });

  res.json({ message: "Files confirmed" });
};



const downloadInfo = async (req, res) => {
  const { shortCode } = req.params;
  console.log("Download info request for code:", shortCode);

  try {
    const file = await prisma.file.findFirst({ where: { shortUrl: `/f/${shortCode}` } });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    console.log(file)
    if (file.status !== 'active') {
      return res.status(403).json({ error: 'This file is not available for download' });
    }

    if (file.expiresAt && new Date(file.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'This file has expired' });
    }

    const key = file.path;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${file.name}"`
    });
    const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 24 * 60 * 60 }); //1 day

    await prisma.file.update({
      where: { id: file.id },
      data: { downloadedContent: { increment: 1 } }
    });

    // Update user download count

    const user = await prisma.user.findUnique({ where: { id: file.createdById } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { total_download: { increment: 1 } }
      });
    }

    return res.status(200).json({
      downloadUrl,
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type || 'file',
      path: file.path,
      isPasswordProtected: file.isPasswordProtected || false,
      expiresAt: file.expiresAt || null,
      status: file.status || 'active',
      shortUrl: file.shortUrl,
      downloadedContent: file.downloadedContent,
      uploadedBy: user?.fullname || 'Unknown',
      createdAt: file.createdAt,
      updatedAt: file.updatedAt
    });

  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




const downloadFile = async (req, res) => {
    const { fileId } = req.params;
    const { password } = req.body;
    try {
        const file = await prisma.file.findUnique({ where: { id: Number(fileId) } });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

         if (file.status !== 'active') {
          return res.status(403).json({ error: 'This file is not available for download' });
        }

        if (file.expiresAt && new Date(file.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'This file has expired' });
    }

       if (file.isPasswordProtected) {
      if (!password) {
        return res.status(401).json({ error: 'Password required' });
      }

      const isMatch = await bcrypt.compare(password, file.password);
      if (!isMatch) {
        return res.status(403).json({ error: 'Incorrect password' });
      }
    }


    const key = file.path;
    const command = new GetObjectCommand({
      Bucket:process.env.AWS_BUCKET_NAME,
      Key:key,
      ResponseContentDisposition: `attachment; filename="${file.name}"`
    })
    

    const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 24 * 60 * 60 });
    if (!downloadUrl) {
        return res.status(500).json({ error: 'Error generating download URL' });
    }

   
    await prisma.file.update({
      where: { id: Number(fileId) },
      data: { downloadedContent: { increment: 1 } }
    });

    // Update user download count
    const user = await prisma.user.findUnique({ where: { id: file.createdById } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { totalDownloads: { increment: 1 } }
      });
    }

    return res.status(200).json({ downloadUrl });

       
    }catch (error) {
        console.error("Download error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


const deleteFile = async (req, res) => {
  const { fileId } = req.params;
  const UserId = req.id;
  console.log("Delete request received" , UserId , fileId);

  
  try {
      const user = await prisma.user.findUnique({ where: { id: Number(UserId) } });
      if(!user){
        return res.status(404).json({error:'User not found'});
      }
        const file=await prisma.file.findUnique({ where: { id: Number(fileId) } });
        const size = file.size;

        
        if(!file){
          return res.status(404).json({error:'File not found'});
        }
        if(user.id.toString() !== file.createdById.toString()){
          return res.status(403).json({error:'Unauthorized to delete this file'});
        }

        if(file.status==='deleted'){
          return res.status(400).json({error:'File already deleted'});
        }
        const key = file.path;
        const command = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key
        })
        
          await s3.send(command);

         await prisma.file.delete({ where: { id: Number(fileId) } });

         await prisma.user.update({
          where:{ id: UserId},
          data:{
            UsedStorage: { decrement: size }
          }
         })
         

        return res.status(200).json({message:'File deleted successfully'});
     }catch(error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
}

}

const updateFileStatus = async (req, res) => {
     const {fileId} = req.params;
     const {status} = req.body;

     try{

         if (!['active', 'inactive'].includes(status)) {
          return res.status(400).json({ error: 'Invalid status' });
        }

        const file=await prisma.file.findUnique({ where: { id: Number(fileId )} });

        if(!file){
          return res.status(404).json({error:'File not found'});
        }

        if(file.status===status){
          return res.status(400).json({error:'File already has this status'});
        }

        
        await prisma.file.update({
          where: { id: fileId },
          data: { status: status }
        });

        return res.status(200).json({message:'File status updated successfully'});
     }catch(error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
     }
}

const updateFileExpiry = async (req, res) => {
    const {fileId} = req.params;
    const { expiresAt} = req.body;

    try{
       const file=await prisma.file.findUnique({ where: { id: Number(fileId) } });
        if(!file){
            return res.status(404).json({error:'File not found'});
        }

        if (expiresAt) {
          file.expiresAt = new Date(Date.now() + expiresAt * 3600000); // Convert hours to milliseconds
        }

        await prisma.file.update({
          where: { id: fileId },
          data: { expiresAt: file.expiresAt }
        });

    return res.status(200).json({ message: 'File expiry updated successfully' });
    }catch(error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateAllFileExpiry = async (req, res) => {
    const files = await File.find();
  
    try {
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files found' });
        }

        const updatedFiles = [];
        for (const file of files) {
          if (file.status === 'deleted') continue; // Skip deleted files
           if (file?.expiresAt && new Date(file.expiresAt) < new Date()) {
              file.status = 'expired';
              file.hasExpiry = true; // Keep this if expired files should still have expiry set
          } else {
              file.expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
              file.hasExpiry = true;
          }
            await file.save();
            updatedFiles.push(file);
        }

        return res.status(200).json({ message: 'All file expiries updated successfully', files: updatedFiles });
    } catch (error) {
        console.error("Update all expiry error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}



const updateFilePassword = async (req, res) => {
  const { fileId } = req.params;
  const { newPassword } = req.body;

  try {
    const file = await prisma.file.findUnique({ where: { id: Number(fileId) } });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    file.password = hashedPassword;
    await prisma.file.update({
      where: { id: Number(fileId) },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: 'File password updated successfully' });

  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ error: "Error updating file password" });
  }
};


const searchFiles = async (req, res) => {
  const { query } = req.query; // Search query string

  try {
    const files = await prisma.file.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' }, // Case-insensitive search
      },
    });

    if (!files.length) {
      return res.status(404).json({ message: 'No files found' });
    }

    return res.status(200).json(files);

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Error searching files" });
  }
};

const showUserFiles = async (req, res) => {
  const { userId } = req.params;
  console.log(userId , req.params , req.query)

  try {
    const files = await prisma.file.findMany({ where: { createdById: Number(userId) } });

    if (!files.length) {
      return res.status(404).json({ message: 'No files found' });
    }

    return res.status(200).json(files);

  } catch (error) {
    console.error("List files error:", error);
    return res.status(500).json({ error: "Error fetching user files" });
  }
};

const getFileDetails = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await prisma.file.findUnique({ where: { id: Number(fileId) } });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    return res.status(200).json(file);
  }
  catch (error) {
    console.error("Get file details error:", error);
    return res.status(500).json({ error: "Error fetching file details" });
  }
}

const generateShareShortenLink = async (req, res) => {
  const { fileId } = req.body;
  try {
    const file = await prisma.file.findUnique({ where: { id: Number(fileId) } });
    if (!file) return res.status(404).json({ error: 'File not found' });

    const shortCode = shortid.generate();
    file.shortUrl = `${process.env.BASE_URL}/f/${shortCode}`;
    await prisma.file.update({
      where: { id: file.id },
      data: { shortUrl: file.shortUrl }
    });

    res.status(200).json({ shortUrl: file.shortUrl });
  } catch (error) {
    console.error('Shorten link error:', error);
    res.status(500).json({ error: 'Error generating short link' });
  }
}; 

const sendLinkEmail = async (req, res) => {
  const { fileId, email } = req.body;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

   const mailOptions = {
  from: `"File Share App" <${process.env.MAIL_USER}>`,
  to: email,
  subject: 'Your Shared File Link',
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>📎 You've received a file!</h2>
      <p>Hello,</p>
      <p>You have been sent a file using <strong>File Share App</strong>.</p>
      <p><strong>File Name:</strong> ${file.name}</p>
      <p><strong>File Type:</strong> ${file.type}</p>
      <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
      <p><strong>Download Link:</strong></p>
      <p><a href="${file.path}" target="_blank" style="color: #3366cc;">Click here to download your file</a></p>
      ${
        file.expiresAt
          ? `<p><strong>Note:</strong> This link will expire on <strong>${new Date(
              file.expiresAt
            ).toLocaleString()}</strong>.</p>`
          : ''
      }
      <p>Thank you for using File Share App!</p>
    </div>
  `
};


    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Link sent successfully' });
  } catch (error) {
    console.error('Resend link error:', error);
    res.status(500).json({ error: 'Error resending link' });
  }
};

const generateQR = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await prisma.file.findUnique({ where: { id: Number(fileId) } });
    if (!file) return res.status(404).json({ error: 'File not found' });

    const fileUrl = file.path;

    const qrDataUrl = await QRCode.toDataURL(fileUrl);

    res.status(200).json({ qr: qrDataUrl });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

const getDownloadCount = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await prisma.file.findUnique({ where: { id: Number(fileId) } });
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.status(200).json({ downloadCount: file.downloadedContent });
  }
  catch (error) {
    console.error('Get download count error:', error);
    res.status(500).json({ error: 'Failed to get download count' });
  }
}

const resolveShareLink = async (req, res) => {
  const { code } = req.params;
const shortUrl = `${process.env.BASE_URL}/f/${code}`;
const file = await File.findOne({ shortUrl });

  try {
    const file = await prisma.file.findFirst({ where: { shortUrl } });

    if (!file) {
      return res.status(404).json({ error: "Invalid or expired link" });
    }

    // Check expiry
    if (file.expiresAt && new Date() > file.expiresAt) {
      file.status = "expired";
      await file.save();
      return res.status(410).json({ error: "This file has expired." });
    }

    return res.status(200).json({
      fileId: file._id,
      name: file.name,
      size: file.size,
      type: file.type || "file", // fallback if missing
      previewUrl: file.path,
      isPasswordProtected: file.isPasswordProtected || false,
      expiresAt: file.expiresAt || null,
      status: file.status || "active",
    });
  } catch (error) {
    console.error("Error resolving share link:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyFilePassword = async (req, res) => 
  {
  const { shortCode, password } = req.body;
  console.log(password)
  

  try {
    const file = await prisma.file.findFirst({ where: { shortUrl: `/f/${shortCode}` } });
    if (!file || !file.isPasswordProtected)
      return res.status(400).json({ success: false, error: "File not protected or not found" });
    // console.log("input:", password);
    const hashed = await bcrypt.hash(password, 10);
    console.log("input:", hashed);
console.log("hash:", file.password);


    const isMatch = await bcrypt.compare(password, file.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Incorrect password" });

    return res.status(200).json({ success: true, message: "Password verified" });
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


const previewFile = async (req, res) => {
  console.log("Previewing file:", req.params.fileId);
  const id = req.params.fileId;


  const file = await prisma.file.findUnique({ where: { id: Number(id) } });
  if (!file) return res.status(404).json({ error: "File not found" });

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.path,
    ResponseContentDisposition: `inline`,
  });

  const previewUrl = await getSignedUrl(s3, command, {
    expiresIn: 300,
  });

  res.json({ previewUrl });
};

const getUserFiles = async (req, res) => {
  console.log("getting user files");

  const { userId } = req.params;
  try {
  const { userId } = (req.params);
    const files = await prisma.file.findMany({ where: { createdById:Number( userId) } });

    if (!files.length) {
      return res.status(404).json({ message: 'No files found' });
    }

    return res.status(200).json(files);

  } catch (error) {
    console.error("List files error:", error);
    return res.status(500).json({ error: "Error fetching user files" });
  }
}



export {
  
    presignFiles,
    downloadFile,
    deleteFile,
    updateFileStatus,
    updateFileExpiry,
    updateFilePassword,
    searchFiles,
    showUserFiles,
    getFileDetails,
    generateShareShortenLink,
    sendLinkEmail,
    generateQR,
    getDownloadCount,
    resolveShareLink,
    verifyFilePassword,
    getUserFiles,
    updateAllFileExpiry,
    downloadInfo,
    previewFile,
    confirmUploads

    
};