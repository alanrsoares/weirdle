import { toast } from "sonner";

import { flatten, groupBy, pipe, prop, reject } from "ramda";
import { createStore, type Selector } from "zustand-immer-store";

import * as api from "~/lib/api-client";
import { INITIAL_STATE, STORAGE_KEY, type ModalKind } from "./constants";
import { findLastNonEmptyTile, getNextRow, getRowWord } from "./helpers";
import type { GameTile } from "./types";

export type GameState = typeof INITIAL_STATE;

const PLAYING_STATUS = { status: "playing" as const };

export const useGameStore = createStore(INITIAL_STATE, {
  createActions: (set, get) => {
    const updateSecret = async () => {
      set((store) => {
        store.state.isLoading = true;
      });

      const { secret } = await api.getSecretWord();

      set((store) => {
        store.state.isLoading = false;
        store.state.secret = secret;
      });
    };

    const applyDarkMode = (enabled: boolean) => {
      if (enabled && !document.body.classList.contains("dark")) {
        document.body.classList.add("dark");
      }
    };

    return {
      async init() {
        const rawPersistedState = localStorage.getItem(STORAGE_KEY);
        const persistedState = rawPersistedState
          ? JSON.parse(rawPersistedState)
          : get().state;

        if (persistedState?.darkMode) {
          applyDarkMode(persistedState.darkMode);
        }

        if (persistedState?.secret) {
          set((store) => {
            store.state = persistedState;
          });
          return;
        }

        await updateSecret();
      },
      async reset() {
        set((store) => {
          store.state = INITIAL_STATE;
        });
        localStorage.removeItem(STORAGE_KEY);
        await updateSecret();
      },
      async guess(): Promise<
        | { status: "win"; guess: string; attempts: number }
        | { status: "loss"; guess: string; attempts: number }
        | { status: "playing" }
      > {
        const { cursor, grid } = get().state;

        if (cursor.x !== grid[0].length - 1) {
          return PLAYING_STATUS;
        }

        const guessWord = getRowWord(grid[cursor.y]);

        if (guessWord.length !== 5) {
          return PLAYING_STATUS;
        }

        try {
          const { valid } = await api.verifyWord(guessWord);
          if (!valid) {
            toast.error(`Not in word list: ${guessWord}`);
            return PLAYING_STATUS;
          }
        } catch (error) {
          console.log("Failed to verify word: %e", error);
        }

        const { state } = get();
        const won = state.secret === guessWord;
        const attempts = state.cursor.y + 1;
        const isLastRow = state.cursor.y === state.grid.length - 1;

        set(({ state }) => {
          state.grid[state.cursor.y] = getNextRow(
            state.grid[state.cursor.y],
            state.secret,
          );

          if (!isLastRow) {
            state.cursor.y++;
            state.cursor.x = 0;
          }

          state.status = won ? "won" : isLastRow ? "lost" : state.status;
        });

        const resetCallback = { onDismiss: this.reset.bind(this) };
        if (won) {
          toast.success("Damn son, you good! 🎉", resetCallback);
        } else if (isLastRow) {
          toast.warning("Not today, my dude =/", resetCallback);
        }

        return {
          status: !isLastRow && !won ? "playing" : won ? "win" : "loss",
          guess: guessWord,
          attempts,
        };
      },
      delete() {
        set(({ state }) => {
          const lastNonEmptyTile = findLastNonEmptyTile(
            state.grid[state.cursor.y],
          );
          if (!lastNonEmptyTile) return;

          state.cursor = lastNonEmptyTile.cursor;
          const { y, x } = state.cursor;
          state.grid[y][x] = { ...state.grid[y][x], children: "", variant: "empty" };
        });
      },
      insert(key: string) {
        set(({ state }) => {
          const { cursor } = state;
          state.grid[cursor.y][cursor.x] = {
            ...state.grid[cursor.y][cursor.x],
            children: key,
          };
          if (cursor.x < state.grid[cursor.y].length - 1) {
            state.cursor.x++;
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
    };
  },
  selectors: {
    getUsedKeys: pipe(
      prop("grid"),
      flatten,
      reject<GameTile>((tile) => tile.children === ""),
      groupBy(prop("children")),
    ),
  },
});

useGameStore.subscribe(({ state }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
});

export function useGameStoreSelector<R>(selector: Selector<GameState, R>) {
  return useGameStore((store: { state: GameState }) => selector(store.state));
}
