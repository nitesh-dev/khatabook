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
  oldPassword: string;
  newPassword: string;
}

export function POST(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {
      // validate the auth
      const value = validateHeader(req.headers)!!;

      const credential = await prisma.credential.findFirst({
        where: { username: value.username },
      });

      if (!credential) throw new CustomError("Something went wrong!", 500);

      // check the password
      const isPasswordCorrect = await comparePassword(
        req.body.oldPassword,
        credential.hash_password
      );

      if (!isPasswordCorrect) throw new CustomError("Invalid password", 400);

      let hash = await hashPassword(req.body.newPassword);
      await prisma.credential.update({
        where: { id: credential.id },
        data: { hash_password: hash },
      });

      return makeResponse({ message: "update successfully" }, 200);
    });
  });
}
