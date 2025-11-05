import { NextRequest, NextResponse } from "next/server";

import { WORD_LENGTH } from "~/db/config";
import data from "~/db/db.json";

export type VerifyApiResponse = {
  valid: boolean;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ word: string }> },
) {
  const { word } = await params;
  const { items } = data;

  const valid =
    word && word.length === WORD_LENGTH ? items.includes(word) : false;

  return NextResponse.json({ valid } satisfies VerifyApiResponse);
}
