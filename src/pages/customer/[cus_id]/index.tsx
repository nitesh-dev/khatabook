import {
  Heading,
  List,
  Button,
  Tabs,
  HStack,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import styles from "@/styles/customer/profile.module.scss";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { LuArrowLeft } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import BorrowRecordItem from "@/components/profile/BorrowRecordItem";
import { useRouter } from "next/router";
import { toaster } from "@/components/ui/toaster";
import Api from "@/lib/api/Api";
import { useApi } from "@/lib/utils";
import { useShallowAppStore } from "@/store/app";
import { useEffect, useMemo } from "react";
import AddBorrowRecord from "@/components/dialogs/AddBorrowRecord";

export default function CustomerProfile() {
  const router = useRouter();
  const { cus_id } = router.query as any;
  const cusId = +cus_id || undefined;

  //find the customer if exist or load from database
  // const { customer, setCustomers } = useShallowAppStore((s) => ({
  //   setCustomers: s.setCustomers,
  //   customer: s.customers.find((c) => c.id == cus_id),
  // }));
  const { status, error, mutate, data: customer } = useApi(Api.getCustomerById);

  useEffect(() => {
    if (status == "error") {
      toaster.error({ title: error });
    }
  }, [status]);

  useEffect(() => {
    if (cusId != null) {
      mutate(cusId);
    }
  }, [cusId]);

  const totalBorrowed = useMemo(() => {
    if (!customer) return 0;
    return customer.records
      .filter((r) => r.status != "COMPLETED")
      .reduce((sum, r) => {
        return sum + r.amount;
      }, 0);
  }, [customer]);

  const totalPaid = useMemo(() => {
    if (!customer) return 0;
    return customer.records
      .filter((r) => r.status != "COMPLETED")
      .reduce((sum, r) => {
        return r.pay_records.reduce((sum, p) => {
          return sum + p.amount;
        }, sum);
      }, 0);
  }, [customer]);

  if (status == "loading" || status == "initial") {
    return (
      <VStack>
        <Spinner />
      </VStack>
    );
  }

  if (!customer || !cusId) {
    return <VStack>Customer not found</VStack>;
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.title_bar}>
          <IconButton background={"transparent"} onClick={() => router.back()}>
            <LuArrowLeft />
          </IconButton>
          <div>
            <Avatar size="md" name={customer.name} />
            <Heading color={"white"} as="h3">
              {customer.name}
              {/* <span style={{ opacity: 0.7 }}>(cus)</span> */}
            </Heading>
          </div>
        </div>

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
          <Heading as="h2">Borrow Records</Heading>
          {/* <Button>Add Record</Button> */}
          <AddBorrowRecord
            cusId={cusId}
            onRefetch={() => {
              if (cusId != null) {
                mutate(cusId);
              }
            }}
          />
        </div>
        <br />
        <Tabs.Root defaultValue="active">
          <Tabs.List>
            <Tabs.Trigger value="active">Active</Tabs.Trigger>
            <Tabs.Trigger value="completed">Completed</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="active">
            <List.Root>
              {customer.records
                .filter((r) => r.status != "COMPLETED")
                .map((r) => (
                  <BorrowRecordItem
                    borrowId={r.id}
                    cusId={cusId}
                    amount={r.amount}
                    due={r.rem_amount}
                    date={r.created_at.toString()}
                    note={r.notes}
                    paid={r.amount - r.rem_amount}
                    key={r.id}
                  />
                ))}
            </List.Root>
          </Tabs.Content>
          <Tabs.Content value="completed">
            <List.Root>
              {customer.records
                .filter((r) => r.status == "COMPLETED")
                .map((r) => (
                  <BorrowRecordItem
                    borrowId={r.id}
                    cusId={cusId}
                    amount={r.amount}
                    due={r.rem_amount}
                    date={r.created_at.toString()}
                    note={r.notes}
                    paid={r.amount - r.rem_amount}
                    key={r.id}
                  />
                ))}
            </List.Root>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
