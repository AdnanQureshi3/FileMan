
// import s3 from "../config/s3.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";  
import AWS from "aws-sdk";
import nodemailer from "nodemailer";
import shortid from "shortid";
import QRCode from "qrcode";
import path from "path";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
dotenv.config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const uploadFiles = async (req, res) => {
  console.log("uploading... in backend", req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const { isPassword, password, hasExpiry, expiresAt } = req.body;
  let userId = Number(req.body.userId);
  

  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    let availableSpace = user.TotalSizeLimit - user.UsedStorage;
    let SpaceUsed = 0;
    const savedFiles = [];

    
    let totalUploads = 0, imageCountInc = 0, videoCountInc = 0, documentCountInc = 0;

    for (const file of req.files) {
      const originalName = file.originalname;
      const extension = path.extname(originalName);
      const uniqueSuffix = shortid.generate();
      const finalFileName = `${originalName.replace(/\s+/g, "_")}_${uniqueSuffix}${extension}`;

      if (file.size / (1024 * 1024) > availableSpace) {
        return res.status(400).json({
          error: `Insufficient storage space. You can upload files up to ${availableSpace / (1024 * 1024)} MB.`,
        });
      }

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `file-share-app/${finalFileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const s3Result = await s3.upload(params).promise();
      const fileUrl = s3Result.Location;
      const shortCode = shortid.generate();

      const fileObj = {
        path: fileUrl,
        name: finalFileName,
        type: file.mimetype,
        size: file.size,
        hasExpiry: hasExpiry === "true",
        expiresAt:
          hasExpiry === "true"
            ? new Date(Date.now() + expiresAt * 3600000)
            : new Date(Date.now() + 45 * 24 * 3600000),
        status: "active",
        shortUrl: `/f/${shortCode}`,
        createdById: userId,
      };

      availableSpace -= file.size / (1024 * 1024);
      SpaceUsed += file.size / (1024 * 1024);

      if (isPassword === "true") {
        const hashedPassword = await bcrypt.hash(password, 10);
        fileObj.password = hashedPassword;
        fileObj.isPasswordProtected = true;
      }

      const savedFile = await prisma.file.create({ data: fileObj });
      savedFiles.push(savedFile);

      // ✅ increment counters instead of DB update each iteration

      totalUploads++;
      if (file.mimetype.startsWith("image/")) imageCountInc++;
      else if (file.mimetype.startsWith("video/")) videoCountInc++;
      else if (file.mimetype.startsWith("application/")) documentCountInc++;
    }

    // ✅ single DB update for user stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        UsedStorage: { increment: SpaceUsed },
        total_upload: { increment: totalUploads },
        imageCount: { increment: imageCountInc },
        videoCount: { increment: videoCountInc },
        documentCount: { increment: documentCountInc },
      },
    });

    return res.status(201).json({
      message: "Files uploaded successfully",
      
      fileIds: savedFiles.map((f) => f.id),
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};



const downloadInfo = async (req, res) => {
  const { shortCode } = req.params;

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

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `file-share-app/${file.name}`,
      ResponseContentDisposition: `attachment; filename="${file.name}"`
    };

    const command = new GetObjectCommand(params);
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

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    const key = `file-share-app/${file.name}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 24 * 60 * 60,
    };

    const downloadUrl = s3.getSignedUrl('getObject', params);
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
  console.log("Delete request received" , UserId);

  
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

        const s3 =new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        })

        const params={
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `file-share-app/${file.name}`
        }

        await s3.deleteObject(params).promise();

         await prisma.file.delete({ where: { id: fileId } });

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

    const isMatch = await bcrypt.compare(password, file.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Incorrect password" });

    return res.status(200).json({ success: true, message: "Password verified" });
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
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
    uploadFiles,
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
    
};