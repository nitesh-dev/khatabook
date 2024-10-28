import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
    return makeResponse({ message: e.message }, 400);
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
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

export function validateHeader(headers: any) {
  if (headers.authorization === undefined) {
    throw new Error("Authorization header is missing");
  }

  const token = headers.authorization.split(" ")[1];
  const payload = verifyToken(token);
  if (payload === null) throw new Error("Invalid token");
  return payload;
}
