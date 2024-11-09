// import { getData } from "../action";
import {
  catchAsyncError,
  comparePassword,
  CustomError,
  CustomRequest,
  generateToken,
  handleRoute,
  hashPassword,
  makeResponse,
  validateHeader,
} from "../../../../utils";

import prisma from "../../../../../../../lib/prisma";
import { RecordStatus } from "@prisma/client";

interface Body {
  borrowId: number;
  amount: number;
  paymentDate?: string;
  note?: string;
}

export function POST(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {
      // validate the auth
      validateHeader(req.headers);

      let date = new Date();
      if (req.body.paymentDate) date = new Date(req.body.paymentDate);

      let notes = req.body.note ? req.body.note : "";

      let record = await prisma.borrow_record.findFirst({
        where: { id: req.body.borrowId },
      });

      if (!record) throw new CustomError("Record not found", 400);

      const res = await prisma.$transaction([
        prisma.borrow_record.update({
          where: { id: req.body.borrowId },
          data: {
            rem_amount: {
              decrement: req.body.amount,
            },
            status:
              record!!.rem_amount - req.body.amount <= 0
                ? RecordStatus.COMPLETED
                : RecordStatus.PENDING,
          },
        }),

        prisma.pay_record.create({
          data: {
            amount: req.body.amount,
            payment_date: date,
            notes: notes,
            borrow_record_id: req.body.borrowId,
          },
        }),
      ]);

      return makeResponse({ data: res[1] }, 200);
    });
  });
}
