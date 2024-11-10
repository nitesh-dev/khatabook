import { Heading, List, Button, Tabs, VStack, Spinner } from "@chakra-ui/react";
import styles from "@/styles/customer/profile.module.scss";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { LuArrowLeft } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import BorrowRecordItem from "@/components/profile/BorrowRecordItem";
import { useRouter } from "next/router";
import { useApi } from "@/pages/utils";
import Api from "@/lib/api/Api";
import { toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import PayRecordItem from "@/components/profile/PayRecordItem";

export default function CustomerBorrowRecord() {
  const router = useRouter();
  const { record_id, cus_id } = router.query as any;
  const { status, error, mutate, data: customer } = useApi(Api.getCustomerById);
  useEffect(() => {
    if (status == "error") {
      toaster.error({ title: error });
    }
  }, [status]);
  useEffect(() => {
    if (cus_id != null) {
      mutate(cus_id);
    }
  }, [cus_id]);
  if (status == "loading" || status == "initial") {
    return (
      <VStack>
        <Spinner />
      </VStack>
    );
  }

  if (!customer) {
    return <VStack>Customer not found</VStack>;
  }
  const borrowRecord = customer.records.find((r) => r.id == record_id);
  if (!borrowRecord) {
    return <VStack>Borrow record not found</VStack>;
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.title_bar}>
          <IconButton onClick={() => router.back()} background={"transparent"}>
            <LuArrowLeft />
          </IconButton>
          <div>
            <Avatar size="md" name="Nitesh Kumar" />
            <Heading color={"white"} as="h3">
              Nitesh Kumar <span style={{ opacity: 0.7 }}>(cus)</span>
            </Heading>
          </div>
        </div>

        {/* <div className={styles.history_card}>
          <div>
            <p>You will give</p>
            <span className={styles.success}>₹100</span>
          </div>

          <div>
            <span className={styles.danger}>₹100</span>
            <p>You will get</p>
          </div>
        </div> */}
      </div>

      <div className={styles.content}>
        <div className={styles.title}>
          <Heading as="h2">Pay records</Heading>
          <Button>Add pay record</Button>
        </div>
        <br />
        <List.Root>
          {borrowRecord.pay_records.map((r) => (
            <PayRecordItem
              key={r.id}
              amount={r.amount}
              borrow_record_id={record_id}
              createdAt={r.created_at.toString()}
              note={r.notes}
              pay_record_id={r.id + ""}
            />
          ))}
        </List.Root>
      </div>
    </div>
  );
}
