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

  useEffect(() => {
    actions.init().then(() => {
      console.log("weirdle: cached state restored");
    });
  }, [actions]);

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
    <div className="m-auto flex h-screen w-full flex-col dark:bg-gray-700">
      <Header onIconClick={actions.openModal} />
      <main className="m-auto flex max-w-lg flex-1 flex-col justify-between p-4">
        {process.env.NODE_ENV === "development" && (
          <div className="border bg-gray-100 p-2 text-center font-mono uppercase tracking-widest">
            {state.secret}
          </div>
        )}
        <Grid data={state.grid} />
        <div className="flex-1 md:hidden"></div>
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
