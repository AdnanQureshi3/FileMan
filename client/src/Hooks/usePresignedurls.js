import pLimit from "p-limit";
import axios from "axios";
const limit = pLimit(5);

const uploadOne = async (file, presigned) => {
  try {
    console.log("Uploading file to S3:", presigned.uploadUrl);
   const res = await axios(presigned.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": presigned.contentType },
        data: file,
    });
// const res = await axios.put(presigned.uploadUrl,file);
    console.log("Uploaded file to S3:", res);
    
    return { ...presigned, file, status: "success" };
  } catch (err) {
    console.error(
      "S3 upload failed:",
      err.response?.status,
      err.response?.data || err.message
    );
    return { ...presigned, file, status: "failed" };
  }
};

export const uploadFiles = async (files) => {
    console.log("Requesting presigned URLs for files:", files);
  const metadata = files.map(f => ({
    name: f.name,
    type: f.type,
    size: f.size,
  }));
  console.log("Metadata prepared:", metadata);


  const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/file/upload`, { metadata });

  const tasks = data.uploads.map((u, i) =>
    limit(() => uploadOne(files[i], u))
  );

  return await Promise.all(tasks);
};
