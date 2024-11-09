import { BorrowRecord, Customer, PayRecord } from "@/store/app";
import type { AxiosResult } from "../DataType";
import AxiosApiInstance from "../axios";

namespace Api {
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
    return (await AxiosApiInstance.post(
      "/api/auth/login",
      data,
      header
    )) as any as AxiosResult<T>;
  }

  export async function getAllCustomer() {
    return (await AxiosApiInstance.get(
      "/api/customer/all",
      header
    )) as AxiosResult<Customer[]>;
  }
  type CreateCustomer = {
    name: string;
    email: string;
    phone: string;
    address: string;
  }

  export async function createCustomer(
    customer: CreateCustomer
  ) {
    return await AxiosApiInstance.post("/api/customer/create", customer) as AxiosResult<Customer>;
  }

  //borrow
  type CreateBorrowRecord = {
    cusId: number;
    amount: number;
    borrowDate?: string;
  }
  export async function createBorrow(
    borrow: CreateBorrowRecord
  ) {
    return await AxiosApiInstance.post("/api/customer/borrow/create", borrow) as AxiosResult<BorrowRecord>;
  }

  //create record
  type CreatePayRecord = {
    borrowId: number;
    amount: number;
    paymentDate?: string;
    note?: string;
  }
  export async function createPayRecord(
    value: CreatePayRecord
  ) {
    return await AxiosApiInstance.post("/api/customer/borrow/pay-record/create", value) as AxiosResult<PayRecord>;
  }




}

export default Api;
