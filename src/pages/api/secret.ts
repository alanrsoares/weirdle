import type { NextApiRequest, NextApiResponse } from "next";

import data from "db/db.json";
import { randomInt } from "crypto";

export type SecretApiResponse = {
  secret: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<SecretApiResponse>) {
  const { length, items } = data;

  const secretIndex = randomInt(length);

  res.status(200).json({ secret: items[secretIndex] });
}
