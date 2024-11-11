import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthData = {
  logout: () => void;
  login: () => void;
  isLogin: boolean;
};
const AuthContext = createContext<AuthData | null>(null);
type AuthProviderProps = React.PropsWithChildren<{}>;

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const logoutCallback = useCallback(() => {
    setAuthData((o) => ({ ...o, isLogin: false }));
    localStorage.removeItem("access_token");
  }, []);
  const loginCallback = useCallback(() => {
    setAuthData((o) => ({ ...o, isLogin: true }));
  }, []);
  const [authData, setAuthData] = useState<AuthData>({
    isLogin: false,
    logout: logoutCallback,
    login: loginCallback,
  });
  //redirect to login if not login
  useEffect(() => {
    if (router.pathname != "/login" && !authData.isLogin) {
      router.replace("/login");
    }
  }, [router.pathname, authData.isLogin]);
  if (router.pathname != "/login" && !authData.isLogin) {
    return null;
  }

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
