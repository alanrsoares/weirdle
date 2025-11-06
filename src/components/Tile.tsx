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
  "grid place-items-center border-2 text-xl uppercase select-none md:text-2xl dark:text-white font-semibold tracking-wider shadow-sm transition-all duration-200",
  {
    variants: {
      $variant: {
        correct: "border-green-600 bg-green-600 text-white shadow-md shadow-green-600/20",
        present: "border-yellow-500 bg-yellow-500 text-white shadow-md shadow-yellow-500/20",
        absent: "border-gray-400 bg-gray-400 text-white shadow-md shadow-gray-400/20 dark:border-gray-500 dark:bg-gray-500",
        empty: "border-gray-300 bg-transparent dark:border-gray-600",
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
        class: "border-gray-400 bg-gray-50 dark:border-gray-500 dark:bg-gray-800/50 md:border-[2.5px] shadow-sm",
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
