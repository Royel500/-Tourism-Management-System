import axios from 'axios';

const axiosSecure = axios.create({
    baseURL: `https://assignment-12-server-indol-ten.vercel.app`
});

const useAxiosecure = () => {
    axiosSecure.interceptors.request.use(config => {
        const token = localStorage.getItem('access-token');  // ✅ Fetch token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosecure;
