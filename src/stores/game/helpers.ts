import { without } from "ramda";
import { GameTile } from "./types";

export function getNextTile(tile: GameTile, secret: string): GameTile {
  const key = tile.children.trim().toLowerCase();

  const exists = secret.includes(key);

  if (exists) {
    const exact = secret[tile.cursor.x] === key;

    return {
      ...tile,
      variant: exact ? "correct" : "present",
    };
  }

  return {
    ...tile,
    variant: "absent",
  };
}

export function findLastNonEmptyTile(row: GameTile[]) {
  return row.reduce<GameTile | null>(
    (acc, tile) => (tile.children ? tile : acc),
    null
  );
}

export function getRowWord(row: GameTile[]) {
  return row
    .map((x) => x.children.trim())
    .filter(Boolean)
    .join("");
}

export function didWin(row: GameTile[]) {
  return row.every((x) => x.variant === "correct");
}

export function makeEmptyGrid(rows = 6, columns = 5) {
  const grid: GameTile[][] = [];

  for (let y = 0; y < rows; y++) {
    const row: GameTile[] = [];

    for (let x = 0; x < columns; x++) {
      row.push({
        cursor: { y, x },
        children: "",
        variant: "empty",
      });
    }

    grid.push(row);
  }

  return grid;
}

export function getNextRow(row: GameTile[], secret: string) {
  const indexed: Record<string, number[]> = {};

  for (let i = 0; i < secret.length; i++) {
    const letter = secret[i];
    if (letter in indexed) {
      indexed[letter].push(i);
    } else {
      indexed[letter] = [i];
    }
  }

  let result: GameTile[] = [...row];

  row.forEach((_, i) => {
    let tile = { ...row[i] };

    if (tile.variant !== "empty") {
      result.push(tile);
      return;
    }

    const letter = tile.children;

    if (!(letter in indexed)) {
      result[i] = { ...tile, variant: "absent" };
      return;
    }

    const entries = indexed[letter];

    if (!entries.length) {
      result[i] = { ...tile, variant: "absent" };

      result = result.map((tile) =>
        tile.children === letter && tile.variant === "empty"
          ? { ...tile, variant: "absent" }
          : tile
      );

      return;
    }

    // exists
    if (entries.includes(i)) {
      result[i].variant = "correct";
      const nextIndex = without([i], entries);
      indexed[letter] = nextIndex;
    } else {
      result[i].variant = "present";
    }
  });

  return result;
}
