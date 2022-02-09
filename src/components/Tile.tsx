import { FC } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

import type { GameTile } from "stores/game";

export type TileProps = GameTile & { delay?: number; size?: number };

const Tile: FC<TileProps> = (props) => (
  <div
    className={clsx(
      "preserve-3d",
      "origin-center scale-90 sm:scale-100 lg:scale-110"
    )}
    style={{ perspective: 500, height: props.size, width: props.size }}
  >
    <motion.div
      initial={props.variant !== "empty" ? { transform: "rotateX(0)" } : false}
      animate={
        props.variant !== "empty" ? { transform: "rotateX(180deg)" } : false
      }
      transition={{ type: "spring", delay: props.delay, duration: 2 }}
      className={clsx(
        "grid select-none place-items-center border-2 text-xl uppercase md:text-2xl",
        "dark:text-white",
        {
          "border-green-500 bg-green-500 text-white":
            props.variant === "correct",
          "border-yellow-500 bg-yellow-500 text-white":
            props.variant === "present",
          "border-gray-500 bg-gray-500 text-white": props.variant === "absent",
          "border-gray-500 dark:border-gray-300 md:border-[2.5px]":
            props.variant === "empty" && props.children,
          "border-gray-400": props.variant === "empty" && !props.children,
        }
      )}
      style={{ height: props.size, width: props.size }}
    >
      <motion.span
        initial={
          props.variant !== "empty"
            ? { opacity: 0, transform: "rotateX(180deg)" }
            : false
        }
        animate={props.variant !== "empty" ? { opacity: 1 } : false}
        transition={{ type: "spring", delay: (props.delay ?? 0) + 0.5 }}
      >
        {props.children}
      </motion.span>
    </motion.div>
  </div>
);

Tile.defaultProps = { size: 50 };

export default Tile;
