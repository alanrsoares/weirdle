import { FC } from "react";
import clsx from "clsx";
import type { GameTile } from "stores/game";

export type TileProps = GameTile;

type Props = {
  data: TileProps[][];
};

export const GridRow = (props: { data: TileProps[] }) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {props.data.map((tile) => (
        <Tile
          key={`${tile.cursor.y}-${tile.cursor.x}-${tile.variant}`}
          variant={tile.variant}
          cursor={tile.cursor}
        >
          {tile.children}
        </Tile>
      ))}
    </div>
  );
};

export default function Grid(props: Props) {
  return (
    <div className="m-auto grid h-min max-w-sm gap-4">
      {props.data.map((row, i) => (
        <div key={`row-${i}`} className="grid grid-cols-5 gap-4">
          {row.map((tile) => (
            <Tile
              key={`${tile.cursor.y}-${tile.cursor.x}-${tile.variant}`}
              variant={tile.variant}
              cursor={tile.cursor}
            >
              {tile.children}
            </Tile>
          ))}
        </div>
      ))}
    </div>
  );
}

export const Tile: FC<TileProps> = (props) => (
  <div
    className={clsx(
      "h-[50px] w-[50px] select-none place-items-center border-2 text-xl uppercase md:h-[60px] md:w-[60px] md:text-2xl grid",
      "origin-center scale-90 sm:scale-100",
      "dark:text-white",
      {
        "border-green-500 bg-green-500 text-white": props.variant === "correct",
        "border-yellow-500 bg-yellow-500 text-white":
          props.variant === "present",
        "border-gray-500 bg-gray-500 text-white": props.variant === "absent",
        "border-gray-300 dark:border-gray-400": props.variant === "empty",
      }
    )}
  >
    {props.children}
  </div>
);
