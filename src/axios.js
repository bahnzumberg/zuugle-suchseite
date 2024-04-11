var axios = require("axios");
export const baseURL =
  // "https://www2.zuugle.at/api";
  window.location.host.indexOf("localhost") >= 0
    ? process.env.REACT_APP_API_URL
    : `${window.location.protocol}//${window.location.host}/api`;

let axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
});

axiosInstance.interceptors.request.use(function (config) {
  config.headers.authorization = "FV69pR5PQQLcQ4wuMtTSqKqyYqf5XEK4";
  return config;
});

export default axiosInstance;
