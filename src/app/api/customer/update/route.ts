// import { getData } from "../action";
import {
  catchAsyncError,
  CustomRequest,
  handleRoute,
  makeResponse,
  validateHeader,
} from "../../utils";

import prisma from "../../../../../lib/prisma";

interface Body {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function PATCH(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {
      // validate the auth
      validateHeader(req.headers);
      let id = req.body.id;
      let value = req.body;
      delete value.id;

      const customer = await prisma.customer.update({
        where: {
          id: id
        },
        data: value,
      });

      return makeResponse({ data: customer }, 200);
    });
  });
}
