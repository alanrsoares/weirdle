import { APP_NAME, type ModalKind } from "~/stores/game/constants";
import { IconButton } from "./Button";
import { BarChartIcon, CogIcon, HelpIcon } from "./icons";

type Props = {
  onIconClick(modalKind: ModalKind): void;
};

export default function Header(props: Props) {
  return (
    <header className="w-full border-b border-brand/20 bg-brand shadow-sm dark:border-gray-800/50">
      <div className="m-auto flex max-w-lg items-center justify-between px-4 py-3.5">
        <div className="flex gap-1.5">
          <IconButton onClick={props.onIconClick.bind(null, "help")}>
            <HelpIcon />
          </IconButton>
        </div>
        <div className="pointer-events-none text-center text-3xl font-bold tracking-[0.2em] text-white uppercase md:text-4xl">
          {APP_NAME}
        </div>
        <div className="flex gap-1.5">
          <IconButton onClick={props.onIconClick.bind(null, "stats")}>
            <BarChartIcon />
          </IconButton>
          <IconButton onClick={props.onIconClick.bind(null, "settings")}>
            <CogIcon />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
