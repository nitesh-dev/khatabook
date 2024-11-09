"use client";
import { useState, useCallback } from "react";

export type Status = "initial" | "loading" | "success" | "error";
export type PromiseConfig<E> = {
  initial?: boolean;
  errorFormatter?: (error: Error) => E;
};
export function usePromise<D, E = string, Args = any>(
  promise: (args: Args) => Promise<D>,
  { initial, errorFormatter }: PromiseConfig<E> = { initial: false }
) {
  const [data, setData] = useState<D>();
  const [error, setError] = useState<E>();
  const [status, setStatus] = useState<Status>("initial");
  const mutate = useCallback((args: Args) => {
    //clear
    setData(undefined);
    setError(undefined);
    setStatus("loading");
    promise(args)
      .then((data) => {
        setData(data);
        setStatus("success");
      })
      .catch((error) => {
        if (errorFormatter) {
          setError(errorFormatter(error));
        } else {
          setError(error.message as E);
        }
        setStatus("error");
      });
  }, []);

  return { data, error, status, mutate };
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// import useSWR from "swr";

export class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// export type JsonFetcherType = {
//   url: string;
//   method: "GET" | "POST" | "PUT" | "DELETE";
//   headers?: any;
//   body?: any;
// };

// export async function jsonFetcher<T = any>(args: JsonFetcherType): Promise<T> {
//   const { url, method, headers, body } = args;
//   const requestInit: RequestInit = {
//     method: method,
//     headers: {
//       "Content-Type": "application/json",
//       ...headers,
//     },
//     redirect: "follow",
//   };
//   if (body) {
//     requestInit.body = typeof body === "string" ? body : JSON.stringify(body);
//   }
//   console.log("fetching data from", url);
//   const res = await fetch(url, requestInit);
//   if (!res.ok) {
//     const data = await res.json();
//     const error = new CustomError(data.message, res.status);
//     throw error;
//   }

//   return res.json() as Promise<T>;
// }

// export function useJsonSWR<T>(args: JsonFetcherType) {
//   return useSWR<T, CustomError, JsonFetcherType>(args, jsonFetcher);
// }
