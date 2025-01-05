import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
 // 基础 URL
export const baseURL: string = 'api'
// const baseURL: string = 'https://hksofy-hzcsfn-4000.app.cloudstudio.work/'

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000, // 超时时间
});

// 请求拦截
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token: string | null = localStorage.getItem('token')
    const email: any = localStorage.getItem('email')
    config.headers.Authorization = `${token}+${btoa(email)}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (res.code !== 200) {
      return Promise.reject(res.message);
    } else {
      return res;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
