import type { GameStatus } from "./types";
import { makeEmptyGrid } from "./helpers";

export const APP_NAME = "weirdle";

const EMPTY_GRID = makeEmptyGrid();

export const STORAGE_KEY = "@stores/game";

export type ModalKind = "help" | "stats" | "settings" | null;

export const INITIAL_STATE = {
  grid: EMPTY_GRID,
  cursor: { y: 0, x: 0 },
  secret: "",
  isLoading: false,
  status: "new" as GameStatus,
  activeModal: null as ModalKind,
  darkMode: false,
};
