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
    // cusId: z.coerce.number().int().nonnegative().min(1),
    amount: z.coerce.number().int().nonnegative().min(1),
    note: z.string(),
  })
  .required();

type AddBorrowRecordProps = {
  onRefetch?: () => void;
  cusId: number;
};
export default function AddBorrowRecord({
  onRefetch,
  cusId,
}: AddBorrowRecordProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { status, error, mutate } = useApi(Api.createBorrow);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate({
      amount: values.amount,
      cusId,
      note: values.note,
    });
  }
  useEffect(() => {
    if (status == "success") {
      onRefetch?.();
      setIsOpen(false);
      toaster.success({ title: "Added Record" });
    } else if (status == "error") {
      toaster.error({ title: error });
    }
  }, [status]);

  return (
    <DialogRoot open={isOpen} role="alertdialog">
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} size="sm">
          Add Record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Borrow Record</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  label="Amount"
                  errorText={error?.message}
                  invalid={error != undefined}
                >
                  <Input {...field} />
                </Field>
              )}
            />
            <Controller
              name="note"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  label="Note"
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
