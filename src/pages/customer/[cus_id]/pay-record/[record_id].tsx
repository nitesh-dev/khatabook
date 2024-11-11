import { Heading, List, Button, Tabs, VStack, Spinner } from "@chakra-ui/react";
import styles from "@/styles/customer/payrecord.module.scss";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { LuArrowLeft } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import BorrowRecordItem from "@/components/profile/BorrowRecordItem";
import { useRouter } from "next/router";
import { useApi } from "@/lib/utils";
import Api from "@/lib/api/Api";
import { toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import PayRecordItem from "@/components/profile/PayRecordItem";
import AddPayRecord from "@/components/dialogs/AddPayRecord";

export default function CustomerBorrowRecord() {
  const router = useRouter();
  const { record_id, cus_id } = router.query as any;
  const cusId = +cus_id || undefined;
  const recordId = +record_id || undefined;

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
  const borrowRecord = customer.records.find((r) => r.id == recordId);
  if (!borrowRecord || !cusId || !recordId) {
    return <VStack>Borrow record not found</VStack>;
  }
  // const totalPaid = borrowRecord.pay_records.reduce((sum, p) => {
  //   return sum + p.amount;
  // }, 0);
  const isCompleted = borrowRecord.status != "COMPLETED";

  return (
    <div className={styles.list_item}>
      <div className={styles.header}>
        <div className={styles.title_bar}>
          <IconButton onClick={() => router.back()} background={"transparent"}>
            <LuArrowLeft />
          </IconButton>
          <div>
            <Avatar size="md" name="Nitesh Kumar" />
            <Heading color={"white"} as="h3">
              Nitesh Kumar{" "}
            </Heading>
          </div>
        </div>
        <div className={styles.note}>{borrowRecord.notes}</div>

        <div className={styles.history_card}>
          <div>
            <span className={styles.success}>₹{borrowRecord.amount}</span>
            <p>Borrowed</p>
          </div>

          <div>
            <span className={styles.danger}>₹{borrowRecord.rem_amount}</span>
            <p>Remaining Balance</p>
          </div>
          <div>
            <span className={styles.danger}>
              ₹{borrowRecord.amount - borrowRecord.rem_amount}
            </span>
            <p>Total Paid</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>
          <Heading as="h2">Pay records</Heading>
          {isCompleted && (
            <AddPayRecord
              borrowId={recordId}
              onRefetch={() => {
                if (cusId != null) {
                  mutate(cusId);
                }
              }}
            />
          )}
        </div>
        <br />
        <List.Root>
          {borrowRecord.pay_records.map((r) => (
            <PayRecordItem
              key={r.id}
              amount={r.amount}
              borrow_record_id={recordId + ""}
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
