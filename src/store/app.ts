import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from "zustand/react/shallow";

import type { customer, pay_record, borrow_record } from '@prisma/client'
export type Customer = {} & customer
export type BorrowRecord = {} & borrow_record
export type PayRecord = {} & pay_record

type State = {
  customers: Customer[]
  borrowRecords: BorrowRecord[]
  payRecords: PayRecord[]
}

type Action = {
  setCustomers: (customers: Customer[]) => void
  addCustomer: (customer: Customer) => void

}

export type StateAndAction = State & Action

export const useAppStore = create<StateAndAction>()(
  immer((set) => ({
    customers: [],
    borrowRecords: [],
    payRecords: [],
    setCustomers: (customers) => {
      set((state) => {
        state.customers = customers
      })
    },
    addCustomer(customer) {
      set(s => {
        s.customers.push(customer)
      })
    },
  }))
)

export function useShallowAppStore<U>(s: (state: StateAndAction) => U) {
  return useAppStore(
    useShallow(s)
  )
}


