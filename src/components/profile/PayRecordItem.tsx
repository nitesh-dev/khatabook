import styles from "@/styles/customer/recordItem.module.scss";
import { Heading, List } from "@chakra-ui/react";
type PayRecordItemProps = {
  pay_record_id: string;
  borrow_record_id: string;
  createdAt: string;
  note: string;
  amount: number;
};
export default function PayRecordItem({
  pay_record_id,
  borrow_record_id,
  createdAt,
  note,
  amount,
}: PayRecordItemProps) {
  return (
    <List.Item>
      <div className={styles.list_item}>
        <div className={styles.content}>
          <span>{createdAt}</span>

          <p>{note}</p>
        </div>
        <div className={styles.footer}>
          <div>
            <span>Amt</span>
            <span>{amount}</span>
          </div>
          {/* <div>
            <span>Paid</span>
            <span>₹100</span>
          </div>
          <div>
            <span>Due</span>
            <span>₹100</span>
          </div> */}
        </div>
      </div>
    </List.Item>
  );
}
