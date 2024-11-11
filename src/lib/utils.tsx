"use client";
import Api from "@/lib/api/Api";
import { AxiosResult } from "@/lib/DataType";
import { Customer } from "@/store/app";
import { useState, useCallback, useEffect } from "react";

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
export type PromiseConfig2<D> = {
  initial?: boolean;
  saveData?: (data: D) => void;
  args?: any;
};
export function useApi<D, Args = any>(
  promise: (args: Args) => Promise<AxiosResult<D>>,
  { initial, saveData, args }: PromiseConfig2<D> = {
    initial: false,
  }
) {
  const [data, setData] = useState<D>();
  const [statusCode, setStatusCode] = useState<number>();
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<Status>(initial ? "loading" : "initial");
  const mutate = useCallback((args: Args) => {
    //clear
    setError(undefined);
    setStatus("loading");
    promise(args)
      .then((result) => {
        console.log({ result });
        setStatusCode(result.statusCode);
        if (result.isOk) {
          saveData?.(result.data!);
          setData(result.data);
          setStatus("success");
        } else {
          setError(result.errorMessage);
          setStatus("error");
        }
      })
      .catch((error) => {
        setError(error.message);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    if (initial) {
      mutate(args as any);
    }
  }, [initial, args]);

  return { error, status, mutate, statusCode, data };
}

export function useLoadDataHook() {
  const [status, setStatus] = useState<Status>("initial");
  const [error, setError] = useState<string>();
  useEffect(() => {}, []);
}

// export function useApi<D, Args = any>(
//   promise: (args: Args) => Promise<AxiosResult<D>>,
//   { initial, errorFormatter }: PromiseConfig<string> = { initial: false }
// ) {
//   const {
//     data: result,
//     status,
//     error: _error,
//     mutate,
//   } = usePromise<AxiosResult<D>, string>(promise, { initial, errorFormatter });
//   const out = { mutate, status, error: _error, statusCode: 500 } as {
//     data?: D;
//     error?: string;
//     status: Status;
//     mutate: typeof mutate;
//     statusCode: number;
//   };
//   if (result) {
//     const { data, errorMessage: error, isOk } = result;
//     out.data = data || undefined;
//     if (!isOk) out.status = "error";
//     out.error = error?.message;
//     out.statusCode = error?.statusCode || 200;
//   }
//   return out;
// }
// const a = useApi(Api.createCustomer);

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function customerBorrowed(c: Customer) {
  return c.records
    .filter((r) => r.status != "COMPLETED")
    .reduce((sum, r) => {
      return sum + r.amount;
    }, 0);
}
export function customerPaid(c: Customer) {
  return c.records
    .filter((r) => r.status != "COMPLETED")
    .reduce((sum, r) => {
      return r.pay_records.reduce((sum, p) => {
        return sum + p.amount;
      }, sum);
    }, 0);
}

// import useSWR from "swr";

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
