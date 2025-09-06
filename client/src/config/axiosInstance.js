import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,   // ✅ send cookies with every request
});

export default axiosInstance;
