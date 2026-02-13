import axios from "axios"

const axiosService = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
});

axiosService.interceptors.request.use((config) => {
    const token = localStorage.getItem('paperly-token');
    if(!token && !window.location.href.includes('/sign-in')){
        window.location.href = '/sign-in';
    } 
    config.headers.Authorization = 'Bearer ' + token;
    return config;
},
(error) => {
    return Promise.reject(error);
});

axiosService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('paperly-token');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export default axiosService;