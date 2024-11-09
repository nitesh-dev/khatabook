import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Prisma } from "@prisma/client";
dotenv.config();

let SECRET_KEY = process.env.SECRET_KEY || "secret";

export type CustomRequest<T> = {
  native: Request;
  body: T;
  params: any;
  headers: any;
};



export async function handleRoute<T>(
  request: Request,
  callback: (req: CustomRequest<T>) => Promise<Response>
) {
  const body = (await parseBody(request)) as T;
  const urlParams = new URL(request.url).searchParams;
  const params = Object.fromEntries(urlParams.entries());

  //convert heasers to object
  let headers: {
    [key: string]: string;
  } = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return callback({
    native: request,
    body: body,
    params: params,
    headers: headers,
  });
}

export async function parseBody<T>(req: Request) {
  try {
    const body = await req.json();
    return body as Promise<T>;
  } catch (e) {
    // console.error(e);
    return {} as Promise<T>;
  }
}

export function makeResponse(
  result: any,
  statusCode: number,
  message?: string
) {
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
    status: statusCode,
  });
}

export async function hashPassword(plainPassword: string) {
  // Generate a salt
  const saltRounds = 10; // Higher rounds mean stronger hash but slower
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password with the salt
  return await bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(
  plainPassword: string,
  hashPassword: string
) {
  return await bcrypt.compare(plainPassword, hashPassword);
}

export async function catchAsyncError(
  callback: () => Promise<Response>
): Promise<Response> {
  try {
    return await callback();
  } catch (e: any) {
    // console.log(e.cause.code);
    let code = 500
    if (e instanceof CustomError) {
      code = e.code
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {

    }
    console.log(e)
    return makeResponse({ errorMessage: e.message }, code);
  }
}

// generate a JWT
export function generateToken(username: string): string {
  return jwt.sign({ username }, SECRET_KEY);
}

export interface JwtPayload {
  username: string;
}

// verify a JWT
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error: any) {
    throw new CustomError("Invalid authorization header provided", 401);
  }
}

export function validateHeader(headers: any) {
  if (headers.authorization === undefined) {
    throw new CustomError("Authorization header is missing", 401);
  }

  const token = headers.authorization.split(" ")[1];
  const payload = verifyToken(token);
  return payload;
}

export class CustomError extends Error {
  constructor(message: string, public code: number) {
    super(message, { cause: { code } });
  }
}
