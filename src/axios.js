var axios = require("axios");
export const baseURL = window.location.host.indexOf('localhost') >= 0 ? "http://localhost:8080/api" : `${window.location.protocol}//${window.location.host}/api`;

let axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 60000,
});

axiosInstance.interceptors.request.use(function (config) {
	config.headers.Authorization = "FV69pR5PQQLcQ4wuMtTSqKqyYqf5XEK4";
	return config;
});

export default axiosInstance;
