import { toast } from "react-toastify";
import { createStore, Selector } from "zustand-immer-store";
import {
  filter,
  flatten,
  indexBy,
  pipe,
  prop,
  propEq,
  reject,
  uniqBy,
} from "ramda";

import * as api from "lib/api-client";

import {
  didWin,
  findLastNonEmptyTile,
  getRowWord,
  getNextRow,
} from "./helpers";
import { INITIAL_STATE, STORAGE_KEY, ModalKind } from "./constants";

export type GameState = typeof INITIAL_STATE;

export const useGameStore = createStore(INITIAL_STATE, {
  createActions: (set, get) => ({
    async init() {
      const rawPersistedState = localStorage.getItem(STORAGE_KEY);

      const persistedState = rawPersistedState
        ? JSON.parse(rawPersistedState)
        : get().state;

      if (persistedState) {
        if (
          persistedState.darkMode &&
          !document.body.classList.contains("dark")
        ) {
          document.body.classList.add("dark");
        }
      }

      if (persistedState?.secret) {
        set((store) => {
          store.state = persistedState;
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

        state.grid[state.cursor.y] = getNextRow(row, state.secret);

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
          filter;
        }
      });
    },
    openModal(modalKind: ModalKind) {
      set(({ state }) => {
        state.activeModal = modalKind;
      });
    },
    closeModal() {
      set(({ state }) => {
        state.activeModal = null;
      });
    },
    toggleDarkMode() {
      set(({ state }) => {
        state.darkMode = !state.darkMode;
        document.body.classList.toggle("dark");
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
      reject(propEq("children", "")),
      uniqBy(prop("children")),
      indexBy(prop("children"))
    ),
  },
});

useGameStore.subscribe(({ state }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
});

export function useGameStoreSelector<R>(selector: Selector<GameState, R>) {
  return useGameStore((store) => selector(store.state));
}
