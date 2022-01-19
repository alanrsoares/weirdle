import { IconButton } from "./button";
import { BarChartIcon, CogIcon, HelpIcon } from "./icons";

const APP_TITLE = "wordle";

export default function Header() {
  return (
    <header className="flex justify-between w-full border-b-2 p-2">
      <div className="flex gap-2">
        <IconButton>
          <HelpIcon />
        </IconButton>
      </div>
      <div className="font-bold text-4xl text-gray-600 uppercase pointer-events-none text-center tracking-widest">
        {APP_TITLE}
      </div>
      <div className="flex gap-2">
        <IconButton>
          <BarChartIcon />
        </IconButton>
        <IconButton>
          <CogIcon />
        </IconButton>
      </div>
    </header>
  );
}
