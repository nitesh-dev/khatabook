import { Button } from "@/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fieldset, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useApi, usePromise } from "@/lib/utils";
import Api from "@/lib/api/Api";
import { toaster } from "../ui/toaster";
import { useShallowAppStore } from "@/store/app";

const formSchema = z
  .object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    phone: z.string().length(10),
    address: z.string().min(2),
  })
  .required();

type AddCustomerDialogProps = {
  onRefetch?: () => void;
};
export default function AddCustomerDialog({
  onRefetch,
}: AddCustomerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  // const { addCustomer } = useShallowAppStore((s) => ({
  //   addCustomer: s.addCustomer,
  // }));
  const { status, error, mutate } = useApi(Api.createCustomer);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values);
  }
  useEffect(() => {
    if (status == "success") {
      onRefetch?.();
      setIsOpen(false);
      toaster.success({ title: "Added user" });
    } else if (status == "error") {
      toaster.error({ title: error });
    }
  }, [status]);

  return (
    <DialogRoot open={isOpen} role="alertdialog">
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} size="sm">
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  label="Name"
                  errorText={error?.message}
                  invalid={error != undefined}
                >
                  <Input {...field} />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  label="Email"
                  errorText={error?.message}
                  invalid={error != undefined}
                >
                  <Input {...field} />
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  label="Phone"
                  errorText={error?.message}
                  invalid={error != undefined}
                >
                  <Input {...field} />
                </Field>
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  label="Address"
                  errorText={error?.message}
                  invalid={error != undefined}
                >
                  <Input {...field} />
                </Field>
              )}
            />
            <Button
              type="submit"
              alignSelf="flex-start"
              loading={status == "loading"}
              loadingText="Creating..."
            >
              Submit
            </Button>
          </form>
        </DialogBody>

        {status != "loading" && (
          <DialogCloseTrigger onClick={() => setIsOpen(false)} />
        )}
      </DialogContent>
    </DialogRoot>
  );
}

/**
 
   <Fieldset.Root onSubmit={handleSubmit(onSubmit)} size="lg" maxW="md">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Fieldset.Content>
              <Field label="Name">
                <Input {...register("name")} />
              </Field>

              <Field label="Email address">
                <Input {...register("email")} type="email" />
              </Field>
              <Field label="Phone">
                <Input {...register("phone")} type="text" />
              </Field>
              <Field label="Address">
                <Input {...register("address")} name="address" />
              </Field>
            </Fieldset.Content>
            <Button type="submit" alignSelf="flex-start">
              Submit
            </Button>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button type="submit" alignSelf="flex-start">
              Submit
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </Fieldset.Root>

 * 
 * 
 */
