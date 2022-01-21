export type Cursor = {
  y: number;
  x: number;
};

export type GameTile = {
  variant: "empty" | "placed" | "misplaced" | "missing";
  children: string;
  cursor: Cursor;
};

export type GameGrid = GameTile[][];

export type GameStatus = "new" | "won" | "lost";
