import { FC } from "react";
import clsx from "clsx";

export type TileProps = {
  variant: "empty" | "placed" | "misplaced" | "missing";
  children: string;
  cursor: {
    y: number;
    x: number;
  };
};

type Props = {
  data: TileProps[][];
};

export function makeEmptyGrid(rows = 6, columns = 5) {
  const grid: TileProps[][] = [];

  for (let y = 0; y < rows; y++) {
    const row: TileProps[] = [];

    for (let x = 0; x < columns; x++) {
      row.push({
        cursor: { y, x },
        children: "",
        variant: "empty",
      });
    }

    grid.push(row);
  }

  return grid;
}

export default function Grid(props: Props) {
  return (
    <div className="grid gap-4 max-w-sm m-auto grid-cols-5 grid-rows-6 place-items-center h-min">
      {props.data.flatMap((row) =>
        row.map((tile) => (
          <Tile
            key={`${tile.cursor.y}-${tile.cursor.x}`}
            variant={tile.variant}
            cursor={tile.cursor}
          >
            {tile.children}
          </Tile>
        ))
      )}
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
