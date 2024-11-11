import styles from "@/styles/home/listItem.module.scss";
import { Heading, List } from "@chakra-ui/react";

import { Avatar } from "../ui/avatar";
import { useRouter } from "next/router";
type ListItemProps = {
  name: string;
  borrowed: number;
  paid: number;
  lastTime: string;
  id: number;
};
export default function CustomerItem({
  name,
  borrowed,
  lastTime,
  paid,
  id,
}: ListItemProps) {
  const router = useRouter();
  return (
    <List.Item
      onClick={() => {
        router.push("/customer/" + id);
      }}
    >
      <div className={styles.list_item}>
        <div className={styles.left}>
          {process.env.NODE_ENV == "development" && <span> {id}</span>}
          <Avatar size="md" name={name} />
          <div>
            <Heading as="h3">{name}</Heading>
            <span className="label">{lastTime}</span>
          </div>
        </div>
        <div className={styles.right}>
          <Heading as="h3">₹{borrowed}</Heading>
          <Heading as="h5" size="sm">
            ₹{paid}
          </Heading>
        </div>
      </div>
    </List.Item>
  );
}
