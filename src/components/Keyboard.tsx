import { useCallback, useEffect, type FC } from "react";

import { always } from "ramda";
import tw from "styled-cva";
import { match } from "ts-pattern";

import type { GameTile } from "~/stores/game";
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
  row.map((key) => key.toLowerCase()),
).filter(Boolean);

function isValidKey(key: string) {
  return VALID_KEYS.includes(key);
}

function isVariant(variant: GameTile["variant"]) {
  return (tile: GameTile) => tile.variant === variant;
}

type Props = {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  usedKeys: Record<string, GameTile[]>;
};

const Keyboard: FC<Props> = ({ onKeyPress, disabled, usedKeys }) => {
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
        const tiles = usedKeys[key];
        const tile =
          tiles.find(isVariant("correct")) ??
          tiles.find(isVariant("present")) ??
          tiles.find(isVariant("absent"));

        return {
          color: tile?.variant ? "white" : undefined,
          background: match(tile?.variant ?? "empty")
            .with("absent", always("rgb(107 114 128)")) // gray-500 (better for dark mode)
            .with("correct", always("rgb(34 197 94)")) // green-500 (works well in both)
            .with("present", always("rgb(234 179 8)")) // yellow-400 (works well in both)
            .otherwise(always("")),
        };
      }

      return {};
    },
    [usedKeys],
  );

  return (
    <div className="mx-auto grid h-min gap-4 select-none">
      {KEYS.map((row, i) => (
        <div
          className="flex touch-manipulation justify-evenly gap-1 md:gap-2"
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
            ),
          )}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;

export const KeyButton = tw.button`
  bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 
  dark:text-white active:opacity-60 md:p-3 
  p-2 rounded-md md:text-xl sm:text-sm text-xs font-bold transition-all 
  md:min-w-10
  min-w-[1.85rem]
`;
