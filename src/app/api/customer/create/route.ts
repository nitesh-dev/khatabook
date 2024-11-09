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

export function POST(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {
      // validate the auth
      validateHeader(req.headers);

      const customer = await prisma.customer.create({
        data: req.body,
      });

      return makeResponse({ data: customer }, 200);
    });
  });
}
