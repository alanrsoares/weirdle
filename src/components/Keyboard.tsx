import { useCallback, useEffect } from "react";
import tw from "tailwind-styled-components";

import type { GameTile } from "stores/game";

import { BackspaceIcon } from "./icons";

export const MAPPABLE_KEYS = {
  backspace: <BackspaceIcon />,
  enter: "ENTER",
} as const;

export type MappableKeys = keyof typeof MAPPABLE_KEYS;

export function isMappableKey(key: string): key is MappableKeys {
  return key in MAPPABLE_KEYS;
}

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
  ["enter", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
];

export const VALID_KEYS = KEYS.flatMap((row) =>
  row.map((key) => key.toLowerCase())
).filter(Boolean);

function isValidKey(key: string) {
  return VALID_KEYS.includes(key);
}

type Props = {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  usedKeys: Record<string, GameTile>;
};

export default function Keyboard({ onKeyPress, disabled, usedKeys }: Props) {
  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (isValidKey(e.key.toLowerCase())) {
        onKeyPress(e.key.toLowerCase());
      }
    }

    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyPress]);

  const getKeyColors = useCallback(
    (key: string) => {
      if (key in usedKeys) {
        const tile = usedKeys[key];

        switch (tile.variant) {
          case "missing":
            return { background: "rgb(75 85 99)", color: "white" };
          case "misplaced":
            return { background: "rgb(234 179 8 )", color: "white" };
          case "placed":
            return { background: "rgb(34 197 94)", color: "white" };
        }
      }

      return {};
    },
    [usedKeys]
  );

  return (
    <div className="grid gap-4 h-min mx-auto select-none">
      {KEYS.map((row, i) => (
        <div
          className="flex justify-evenly touch-manipulation gap-2"
          key={`row-${i}`}
        >
          {row.map((key, j) =>
            key === "" ? (
              <div key={`empty-${j}`} className="w-2" />
            ) : (
              <KeyButton
                disabled={disabled}
                key={key}
                onClick={onKeyPress.bind(null, key.toLowerCase())}
                style={
                  disabled ? { opacity: 0.5 } : getKeyColors(key.toLowerCase())
                }
              >
                {isMappableKey(key) ? MAPPABLE_KEYS[key] : key}
              </KeyButton>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export const KeyButton = tw.button`bg-gray-300 hover:bg-gray-400 active:opacity-60 md:p-3 p-2 rounded-md md:text-xl sm:text-sm text-xs font-bold transition-all md:min-w-[2.5rem]`;
