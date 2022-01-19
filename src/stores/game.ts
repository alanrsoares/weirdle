import { createStore } from "zustand-immer-store";
import { toast } from "react-toastify";

import { makeEmptyGrid, TileProps } from "components/Grid";
import { getSecretWord, verifyWord } from "lib/api-client";

const EMPTY_GRID = makeEmptyGrid();

export type GameStatus = "new" | "won" | "lost";

function getNextTile(tile: TileProps, secret: string): TileProps {
  const key = tile.children.trim().toLowerCase();

  const exists = secret.includes(key);

  if (exists) {
    const exact = tile.coordinates.x === secret.indexOf(key);

    return {
      ...tile,
      variant: exact ? "placed" : "misplaced",
    };
  }

  return {
    ...tile,
    variant: "missing",
  };
}

export const useGameStore = createStore(
  {
    grid: EMPTY_GRID,
    cursor: { y: 0, x: 0 },
    secret: "",
    isLoading: false,
    status: "new" as GameStatus,
    error: {
      message: "",
    },
  },
  {
    createActions: (set, get) => ({
      async reveal() {
        const { cursor, grid } = get().state;

        if (cursor.x !== grid[0].length - 1) {
          return;
        }

        const word = grid[cursor.y]
          .map((x) => x.children.trim())
          .filter(Boolean)
          .join("");

        try {
          const result = await verifyWord(word);

          if (!result.valid) {
            set(({ state }) => {
              state.error = {
                message: "Invalid word",
              };
            });

            toast.error(`Not in word list: ${word}`);
            return;
          }
        } catch (error) {
          console.log("Failed to verify word: %e", error);
        }

        set(({ state }) => {
          const row = state.grid[state.cursor.y];

          const isLastColumn = state.cursor.x === row.length - 1;
          const isLastRow = state.cursor.y === state.grid.length - 1;

          if (!isLastColumn) {
            return;
          }

          state.grid[state.cursor.y] = row.map((x) =>
            getNextTile(x, state.secret)
          );

          if (!isLastRow) {
            state.cursor.y++;
            state.cursor.x = 0;
          }
        });
      },
      delete() {
        set(({ state }) => {
          const { cursor } = state;
          const row = state.grid[cursor.y];
          const tile = row[cursor.x];

          const isFirstColumn = cursor.x === 0;

          state.grid[cursor.y][cursor.x] = {
            ...tile,
            children: "",
            variant: "empty",
          };

          if (!isFirstColumn) {
            // go back 1 column
            state.cursor.x--;
          }
        });
      },
      insert(key: string) {
        set(({ state }) => {
          const { cursor } = state;
          const row = state.grid[cursor.y];
          const tile = row[cursor.x];

          const isLastColumn = cursor.x === row.length - 1;

          const nextTile = { ...tile, children: key };

          state.grid[cursor.y][cursor.x] = nextTile;

          if (!isLastColumn) {
            state.cursor.x++;
          }
        });
      },
      async init() {
        set((store) => {
          store.state.isLoading = true;
        });

        const data = await getSecretWord();

        set((store) => {
          store.state.isLoading = false;
          store.state.secret = data.secret;
        });
      },
    }),
  }
);
