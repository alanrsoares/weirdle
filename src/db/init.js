const { resolve } = require("path");
const { readFile, writeFile } = require("fs/promises");

async function main() {
  try {
    const file = await readFile(resolve(__dirname, "wordlist.txt"), "utf-8");

    const rows = file
      .split("\n")
      .map((x) => x.trim())
      .filter((row) => /^[a-z]+$/gi.test(row));

    const fourLetterWords = rows.filter((x) => x.length === 4);
    const fiveLetterWords = rows.filter((x) => x.length === 5);

    const isNotPlural = (word) =>
      word.endsWith("s") ? !fourLetterWords.includes(word.slice(0, 4)) : true;

    const items = fiveLetterWords.filter(isNotPlural);

    const data = { length: items.length, items };

    await writeFile(resolve(__dirname, "db.json"), JSON.stringify(data));
  } catch (error) {
    console.log("failed to generate database");
  }
}

main();
