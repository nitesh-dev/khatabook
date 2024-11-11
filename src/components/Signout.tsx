import { useAuth } from "@/lib/AuthProvider";
import { Button } from "./ui/button";

export default function Signout() {
  const { isLogin, logout } = useAuth();
  if (!isLogin) return null;
  return (
    <div
      style={{
        position: "fixed",
        right: "8px",
        top: "8px",
      }}
    >
      <Button onClick={logout} colorPalette={"red"}>
        Sign out
      </Button>
    </div>
  );
}
