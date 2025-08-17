import axios from 'axios';

const axiosSecure = axios.create({
   
    baseURL: `http://localhost:3500`
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
