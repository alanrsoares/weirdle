import { createStore } from "zustand-immer-store";

const INITIAL_STATE = {
  wins: 0,
  losses: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0] as number[],
};

export const useStatsStore = createStore(INITIAL_STATE, {
  persist: {
    name: "@stores/stats",
    version: 0,
  },
  createActions: (set, _get) => ({
    captureWin({ attempts }: { attempts: number }) {
      set(({ state }) => {
        state.wins++;
        state.currentStreak++;
        state.distribution[attempts - 1]++;
        state.maxStreak = Math.max(state.maxStreak, state.currentStreak);
      });
    },
    captureLoss() {
      set(({ state }) => {
        state.losses++;
        state.maxStreak = Math.max(state.maxStreak, state.currentStreak);
        state.currentStreak = 0;
      });
    },
  }),
});
