import { create } from "zustand";

interface State {
  token: string | null;
  setToken: (token: string) => void;
}

export const useCredentialStore = create<State>()((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
