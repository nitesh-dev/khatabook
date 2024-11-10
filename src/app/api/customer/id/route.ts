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
      const { id } = req.params
      if (id == undefined) {
        throw new CustomError("id is missing", 400)
      }

      const customer = await prisma.customer.findFirst({
        where: {
          id: parseInt(id)
        },
        include: {
          records: {
            include: {
              pay_records: true
            },
          }
        },
      });
      if (customer == null) {
        throw new CustomError("customer  " + id + " not found", 400)
      }

      return makeResponse({ data: customer }, 200);
    });
  });
}
