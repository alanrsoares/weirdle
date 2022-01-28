import { FC } from "react";
import clsx from "clsx";
import type { GameTile } from "stores/game";

export type TileProps = GameTile;

type Props = {
  data: TileProps[][];
};

export const GridRow = (props: { data: TileProps[] }) => {
  return (
    <div className="grid gap-4 grid-cols-5">
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
    <div className="grid gap-4 max-w-sm m-auto h-min">
      {props.data.map((row, i) => (
        <div key={`row-${i}`} className="grid gap-4 grid-cols-5">
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
      "border-2 grid place-items-center select-none uppercase md:text-2xl text-xl md:h-[60px] md:w-[60px] h-[50px] w-[50px]",
      "sm:scale-100 scale-90 origin-center",
      "dark:text-white",
      {
        "bg-green-500 text-white border-green-500": props.variant === "correct",
        "bg-yellow-500 text-white border-yellow-500":
          props.variant === "present",
        "bg-gray-500 text-white border-gray-500": props.variant === "absent",
      }
    )}
  >
    {props.children}
  </div>
);
