import { toast } from "react-toastify";
import { createStore, Selector } from "zustand-immer-store";
import { filter, flatten, indexBy, pipe, prop, uniqBy } from "ramda";

import * as api from "lib/api-client";
import { makeEmptyGrid, TileProps } from "components/Grid";

const EMPTY_GRID = makeEmptyGrid();

const LOCALSTORAGE_KEY = "@stores/game";

export type GameStatus = "new" | "won" | "lost";

function getNextTile(tile: TileProps, secret: string): TileProps {
  const key = tile.children.trim().toLowerCase();

  const exists = secret.includes(key);

  if (exists) {
    const exact = secret[tile.cursor.x] === key;

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

function findLastNonEmptyTile(row: TileProps[]) {
  return row.reduce<TileProps | null>(
    (acc, tile) => (tile.children ? tile : acc),
    null
  );
}

function getRowWord(row: TileProps[]) {
  return row
    .map((x) => x.children.trim())
    .filter(Boolean)
    .join("");
}

function didWin(row: TileProps[]) {
  return row.every((x) => x.variant === "placed");
}

export const INITIAL_STATE = {
  grid: EMPTY_GRID,
  cursor: { y: 0, x: 0 },
  secret: "",
  isLoading: false,
  status: "new" as GameStatus,
  error: {
    message: "",
  },
};

export type GameState = typeof INITIAL_STATE;

export const useGameStore = createStore(INITIAL_STATE, {
  createActions: (set, get) => ({
    /**
     * Attempts guessing a wordle
     * @returns
     */
    async guess() {
      const { cursor, grid } = get().state;

      if (cursor.x !== grid[0].length - 1) {
        return;
      }

      const word = getRowWord(grid[cursor.y]);

      try {
        const result = await api.verifyWord(word);

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

        const won = didWin(state.grid[state.cursor.y]);

        if (won) {
          toast.success("Damn son, you good! 🎉", {
            onClose: this.reset.bind(this),
          });
        } else {
          if (isLastRow) {
            toast.warn("Not today, my dude =/", {
              onClose: this.reset.bind(this),
            });
          }
        }

        if (!isLastRow) {
          state.cursor.y++;
          state.cursor.x = 0;
        }
      });
    },
    /**
     *  Delete tiles from right to left
     */
    delete() {
      set(({ state }) => {
        const lastNonEmptyTile = findLastNonEmptyTile(
          state.grid[state.cursor.y]
        );

        if (!lastNonEmptyTile) {
          // nothing to to here :jetpack:
          return;
        }

        // set cursor to lastNonEmptyTile's cursor
        state.cursor = lastNonEmptyTile.cursor;
        const { y, x } = state.cursor;

        const target = state.grid[y][x];

        target.children = "";
        target.variant = "empty";
      });
    },
    /**
     * Insert new keys from left to right
     * @param key
     */
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
      const persisted = localStorage.getItem("@stores/game");

      const defaultState = persisted
        ? (JSON.parse(persisted) as GameState)
        : null;

      if (defaultState?.secret) {
        set((store) => {
          store.state = defaultState;
        });
        return;
      }

      set((store) => {
        store.state.isLoading = true;
      });

      const result = await api.getSecretWord();

      set((store) => {
        store.state.isLoading = false;
        store.state.secret = result.secret;
      });
    },
    reset() {
      set((store) => {
        store.state = INITIAL_STATE;
      });

      toast.info("You can play again now!", {
        onClose: this.init.bind(this),
      });
    },
  }),
  selectors: {
    /**
     * Get UNIQUE keys used in the current grid
     */
    getUsedKeys: pipe(
      prop("grid"),
      flatten,
      filter<TileProps>((x) => Boolean(x.children)),
      uniqBy(prop("children")),
      indexBy(prop("children"))
    ),
  },
});

export function useGameStoreSelector<R>(selector: Selector<GameState, R>) {
  return useGameStore((store) => selector(store.state));
}

useGameStore.subscribe(({ state }) => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
});
