import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
interface CredentialState {
  token: string | null;
  setToken: (token: string) => void;
}

export const useCredentialStore = create<CredentialState>()((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));




