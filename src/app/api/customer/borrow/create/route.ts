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
} from "../../../utils";

import prisma from "../../../../../../lib/prisma";
import { RecordStatus } from "@prisma/client";

interface Body {
  cusId: number;
  amount: number;
  borrowDate?: string;
}

export function POST(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {
      // validate the auth
      validateHeader(req.headers);

      let date = new Date();
      if (req.body.borrowDate) date = new Date(req.body.borrowDate);

      const record = await prisma.borrow_record.create({
        data: {
          amount: req.body.amount,
          borrow_date: date,
          status: RecordStatus.PENDING,
          rem_amount: req.body.amount,
          customer_id: req.body.cusId,
        },
      });

      return makeResponse({ data: record }, 200);
    });
  });
}
