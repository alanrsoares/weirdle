"use client";

import { always } from "ramda";
import { match } from "ts-pattern";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import type { GameTile } from "~/stores/game";
import { GridRow } from "./Grid";

export type Props = {
  open: boolean;
  onClose: () => void;
};

export default function HelpModal(props: Props) {
  return (
    <Dialog open={props.open} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to play</DialogTitle>
          <DialogDescription>
            Learn how to play and master the game.
          </DialogDescription>
        </DialogHeader>

        <section className="grid gap-4 py-4">
          <header className="grid gap-2 md:gap-3">
            <h1 className="text-lg font-medium">
              Guess the <span className="font-bold">word</span> in 6 tries.
            </h1>
            <p className="text-sm text-muted-foreground">
              Each guess must be a valid 5 letter word. Hit the enter button to
              submit.
            </p>
            <p className="text-sm text-muted-foreground">
              After each guess, the color of the tiles will change to show how
              close your guess was to the word.
            </p>
          </header>

          <Separator />

          <div className="grid gap-4">
            <div className="font-medium">Examples</div>
            <div className="m-auto grid max-w-sm gap-4 text-center">
              <HelpItem word="weary" letter="w" variant="correct" />
              <HelpItem word="pills" letter="i" variant="present" />
              <HelpItem word="vague" letter="u" variant="absent" />
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}

function HelpItem(props: {
  word: string;
  letter: string;
  variant: GameTile["variant"];
}) {
  return (
    <div className="grid gap-4">
      <GridRow
        data={[...props.word].map((key, i) => ({
          children: key,
          cursor: { y: 0, x: i },
          variant: key === props.letter ? props.variant : "empty",
        }))}
      />
      <legend>
        The letter <span className="font-bold uppercase">{props.letter}</span>{" "}
        is{" "}
        {match(props.variant)
          .with("correct", always("in the word and in the correct spot"))
          .with("present", always("in the word but in the wrong spot"))
          .with("absent", always("not in the word in any spot"))
          .otherwise(always(""))}
      </legend>
    </div>
  );
}
