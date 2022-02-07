import { FC } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

import type { GameTile } from "stores/game";

export type TileProps = GameTile & { delay?: number };

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
        </div>
      ))}
    </div>
  );
}

export const Tile: FC<TileProps> = (props) => (
  <div
    className={clsx(
      "preserve-3d h-[50px] w-[50px]",
      "origin-center scale-90 sm:scale-100"
    )}
    style={{ perspective: 1000 }}
  >
    <motion.div
      initial={props.variant !== "empty" ? { transform: "rotateX(0)" } : false}
      animate={
        props.variant !== "empty" ? { transform: "rotateX(180deg)" } : false
      }
      transition={{ type: "spring", delay: props.delay, duration: 2 }}
      className={clsx(
        "grid select-none place-items-center border-2 text-xl uppercase md:h-[60px] md:w-[60px] md:text-2xl",
        "dark:text-white",
        {
          "border-green-500 bg-green-500 text-white":
            props.variant === "correct",
          "border-yellow-500 bg-yellow-500 text-white":
            props.variant === "present",
          "border-gray-500 bg-gray-500 text-white": props.variant === "absent",
          "border-4 border-gray-500 dark:border-[3px] dark:border-gray-300":
            props.variant === "empty" && props.children,
          "border-gray-300 dark:border-gray-300":
            props.variant === "empty" && !props.children,
        }
      )}
    >
      <motion.span
        initial={
          props.variant !== "empty"
            ? { opacity: 0, transform: "rotateX(180deg)" }
            : false
        }
        animate={props.variant !== "empty" ? { opacity: 1 } : false}
        transition={{ type: "spring", delay: (props.delay ?? 0) + 0.1 }}
      >
        {props.children}
      </motion.span>
    </motion.div>
  </div>
);
