import styles from "@/styles/customer/listItem.module.scss";
import { Heading, List } from "@chakra-ui/react";

import { Avatar } from "../ui/avatar";
import { useRouter } from "next/router";
type ListItemProps = {
  note: string;
  amount: number;
  paid: number;
  due: number;
  date: string;
  borrowId: number;
  cusId: number;
};
export default function BorrowRecordItem({
  note,
  amount,
  paid,
  due,
  date,
  borrowId,
  cusId,
}: ListItemProps) {
  const router = useRouter();
  return (
    <List.Item
      onClick={() => {
        router.push("/customer/" + cusId + "/pay-record/" + borrowId);
      }}
    >
      <div className={styles.list_item}>
        {process.env.NODE_ENV == "development" && <span> {borrowId}</span>}
        <div className={styles.content}>
          <span>{date}</span>
          <p>{note}</p>
        </div>
        <div className={styles.footer}>
          <div>
            <span>Amt</span>
            <span>{amount}</span>
          </div>
          <div>
            <span>Paid</span>
            <span>{paid}</span>
          </div>
          <div>
            <span>Due</span>
            <span>{due}</span>
          </div>
        </div>
      </div>
    </List.Item>
  );
}
