import { useMemo } from "react";
import { GameTile } from "stores/game";
import { GridRow } from "./Grid";
import Modal, { Props as ModalProps } from "./Modal";

export type Props = Pick<ModalProps, "open" | "onClose">;

export default function HelpModal(props: Props) {
  return (
    <Modal title="How to play" open={props.open} onClose={props.onClose}>
      <section className="grid gap-4">
        <header className="grid gap-2">
          <h1 className="text-lg font-medium">
            Guess the <span className="font-bold">word</span> in 6 tries.
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
          <HelpItem word="weary" letter="w" variant="placed" />
          <HelpItem word="pills" letter="i" variant="misplaced" />
          <HelpItem word="vague" letter="u" variant="missing" />
        </div>
      </section>
    </Modal>
  );
}

function HelpItem(props: {
  word: string;
  letter: string;
  variant: GameTile["variant"];
}) {
  const legendSuffix = useMemo(() => {
    switch (props.variant) {
      case "placed":
        return "in the word and in the correct spot";
      case "misplaced":
        return "in the word but in the wrong spot";
      case "missing":
        return "not in the word in any spot";
    }
  }, [props]);

  return (
    <div className="grid gap-2">
      <GridRow
        data={[...props.word].map((key, i) => ({
          children: key,
          cursor: { y: 0, x: i },
          variant: key === props.letter ? props.variant : "empty",
        }))}
      />
      <legend>
        The letter <span className="uppercase font-bold">{props.letter}</span>{" "}
        is {legendSuffix}
      </legend>
    </div>
  );
}
