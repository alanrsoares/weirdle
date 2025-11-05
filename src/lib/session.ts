import type { SessionOptions } from "iron-session";

import { SESSION_COOKIE_NAME } from "./config";

export type SessionState = {
  secret?: string;
};

const getPassword = (): string => {
  const password = process.env.SECRET_COOKIE_PASSWORD;

  if (!password) {
    throw new Error(
      "SECRET_COOKIE_PASSWORD environment variable is required. " +
        "Please set it to a string of at least 32 characters.",
    );
  }

  if (password.length < 32) {
    throw new Error(
      "SECRET_COOKIE_PASSWORD must be at least 32 characters long for security.",
    );
  }

  return password;
};

export const sessionOptions: SessionOptions = {
  password: getPassword(),
  cookieName: SESSION_COOKIE_NAME,
  cookieOptions: {
    // the next line allows to use the session in non-https environments like
    // Next.js dev mode (http://localhost:3000)
    secure: process.env.NODE_ENV === "production",
  },
};
