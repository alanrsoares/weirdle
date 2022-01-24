import { APP_NAME, ModalKind } from "stores/game/constants";

import { IconButton } from "./Button";
import { BarChartIcon, CogIcon, HelpIcon } from "./icons";

type Props = {
  onIconClick(modalKind: ModalKind): void;
};

export default function Header(props: Props) {
  return (
    <header className="w-full border-b-2 dark:border-gray-800 md:p-4 p-2 bg-brand">
      <div className="flex justify-between max-w-lg m-auto">
        <div className="flex gap-2">
          <IconButton onClick={props.onIconClick.bind(null, "help")}>
            <HelpIcon />
          </IconButton>
        </div>
        <div className="font-bold text-4xl text-white uppercase pointer-events-none text-center tracking-widest">
          {APP_NAME}
        </div>
        <div className="flex gap-2">
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
