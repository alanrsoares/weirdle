import { APP_NAME } from "stores/game/constants";
import { GridRow } from "./Grid";
import Modal, { Props as ModalProps } from "./Modal";

export type Props = Pick<ModalProps, "open" | "onClose">;

export default function HelpModal(props: Props) {
  return (
    <Modal title="How to play" open={props.open} onClose={props.onClose}>
      <section className="grid gap-4">
        <header className="grid gap-2">
          <h1 className="text-lg font-medium">
            Guess the <span className="font-bold">{APP_NAME}</span> in 6 tries.
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
  );
}
