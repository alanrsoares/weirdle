import { useCallback, useEffect } from "react";

import { useGameStore } from "stores/game";
import Header from "components/Header";
import Grid from "components/Grid";
import Keyboard, { isMappableKey } from "components/Keyboard";
import HelpModal from "components/HelpModal";
import StatsModal from "components/StatsModal";
import SettingsModal from "components/SettingsModal";

const { useSelector } = useGameStore;

export default function Home() {
  const { state, actions } = useGameStore();

  const keys = useSelector("getUsedKeys");

  useEffect(
    () => {
      actions.init();
    },
    // eslint-disable-next-line
    []
  );

  const handleKeyPress = useCallback(
    (key: string) => {
      if (isMappableKey(key)) {
        switch (key) {
          case "backspace":
            actions.delete();
            break;
          case "enter":
            actions.guess();
            break;
        }
        return;
      }
      actions.insert(key);
    },
    [actions]
  );

  return (
    <div className="flex flex-col w-full m-auto h-screen dark:bg-gray-700">
      <Header onIconClick={actions.openModal} />
      <main className="flex-1 p-4 flex flex-col justify-between max-w-lg m-auto">
        {process.env.NODE_ENV === "development" && (
          <div className="text-center border p-2 bg-gray-100 uppercase tracking-widest font-mono">
            {state.secret}
          </div>
        )}
        <Grid data={state.grid} />
        <div className="md:hidden flex-1"></div>
        <Keyboard
          usedKeys={keys}
          disabled={state.isLoading}
          onKeyPress={handleKeyPress}
        />
      </main>
      <HelpModal
        open={state.activeModal === "help"}
        onClose={actions.closeModal}
      />
      <StatsModal
        open={state.activeModal === "stats"}
        onClose={actions.closeModal}
      />
      <SettingsModal
        open={state.activeModal === "settings"}
        onClose={actions.closeModal}
      />
    </div>
  );
}
