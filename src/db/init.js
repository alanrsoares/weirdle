import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";

import { WORD_LENGTH } from "./config";

async function main() {
  try {
    const file = await readFile(resolve(__dirname, "wordlist.txt"), "utf-8");

    const rows = file.split("\n");

    const items = rows.filter(
      (row) =>
        row.trim().length === WORD_LENGTH && /^[a-z]+$/gi.test(row.trim())
    );

    const data = { length: items.length, items };

    await writeFile(resolve(__dirname, "db.json"), JSON.stringify(data));
  } catch (error) {
    console.log("failed to generate database");
  }
}

main();
