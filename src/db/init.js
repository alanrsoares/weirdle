const path = require("path");
const fs = require("fs/promises");

async function main() {
  try {
    const file = await fs.readFile(
      path.resolve(__dirname, "wordlist.txt"),
      "utf-8"
    );

    const rows = file.split("\n");

    const items = rows.filter(
      (r) => r.trim().length === 5 && /^[a-z]+$/gi.test(r.trim())
    );

    const data = { length: items.length, items };

    await fs.writeFile(
      path.resolve(__dirname, "db.json"),
      JSON.stringify(data)
    );
  } catch (error) {
    console.log("failed to generate database");
  }
}

main();
