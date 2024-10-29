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
  id: number;
  status: RecordStatus;
}

export function PATCH(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {
      // validate the auth
      validateHeader(req.headers);

      // validate the status
      if (!Object.values(RecordStatus).includes(req.body.status))
        throw new Error(
          "Invalid status type it must be one of the following: " +
            Object.values(RecordStatus)
        );

      const record = await prisma.borrow_record.update({
        where: { id: req.body.id },
        data: { status: req.body.status },
      });

      return makeResponse({ record }, 200);
    });
  });
}
