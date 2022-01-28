import { APP_NAME, ModalKind } from "stores/game/constants";

import { IconButton } from "./Button";
import { BarChartIcon, CogIcon, HelpIcon } from "./icons";

type Props = {
  onIconClick(modalKind: ModalKind): void;
};

export default function Header(props: Props) {
  return (
    <header className="w-full border-b-2 bg-brand p-4 dark:border-gray-800">
      <div className="m-auto flex max-w-lg justify-between">
        <div className="flex gap-2">
          <IconButton onClick={props.onIconClick.bind(null, "help")}>
            <HelpIcon />
          </IconButton>
        </div>
        <div className="pointer-events-none text-center text-4xl font-bold uppercase tracking-widest text-white">
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
