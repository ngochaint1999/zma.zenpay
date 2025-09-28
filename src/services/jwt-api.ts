import axios from 'axios';

export const BaseAPI = import.meta.env.VITE_APP_API_URL;
const jwtAxios = axios.create({
  baseURL: BaseAPI,
  headers: {
    "Content-Type": "application/json"
  },
});

jwtAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

jwtAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response) {
      const status = err.response.status;

      if (status === 401) {
        console.log('Need to logout user');
        delete jwtAxios.defaults.headers.common.Authorization;
        // store.dispatch({ type: LOGOUT });
      }

      if (status === 403) {
        return Promise.reject({
          ...err,
          response: {
            ...err.response,
            data: {
              ...err.response.data,
              message: 'Bạn không có quyền thực hiện thao tác này.'
            }
          }
        });
      }
    }

    return Promise.reject(err);
  },
);

export default jwtAxios