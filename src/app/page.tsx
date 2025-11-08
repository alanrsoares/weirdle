"use client";

import { useCallback, useEffect } from "react";

import Grid from "~/components/Grid";
import Header from "~/components/Header";
import HelpModal from "~/components/HelpModal";
import Keyboard, { isMappableKey } from "~/components/Keyboard";
import SettingsModal from "~/components/SettingsModal";
import StatsModal from "~/components/StatsModal";
import { Badge } from "~/components/ui/badge";
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

  const isGameOver = gameState.status === "won" || gameState.status === "lost";

  return (
    <div className="m-auto flex h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
      <Header onIconClick={gameActions.openModal} />
      <main className="relative m-auto flex max-w-lg flex-1 flex-col justify-between px-4 py-6 md:py-8">
        {process.env.NODE_ENV === "development" && (
          <Badge className="absolute top-2 right-2">{gameState.secret}</Badge>
        )}
        <div className="flex items-center justify-center py-4 md:py-6">
          <Grid data={gameState.grid} />
        </div>
        {isGameOver && (
          <div className="flex justify-center py-4 md:py-6">
            <Button
              onClick={gameActions.reset}
              size="lg"
              className="shadow-md transition-shadow hover:shadow-lg"
            >
              New Game
            </Button>
          </div>
        )}
        <div className="flex-1 md:hidden"></div>
        <div className="pb-4 md:pb-6">
          <Keyboard
            usedKeys={keys as Record<string, GameTile[]>}
            disabled={gameState.isLoading}
            onKeyPress={handleKeyPress}
          />
        </div>
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
