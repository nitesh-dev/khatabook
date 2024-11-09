import type { AxiosResult } from "../DataType";
import AxiosInstance from "../axios";

namespace ApiAll {
  const header = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  export async function login<T>(username: string, password: string) {
    let data = {
      username,
      password,
    };
    return (await AxiosInstance.post(
      "/api/auth/login",
      data,
      header
    )) as any as AxiosResult<T>;
  }

  export async function getAllCustomer<T>() {
    return (await AxiosInstance.get(
      "/api/customer/all",
      header
    )) as any as AxiosResult<T>;
  }
}

export default ApiAll;
