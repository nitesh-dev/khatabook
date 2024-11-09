import useSWR from "swr";

export class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type JsonFetcherType = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: any;
  body?: any;
};

export async function jsonFetcher<T = any>(args: JsonFetcherType): Promise<T> {
  const { url, method, headers, body } = args;
  const requestInit: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    redirect: "follow",
  };
  if (body) {
    requestInit.body = typeof body === "string" ? body : JSON.stringify(body);
  }
  console.log("fetching data from", url);
  const res = await fetch(url, requestInit);
  if (!res.ok) {
    const data = await res.json();
    const error = new CustomError(data.message, res.status);
    throw error;
  }

  return res.json() as Promise<T>;
}

export function useJsonSWR<T>(args: JsonFetcherType) {
  return useSWR<T, CustomError, JsonFetcherType>(args, jsonFetcher);
}

