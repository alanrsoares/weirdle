"use client";

import { useCallback, useEffect } from "react";

import Grid from "~/components/Grid";
import Header from "~/components/Header";
import HelpModal from "~/components/HelpModal";
import Keyboard, { isMappableKey } from "~/components/Keyboard";
import SettingsModal from "~/components/SettingsModal";
import StatsModal from "~/components/StatsModal";
import { Button } from "~/components/ui/button";
import { useGameStore, type GameTile } from "~/stores/game";
import { useStatsStore } from "~/stores/stats";

const { useSelector } = useGameStore;

export default function Home() {
  const { state: gameState, actions: gameActions } = useGameStore();
  const { actions: statsActions } = useStatsStore();

  const keys = useSelector("getUsedKeys");

  useEffect(() => {
    gameActions.init().then(() => {
      console.log("weirdle: cached state restored");
    });
  }, [gameActions]);

  const handleKeyPress = useCallback(
    async (key: string) => {
      if (!isMappableKey(key)) {
        gameActions.insert(key);
        return;
      }

      switch (key) {
        case "backspace":
          gameActions.delete();
          break;
        case "enter":
          const result = await gameActions.guess();

          switch (result.status) {
            case "win":
              statsActions.captureWin({
                attempts: result.attempts,
              });
              break;
            case "loss":
              statsActions.captureLoss();
              break;
          }
          break;
      }
    },
    [gameActions, statsActions],
  );

  return (
    <div className="m-auto flex h-screen w-full flex-col dark:bg-gray-700">
      <Header onIconClick={gameActions.openModal} />
      <main className="m-auto flex max-w-lg flex-1 flex-col justify-between p-4">
        {process.env.NODE_ENV === "development" && (
          <div className="border bg-gray-100 p-2 text-center font-mono tracking-widest uppercase dark:text-primary-foreground">
            {gameState.secret}
          </div>
        )}
        <Grid data={gameState.grid} />
        {gameState.status === "won" && (
          <div className="flex justify-center pt-4">
            <Button onClick={gameActions.reset} size="lg">
              New Game
            </Button>
          </div>
        )}
        <div className="flex-1 md:hidden"></div>
        <Keyboard
          usedKeys={keys as Record<string, GameTile[]>}
          disabled={gameState.isLoading}
          onKeyPress={handleKeyPress}
        />
      </main>
      <HelpModal
        open={gameState.activeModal === "help"}
        onClose={gameActions.closeModal}
      />
      <StatsModal
        open={gameState.activeModal === "stats"}
        onClose={gameActions.closeModal}
      />
      <SettingsModal
        open={gameState.activeModal === "settings"}
        onClose={gameActions.closeModal}
      />
    </div>
  );
}
