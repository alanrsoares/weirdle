import { ModalKind } from "stores/game/constants";
import { IconButton } from "./Button";
import { BarChartIcon, CogIcon, HelpIcon } from "./icons";

const APP_TITLE = "wordle";

export default function Header(props: {
  onIconClick(modalKind: ModalKind): void;
}) {
  return (
    <header className="flex justify-between w-full border-b-2 p-2">
      <div className="flex gap-2">
        <IconButton onClick={props.onIconClick.bind(null, "help")}>
          <HelpIcon />
        </IconButton>
      </div>
      <div className="font-bold text-4xl text-gray-600 uppercase pointer-events-none text-center tracking-widest">
        {APP_TITLE}
      </div>
      <div className="flex gap-2">
        <IconButton onClick={props.onIconClick.bind(null, "stats")}>
          <BarChartIcon />
        </IconButton>
        <IconButton onClick={props.onIconClick.bind(null, "settings")}>
          <CogIcon />
        </IconButton>
      </div>
    </header>
  );
}
