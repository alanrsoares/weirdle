import Head from "next/head";
import { useCallback, useEffect } from "react";

import { useGameStore } from "stores/game";
import Header from "components/Header";
import Grid, { GridRow } from "components/Grid";
import Keyboard, { isMappableKey } from "components/Keyboard";
import Modal from "components/Modal";

const { useSelector } = useGameStore;

export default function Home() {
  const { state, actions } = useGameStore();

  const keys = useSelector("getUsedKeys");

  useEffect(() => {
    actions.init();
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
    <div className="flex flex-col max-w-lg w-full m-auto h-screen">
      <Header onIconClick={actions.openModal} />
      <main className="flex-1 p-4 flex flex-col justify-between">
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
      <Modal
        title="How to play"
        open={state.activeModal === "help"}
        onClose={actions.closeModal}
      >
        <section className="grid gap-4">
          <header className="grid gap-2">
            <h1 className="text-lg font-medium">
              Guess the <span className="font-bold">WORDLE</span> in 6 tries.
            </h1>
            <p className="text-sm">
              Each guess must be a valid 5 letter word. Hit the enter button to
              submit.
            </p>
            <p className="text-sm">
              After each guess, the color of the tiles will change to show how
              close your guess was to the word.
            </p>
          </header>
          <div className="border-t py-4 grid gap-4">
            <div>Examples</div>
            <div className="grid gap-2">
              <GridRow
                data={[..."weary"].map((key, i) =>
                  key === "w"
                    ? {
                        children: key,
                        cursor: { y: 0, x: i },
                        variant: "placed",
                      }
                    : {
                        children: key,
                        cursor: { y: 0, x: i },
                        variant: "empty",
                      }
                )}
              />
              <legend>
                The letter <span>W</span> is in the word and in the correct spot
              </legend>
            </div>
            <div className="grid gap-2">
              <GridRow
                data={[..."pills"].map((key, i) =>
                  key === "i"
                    ? {
                        children: key,
                        cursor: { y: 0, x: i },
                        variant: "misplaced",
                      }
                    : {
                        children: key,
                        cursor: { y: 0, x: i },
                        variant: "empty",
                      }
                )}
              />
              <legend>
                The letter <span>W</span> is in the word but in the wrong spot
              </legend>
            </div>
            <div className="grid gap-2">
              <GridRow
                data={[..."vague"].map((key, i) =>
                  key === "u"
                    ? {
                        children: key,
                        cursor: { y: 0, x: i },
                        variant: "missing",
                      }
                    : {
                        children: key,
                        cursor: { y: 0, x: i },
                        variant: "empty",
                      }
                )}
              />
              <legend>
                The letter <span>W</span> is not in the word in any spot
              </legend>
            </div>
          </div>
        </section>
      </Modal>
      <Modal
        title="Statistics"
        open={state.activeModal === "stats"}
        onClose={actions.closeModal}
      >
        Hello Statistics
      </Modal>
      <Modal
        title="Settings"
        open={state.activeModal === "settings"}
        onClose={actions.closeModal}
      >
        Hello Settings
      </Modal>
    </div>
  );
}
