import type { NextApiRequest, NextApiResponse } from "next";

import data from "db/db.json";
import { WORD_LENGTH } from "db/config";

export type VerifyApiResponse = {
  valid: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyApiResponse>
) {
  const { items } = data;

  const word = String(req.query.word);

  const valid =
    word && word.length === WORD_LENGTH ? items.includes(word) : false;

  res.status(200).json({ valid });
}
