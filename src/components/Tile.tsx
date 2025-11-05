import type { FC } from "react";

import { motion } from "framer-motion";
import tw from "styled-cva";

import type { GameTile } from "~/stores/game";

export type TileProps = GameTile & {
  delay?: number;
  size?: number;
};

const DEFAULT_SIZE = 50;
const PERSPECTIVE = 500;
const ANIMATION_DURATION = 2;
const LETTER_DELAY_OFFSET = 0.5;
const FLIP_ROTATION = "rotateX(180deg)";

const BaseStyledTile = tw.div.cva(
  "grid place-items-center border-2 text-xl uppercase select-none md:text-2xl dark:text-white",
  {
    variants: {
      $variant: {
        correct: "border-green-500 bg-green-500 text-white",
        present: "border-yellow-500 bg-yellow-500 text-white",
        absent: "border-gray-500 bg-gray-500 text-white",
        empty: "border-gray-400",
      },
      $hasChildren: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        $variant: "empty",
        $hasChildren: true,
        class: "border-gray-500 dark:border-gray-300 md:border-[2.5px]",
      },
    ],
  },
);

const StyledTile = motion(BaseStyledTile);

const getAnimationProps = (variant: GameTile["variant"], delay = 0) => {
  const shouldAnimate = variant !== "empty";
  return {
    initial: shouldAnimate ? { transform: "rotateX(0)" } : false,
    animate: shouldAnimate ? { transform: FLIP_ROTATION } : false,
    transition: {
      type: "spring" as const,
      delay,
      duration: ANIMATION_DURATION,
    },
  };
};

const getLetterAnimationProps = (variant: GameTile["variant"], delay = 0) => {
  const shouldAnimate = variant !== "empty";
  return {
    initial: shouldAnimate ? { opacity: 0, transform: FLIP_ROTATION } : false,
    animate: shouldAnimate ? { opacity: 1 } : false,
    transition: {
      type: "spring" as const,
      delay: delay + LETTER_DELAY_OFFSET,
    },
  };
};

const Tile: FC<TileProps> = ({
  variant,
  children,
  delay = 0,
  size = DEFAULT_SIZE,
}) => {
  const hasChildren = Boolean(children);
  const containerStyle = {
    perspective: PERSPECTIVE,
    height: size,
    width: size,
  };
  const tileStyle = {
    height: size,
    width: size,
  };

  return (
    <div
      className="preserve-3d origin-center scale-90 sm:scale-100 lg:scale-110"
      style={containerStyle}
    >
      <StyledTile
        {...getAnimationProps(variant, delay)}
        $variant={variant}
        $hasChildren={hasChildren}
        style={tileStyle}
      >
        <motion.span {...getLetterAnimationProps(variant, delay)}>
          {children}
        </motion.span>
      </StyledTile>
    </div>
  );
};

export default Tile;
