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
          key={`${tile.cursor.y}-${tile.cursor.x}`}
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
        <GridRow key={`row-${i}`} data={row} />
      ))}
    </div>
  );
}

export const Tile: FC<TileProps> = (props) => (
  <div
    className={clsx(
      "border-2 grid place-items-center select-none uppercase md:text-2xl text-xl md:h-[60px] md:w-[60px] h-[50px] w-[50px]",
      {
        "bg-green-500 text-white border-gree-700": props.variant === "placed",
        "bg-yellow-500 text-white border-yellow-700":
          props.variant === "misplaced",
        "bg-gray-600 text-white": props.variant === "missing",
      }
    )}
  >
    {props.children}
  </div>
);
