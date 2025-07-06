import axios from "../axios";

export function loadGPX(url, responseType = "buffer") {
  return () => {
    return axios
      .get(url, {
        data: {},
        timeout: 60000,
        responseType: responseType,
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        // Handle different types of errors
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Server responded with status:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received from the server:", error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.error("Error setting up request:", error.message);
        }
        // Reject the promise with the error
        throw error;
      });
  };
}
