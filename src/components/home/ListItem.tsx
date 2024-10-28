import styles from "@/styles/home/listItem.module.scss";
import { Heading, List } from "@chakra-ui/react";

import { Avatar } from "../ui/avatar";
export default function ListItem() {
  return (
    <List.Item>
      <div className={styles.list_item}>
        <div className={styles.left}>
          <Avatar size="md" name="Nitesh Kumar" />
          <div>
            <Heading as="h3">Nitesh Kumar</Heading>
            <span className="label">3 seconds ago</span>
          </div>
        </div>
        <div className={styles.right}>
          <Heading as="h3">₹1000</Heading>
        </div>
      </div>
    </List.Item>
  );
}
