import ListItem from "@/components/home/ListItem";
import styles from "../styles/home.module.scss";
import { Heading, List, Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <div className={styles.history_card}>
          <div>
            <span className={styles.success}>₹100</span>
            <p>You will give</p>
          </div>

          <div>
            <span className={styles.danger}>₹100</span>
            <p>You will get</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>
          <Heading as="h2">Customers</Heading>
          <Button>Add Customer</Button>
        </div>
        <br />
        <List.Root>
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
        </List.Root>
      </div>
    </div>
  );
}
