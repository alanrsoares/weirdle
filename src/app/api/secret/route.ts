import { NextRequest, NextResponse } from "next/server";

import { randomInt } from "crypto";
import data from "~/db/db.json";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionState } from "~/lib/session";

export type SecretApiResponse = {
  secret: string;
};

export async function GET(request: NextRequest) {
  const response = new NextResponse();
  const session = await getIronSession<SessionState>(
    request,
    response,
    sessionOptions,
  );

  const { length, items } = data;

  const secret = items[randomInt(length)];

  session.secret = secret;
  await session.save();

  return NextResponse.json({ secret } satisfies SecretApiResponse, {
    headers: response.headers,
  });
}
