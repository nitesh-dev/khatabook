// import { getData } from "../action";
import {
  catchAsyncError,
  comparePassword,
  CustomRequest,
  generateToken,
  handleRoute,
  hashPassword,
  makeResponse,
} from "../utils";

import prisma from "../../../../lib/prisma";

interface Body {
  username: string;
  password: string;
}

export function POST(request: Request) {
  return catchAsyncError(() => {
    return handleRoute(request, async (req: CustomRequest<Body>) => {

      // temp create credential
      // let hash = await hashPassword(req.body.password)
      // await prisma.credential.create({
      //   data: {
      //     username: req.body.username,
      //     hash_password: hash
      //   }
      // })

      const credential = await prisma.credential.findFirst({
        where: { username: req.body.username },
      });

      if (!credential) throw new Error("Invalid username or password");

      // check the password
      const isPasswordCorrect = await comparePassword(
        req.body.password,
        credential.hash_password
      );

      if (!isPasswordCorrect) throw new Error("Invalid username or password");

      // generate a token
      let token = generateToken(req.body.username);

      return makeResponse({ token }, 200);
    });
  });
}
