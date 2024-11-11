import styles from "../styles/login.module.scss";
import { Avatar } from "@/components/ui/avatar";
import Api from "@/lib/api/Api";
import { Input, Button, Heading } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  function changePassword(value: string) {
    setForm({ ...form, password: value });
  }

  function changeUsername(value: string) {
    setForm({ ...form, username: value });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await Api.login<{ token: string }>(
      form.username,
      form.password
    );

    if (res.data) {
      toaster.create({
        description: "Login successful",
        type: "success",
      });

      localStorage.setItem("access_token", res.data.token);

      router.replace("/");
    } else {
      toaster.create({
        description: res.errorMessage,
        type: "error",
      });
    }
  }
  return (
    <div className={styles.login_box}>
      <div className="card">
        <Heading as="h2">Login</Heading>
        <br />
        <form onSubmit={onSubmit}>
          <div className={styles.input_container}>
            <label htmlFor="username">Username</label>
            <Input
              value={form.username}
              onChange={(e) => changeUsername(e.target.value)}
              id="username"
              placeholder="Username"
            />
          </div>
          <br />
          <div className={styles.input_container}>
            <label htmlFor="password">Password</label>
            <Input
              value={form.password}
              onChange={(e) => changePassword(e.target.value)}
              id="password"
              type="password"
              placeholder="password"
            />
          </div>

          <br />
          <Button colorScheme="blue" width={"36"} type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
