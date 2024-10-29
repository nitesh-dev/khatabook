// import { getData } from "../action";
import {
  catchAsyncError,
  comparePassword,
  CustomRequest,
  generateToken,
  handleRoute,
  hashPassword,
  makeResponse,
  validateHeader,
} from "../../../../utils";

import prisma from "../../../../../../../lib/prisma";
import { RecordStatus } from "@prisma/client";

export function DELETE(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {
      // validate the auth
      validateHeader(req.headers);

      const payRecord = await prisma.pay_record.findFirst({
        where: { id: Number(req.params.id) },
        include: {
          borrow_record: true,
        },
      });

      if (!payRecord) throw new Error("Record not found");

      // transaction
      const res = await prisma.$transaction([
        prisma.borrow_record.update({
          where: { id: payRecord.borrow_record_id },
          data: {
            // have to change the status to complete if the remaining amount is 0 or less
            rem_amount: {
              increment: payRecord.amount,
            },
            status:
              payRecord.borrow_record!!.status == RecordStatus.IDEAL
                ? RecordStatus.IDEAL
                : RecordStatus.PENDING,
          },
        }),
        prisma.pay_record.delete({
          where: { id: payRecord.id },
        }),
      ]);

      return makeResponse({ res }, 200);
    });
  });
}
