import styles from "@/styles/customer/recordItem.module.scss";
import { Heading, List } from "@chakra-ui/react";
export default function RecordItem() {
  return (
    <List.Item>
      <div className={styles.list_item}>
        <div className={styles.content}>
          <span>12 jan 2022</span>
  
          <p>I have given the money for the some task</p>
          
        </div>
        <div className={styles.footer}>
          <div>
            <span>Amt</span>
            <span>₹100</span>
          </div>
          <div>
            <span>Paid</span>
            <span>₹100</span>
          </div>
          <div>
            <span>Due</span>
            <span>₹100</span>
          </div>
        </div>
      </div>
    </List.Item>
  );
}
