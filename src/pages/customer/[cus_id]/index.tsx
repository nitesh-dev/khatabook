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
import ListItem from "@/components/profile/ListItem";
import { useRouter } from "next/router";
import { toaster } from "@/components/ui/toaster";
import Api from "@/lib/api/Api";
import { useApi } from "@/pages/utils";
import { useShallowAppStore } from "@/store/app";
import { useEffect } from "react";

export default function CustomerProfile() {
  const router = useRouter();
  const { cus_id } = router.query as any;
  console.log(cus_id);
  //find the customer if exist or load from database
  const { customer, setCustomers } = useShallowAppStore((s) => ({
    setCustomers: s.setCustomers,
    customer: s.customers.find((c) => c.id == cus_id),
  }));
  const { status, error } = useApi(Api.getAllCustomer, {
    saveData: (data) => setCustomers(data),
    initial: true,
  });

  useEffect(() => {
    if (status == "error") {
      toaster.error({ title: error });
    }
  }, [status]);

  if (status == "loading") {
    return (
      <VStack>
        <Spinner />
      </VStack>
    );
  }
  if (!customer) {
    return <VStack>Customer not found</VStack>;
  }
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.title_bar}>
          <IconButton background={"transparent"}>
            <LuArrowLeft />
          </IconButton>
          <div>
            <Avatar size="md" name={customer.name} />
            <Heading color={"white"} as="h3">
              {customer.name} <span style={{ opacity: 0.7 }}>(cus)</span>
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
              <ListItem />
              <ListItem />
              <ListItem />
              <ListItem />
            </List.Root>
          </Tabs.Content>
          <Tabs.Content value="completed">Manage your projects</Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
