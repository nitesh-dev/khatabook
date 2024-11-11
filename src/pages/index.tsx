import CustomerItem from "@/components/home/CustomerItem";
import styles from "../styles/home.module.scss";
import { Heading, List, Button, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import Api from "@/lib/api/Api";
import AddCustomerDialog from "@/components/dialogs/AddCustomer";
import { customerBorrowed, customerPaid, useApi } from "../lib/utils";
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

  const totalBorrowed = useMemo(() => {
    return customers.reduce((sum, c) => {
      return c.records
        .filter((r) => r.status != "COMPLETED")
        .reduce((sum, r) => {
          return sum + r.amount;
        }, sum);
    }, 0);
  }, [customers]);

  const totalPaid = useMemo(() => {
    return customers.reduce((sum, c) => {
      return c.records
        .filter((r) => r.status != "COMPLETED")
        .reduce((sum, r) => {
          return r.pay_records.reduce((sum, p) => {
            return sum + p.amount;
          }, sum);
        }, sum);
    }, 0);
  }, [customers]);

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <div className={styles.history_card}>
          <div>
            <span className={styles.success}>₹{totalBorrowed}</span>
            <p>Total Borrowed</p>
          </div>

          <div>
            <span className={styles.danger}>₹{totalBorrowed - totalPaid}</span>
            <p>Remaining Balance</p>
          </div>
          <div>
            <span className={styles.danger}>₹{totalPaid}</span>
            <p>Total Paid</p>
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
              <CustomerItem
                name={c.name}
                borrowed={customerBorrowed(c)}
                paid={customerPaid(c)}
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
