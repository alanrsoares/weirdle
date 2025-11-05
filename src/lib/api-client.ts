import type { SecretApiResponse } from "~/app/api/secret/route";
import type { VerifyApiResponse } from "~/app/api/verify/[word]/route";

export async function getSecretWord() {
  return await fetch("/api/secret").then(
    (x) => x.json() as Promise<SecretApiResponse>,
  );
}

export async function verifyWord(word: string) {
  return await fetch(`/api/verify/${word}`).then(
    (x) => x.json() as Promise<VerifyApiResponse>,
  );
}
