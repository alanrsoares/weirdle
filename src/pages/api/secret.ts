import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-iron-session";

import data from "db/db.json";
import { randomInt } from "crypto";
import { withSession } from "lib/session";

export type SecretApiResponse = {
  secret: string;
};

export type Request = NextApiRequest & { session: Session };

export async function handler(
  req: Request,
  res: NextApiResponse<SecretApiResponse>
) {
  const { length, items } = data;

  const secret = items[randomInt(length)];

  req.session.set("secret", secret);
  await req.session.save();

  res.status(200).json({ secret });
}

export default withSession(handler);
