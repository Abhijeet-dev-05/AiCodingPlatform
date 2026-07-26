import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://aicodingplatform.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

