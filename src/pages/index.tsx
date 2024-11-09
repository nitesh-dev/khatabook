import ListItem from "@/components/home/ListItem";
import styles from "../styles/home.module.scss";
import { Heading, List, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import ApiAll from "@/lib/api/ApiAll";
import AddCustomerDialog from "@/components/dialogs/AddCustomer";

export default function Home() {
  useEffect(() => {
    (async () => {
      const data = await ApiAll.getAllCustomer();
      console.log(data);
    })();
  }, []);

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
          <AddCustomerDialog />
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
