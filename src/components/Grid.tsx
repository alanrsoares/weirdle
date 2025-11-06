import Tile, { type TileProps } from "./Tile";
import tw from "styled-cva";

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

const BaseGrid = tw.div`grid gap-3 md:gap-4`;

export default function Grid(props: Props) {
  return (
    <BaseGrid className="m-auto h-min max-w-sm">
      {props.data.map((row, i) => (
        <BaseGrid key={`row-${i}`} className="grid-cols-5">
          {row.map((tile, j) => (
            <Tile
              key={`${tile.cursor.y}-${tile.cursor.x}-${tile.variant}`}
              variant={tile.variant}
              cursor={tile.cursor}
              delay={j * 0.1}
            >
              {tile.children}
            </Tile>
          ))}
        </BaseGrid>
      ))}
    </BaseGrid>
  );
}
