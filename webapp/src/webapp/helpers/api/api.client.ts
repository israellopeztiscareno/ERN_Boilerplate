// Dependencies
import axios, {
  CreateAxiosDefaults,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  AxiosError,
  HttpStatusCode,
} from "axios";
import HTTPServiceError from "./api.error";

const baseURL = typeof window !== "undefined" ? window.location.origin : "";

export const configDefaults: CreateAxiosDefaults = {
  baseURL,
  withCredentials: true,

  responseType: "json",
};

export const api = axios.create(configDefaults);

// Do not throw errors on 'bad' server response codes
api.interceptors.response.use(
  (axiosConfig) => axiosConfig,
  (error: AxiosError) => {
    return error.response;
  },
);

const generalError = { general: ["Unexpected Error Occurred"] };

const throwAPIError = ({
  status,
  data,
}: {
  status: HttpStatusCode;
  data: any;
}) => {
  throw new HTTPServiceError(JSON.stringify({ status, data }));
};

const HTTPService = async (method: Method, url: string, data?: any) => {
  let urlWithSlash = url;

  if (urlWithSlash[0] !== "/") {
    urlWithSlash = `/${urlWithSlash}`;
  }

  const options: AxiosRequestConfig = {
    method,
    url: urlWithSlash,
  };

  if (data) {
    if (method === "GET") {
      options.params = data;
    } else {
      options.data = data;
    }

    if (data === typeof FormData) {
      options.headers = {
        "Content-Type": "multipart/form-data",
      };
    }
  }

  const response: AxiosResponse = await api(options);

  if (
    response &&
    response.status &&
    response.status >= 200 &&
    response.status < 300
  ) {
    return response.data || {};
  }

  if (response && response.status && response.status === 400) {
    return throwAPIError(response);
  }

  return throwAPIError({ status: 500, data: generalError });
};

export default HTTPService;
