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
} from "../../utils";

import prisma from "../../../../../lib/prisma";

interface Body {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function GET(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {
      // validate the auth
      validateHeader(req.headers);

      const customers = await prisma.customer.findMany({
        include: {
          records: {
            include: {
              pay_records: true
            },
            where: {
              status: "PENDING"
            }
          }
        },
      });

      return makeResponse({ data: customers }, 200);
    });
  });
}
