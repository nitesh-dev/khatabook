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
  }))
)

export function useShallowAppStore(s: (state: StateAndAction) => StateAndAction) {
  return useAppStore(
    useShallow(s)
  )
}


