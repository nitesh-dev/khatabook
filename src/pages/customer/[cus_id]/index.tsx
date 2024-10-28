import { Heading, List, Button, Tabs } from "@chakra-ui/react";
import styles from "@/styles/customer/profile.module.scss";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { LuArrowLeft } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import ListItem from "@/components/profile/ListItem";

export default function CustomerProfile() {
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.title_bar}>
          <IconButton background={"transparent"}>
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
          <Heading as="h2">Records</Heading>
          <Button>Add Record</Button>
        </div>
        <br />
        <Tabs.Root defaultValue="active">
          <Tabs.List>
            <Tabs.Trigger value="active">Active</Tabs.Trigger>
            <Tabs.Trigger value="completed">Completed</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="active">
            <List.Root>
                <ListItem/>
                <ListItem/>
                <ListItem/>
                <ListItem/>
            </List.Root>
          </Tabs.Content>
          <Tabs.Content value="completed">Manage your projects</Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
