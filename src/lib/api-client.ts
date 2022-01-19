import type { SecretApiResponse } from "pages/api/secret";
import type { VerifyApiResponse } from "pages/api/verify/[word]";

export async function getSecretWord() {
  return await fetch("/api/secret").then((x) => x.json() as Promise<SecretApiResponse>);
}

export async function verifyWord(word: string) {
  return await fetch(`/api/verify/${word}`).then((x) => x.json() as Promise<VerifyApiResponse>);
}
