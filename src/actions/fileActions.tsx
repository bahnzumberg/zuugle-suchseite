import axios from "../axios";
import { AxiosResponse, ResponseType } from "axios";

// TODO: should this use dispatch?
export function loadGPX(url: string, responseType: ResponseType = "text") {
  return async () => {
    try {
      const res: AxiosResponse = await axios.get(url, {
        timeout: 60000,
        responseType: responseType,
      });
      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
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
    }
  };
}
