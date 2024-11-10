import ListItem from "@/components/home/ListItem";
import styles from "../styles/home.module.scss";
import { Heading, List, Button, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import Api from "@/lib/api/Api";
import AddCustomerDialog from "@/components/dialogs/AddCustomer";
import { useApi } from "./utils";
import { useShallowAppStore } from "@/store/app";
import { toaster } from "@/components/ui/toaster";

export default function Home() {
  // const { customers, setCustomers } = useShallowAppStore((s) => ({
  //   customers: s.customers,
  //   setCustomers: s.setCustomers,
  // }));
  const {
    status,
    error,
    data: customers = [],
    mutate,
  } = useApi(Api.getAllCustomer, {
    initial: true,
  });
  useEffect(() => {
    if (status == "error") {
      toaster.error({ title: error });
    }
  }, [status]);

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
          <AddCustomerDialog
            onRefetch={() => {
              mutate(undefined);
            }}
          />
        </div>
        <br />
        {status == "loading" ? (
          <Spinner size={"md"} />
        ) : (
          <List.Root>
            {customers.map((c) => (
              <ListItem
                name={c.name}
                borrowed={1000}
                lastTime={c.updated_at.toString()}
                key={c.id}
                id={c.id}
              />
            ))}
          </List.Root>
        )}
      </div>
    </div>
  );
}
