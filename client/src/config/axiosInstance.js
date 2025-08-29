
import axios from "axios";

const BASE_URL=`${import.meta.env.VITE_API_URL}/api/`
const axiosInstance=axios.create()

axiosInstance.defaults.baseURL=BASE_URL;

export default axiosInstance;
