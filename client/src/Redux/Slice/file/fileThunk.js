// src/features/file/fileThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from '../../../config/axiosInstance.js'

// Basic config
axios.defaults.withCredentials = true;

// UPLOAD FILE
export const uploadFile = createAsyncThunk("file/upload",async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/file/upload", formData);
    console.log("Uploading...");
      return res.data; // returns { message, fileIds }
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// GET FILE DETAILS
export const getFileDetails = createAsyncThunk("file/getDetails", async (fileId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/file/getFileDetails/${fileId}`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// DELETE FILE
export const deleteFile = createAsyncThunk("file/delete", async (fileId, { rejectWithValue }) => {
  try {
    console.log("Deleting file...");
    await axiosInstance.delete(`/file/delete/${fileId}`);
    return fileId;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// UPDATE FILE STATUS (active/expired)
export const updateFileStatus = createAsyncThunk("file/updateStatus", async ({ fileId, status }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/file/update/${fileId}`, { status });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// GENERATE SHORT LINK
export const generateShareShortenLink = createAsyncThunk("file/generateShortLink", async ({ fileId }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/file/generateShareShortenLink", { fileId });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// SEND LINK VIA EMAIL
export const sendLinkEmail = createAsyncThunk("file/sendLinkEmail", async ({ fileId, email }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/file/sendLinkEmail", { fileId, email });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// UPDATE EXPIRY
export const updateFileExpiry = createAsyncThunk("file/updateExpiry", async ({ fileId, expiresAt }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/updateFileExpiry", { fileId, expiresAt });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// UPDATE PASSWORD
export const updateFilePassword = createAsyncThunk("file/updatePassword", async ({ fileId, password }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/updateFilePassword", { fileId, password });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// SEARCH FILES
export const searchFiles = createAsyncThunk("file/search", async (query, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/file/searchFiles?query=${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// SHOW USER FILES
export const showUserFiles = createAsyncThunk("file/showUserFiles", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/file/showUserFiles");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// GENERATE QR
export const generateQR = createAsyncThunk("file/generateQR", async (fileId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/file/generateQR/${fileId}`, { responseType: 'blob' });
    return URL.createObjectURL(res.data); // returns blob URL
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// GET DOWNLOAD COUNT
export const getDownloadCount = createAsyncThunk("file/downloadCount", async (fileId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/file/getDownloadCount/${fileId}`);
    return { fileId, count: res.data.count };
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// RESOLVE SHORT LINK
export const resolveShareLink = createAsyncThunk("file/resolveLink", async (shortUrl, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/file/resolveShareLink/${shortUrl}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// VERIFY PASSWORD
export const verifyFilePassword = createAsyncThunk("file/verifyPassword", async ({ fileId, password }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/file/verifyFilePassword", { fileId, password });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// get User files
export const getUserFiles = createAsyncThunk("file/getUserFiles", async (userId, { rejectWithValue }) => {
  try {
    console.log(userId);
    const res = await axiosInstance.get(`file/getUserFiles/${userId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});