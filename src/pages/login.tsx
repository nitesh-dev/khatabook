import styles from "../styles/login.module.scss";
import { Avatar } from "@/components/ui/avatar";
import Api from "@/lib/api/Api";
import { Input, Heading } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Field } from "@/components/ui/field";
import { useApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthProvider";

const formSchema = z
  .object({
    username: z.string().min(3),
    password: z.string().min(3),
  })
  .required();

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { status, error, mutate, data } = useApi(
    (args: z.infer<typeof formSchema>) => {
      return Api.login<string>(args.username, args.password);
    }
  );
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values);
  }
  useEffect(() => {
    if (status == "success") {
      toaster.success({ title: "Login successfully" });
      console.log(data);
      if (data) {
        localStorage.setItem("access_token", data);
        router.replace("/");
        login();
      }
    } else if (status == "error") {
      toaster.error({ title: error });
    }
  }, [status]);
  return (
    <div className={styles.login_box}>
      <div className="card">
        <Heading as="h2">Login</Heading>
        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.input_container}>
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  label="Username"
                  errorText={error?.message}
                  invalid={error != undefined}
                >
                  <Input {...field} />
                </Field>
              )}
            />
          </div>
          <br />
          <div className={styles.input_container}>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  label="Password"
                  errorText={error?.message}
                  invalid={error != undefined}
                >
                  <Input {...field} />
                </Field>
              )}
            />
          </div>

          <br />
          <Button
            type="submit"
            alignSelf="flex-start"
            loading={status == "loading"}
            loadingText="Logging..."
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
function _Login() {
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
