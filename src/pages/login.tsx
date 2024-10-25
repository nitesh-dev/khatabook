import styles from "../styles/login.module.scss";
import { Avatar } from "@/components/ui/avatar";
import { Input, Button, Heading } from "@chakra-ui/react";

export default function Login() {
  return (
    <div className={styles.login_box}>
      <div className="card">
        <Heading as="h2">Login</Heading>
        <br />
        <form>
          <div className={styles.input_container}>
            <label htmlFor="username">Username</label>
            <Input id="username" placeholder="Username" />
          </div>

          <br />

          <div className={styles.input_container}>
            <label htmlFor="password">Password</label>
            <Input id="password" type="password" placeholder="password" />
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
