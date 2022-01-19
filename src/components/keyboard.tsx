import { useEffect } from "react";
import styled from "tailwind-styled-components";

import { BackspaceIcon } from "./icons";

type Props = {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
};

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

export const VALID_KEYS = KEYS.flatMap((row) => row.map((key) => key.toLowerCase())).filter(
  Boolean
);

function isValidKey(key: string) {
  return VALID_KEYS.includes(key);
}

export default function Keyboard(props: Props) {
  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (isValidKey(e.key.toLowerCase())) {
        props.onKeyPress(e.key.toLowerCase());
      }
    }

    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <div className="grid gap-4 h-min">
      {KEYS.map((row, i) => (
        <div className="flex justify-evenly touch-manipulation gap-2" key={`row-${i}`}>
          {row.map((key, j) =>
            !key ? (
              <div key={`empty-${j}`} className="w-2" />
            ) : (
              <KeyButton
                disabled={props.disabled}
                key={key}
                onClick={props.onKeyPress.bind(null, key.toLowerCase())}
                style={props.disabled ? { opacity: 0.5 } : {}}
              >
                {key in MAPPABLE_KEYS ? MAPPABLE_KEYS[key as MappableKeys] : key}
              </KeyButton>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export const KeyButton = styled.button`bg-gray-200 hover:bg-gray-300 active:opacity-60 md:p-4 p-2 rounded-md md:text-xl text-sm font-bold transition-all`;
