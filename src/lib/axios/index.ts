import axios from "axios";
import type { AxiosResult } from "../DataType";

const AxiosApiInstance = axios.create({
  //@ts-ignore
  // baseURL: import.meta.env.VITE_SERVER_URL,
  baseURL: "http://localhost:3000",
});

// Function to get the bearer token from localStorage
function getBearerToken() {
  return localStorage.getItem("access_token") || "";
}

// Adding token to every request
AxiosApiInstance.interceptors.request.use(
  async function (config) {
    // await delay(2000) // temp for testing purpose

    const token = getBearerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// error handling to every request

AxiosApiInstance.interceptors.response.use(
  (response) => {
    console.log({ response })
    // Return the response data on success
    const res: AxiosResult<any> = {
      isOk: true,
      data: response.data.data,
      statusCode: response.status
    };
    return res as any;
  },
  (error) => {
    console.log({ error })
    let res: AxiosResult<any> = {
      isOk: false,
      statusCode: 500
    };

    if (error.response) {
      // The request was made, and the server responded with an error status
      res.errorMessage = error.response.data.errorMessage
      res.statusCode = error.response.status
    } else if (error.request) {
      // The request was made, but no response was received from the server
      res.errorMessage = "No response received from the server";;
      res.statusCode = 408
    } else {
      // Something else happened while setting up the request that triggered an error
      res.errorMessage = "Internal server error";;
      res.statusCode = 500
    }

    return res;
  }
);

export default AxiosApiInstance;
