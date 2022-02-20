import { useCallback, useEffect } from "react";

import { useGameStore } from "stores/game";
import Header from "components/Header";
import Grid from "components/Grid";
import Keyboard, { isMappableKey } from "components/Keyboard";
import HelpModal from "components/HelpModal";
import StatsModal from "components/StatsModal";
import SettingsModal from "components/SettingsModal";
import { useStatsStore } from "stores/stats";

const { useSelector } = useGameStore;

export default function Home() {
  const { state: gameState, actions: gameActions } = useGameStore();
  const { state: stats, actions: statsActions } = useStatsStore();

  const keys = useSelector("getUsedKeys");

  useEffect(() => {
    gameActions.init().then(() => {
      console.log("weirdle: cached state restored");
    });
  }, [gameActions]);

  const handleKeyPress = useCallback(
    async (key: string) => {
      if (isMappableKey(key)) {
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
                //
                break;
              case "loss":
                statsActions.captureLoss();
                break;
            }
            break;
        }
        return;
      }
      gameActions.insert(key);
    },
    [gameActions, statsActions]
  );

  return (
    <div className="m-auto flex h-screen w-full flex-col dark:bg-gray-700">
      <Header onIconClick={gameActions.openModal} />
      <main className="m-auto flex max-w-lg flex-1 flex-col justify-between p-4">
        {process.env.NODE_ENV === "development" && (
          <div className="border bg-gray-100 p-2 text-center font-mono uppercase tracking-widest">
            {gameState.secret}
          </div>
        )}
        <Grid data={gameState.grid} />
        <div className="flex-1 md:hidden"></div>
        <Keyboard
          usedKeys={keys}
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
