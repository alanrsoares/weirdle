import { withIronSession, Handler } from "next-iron-session";
import { SESSION_COOKIE_NAME } from "./config";

export type SessionState = {
  secret?: string;
};

export function withSession<TReq, TRes>(
  handler: Handler<TReq, TRes>,
  cookieName: string = SESSION_COOKIE_NAME
) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD ?? "",
    cookieName,
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === "production",
    },
  });
}
