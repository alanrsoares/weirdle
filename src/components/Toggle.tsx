import { Switch } from "@headlessui/react";
import { FC } from "react";

export type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

const Toggle: FC<Props> = (props) => {
  return (
    <Switch
      checked={props.checked}
      onChange={props.onChange}
      className={`${props.checked ? "bg-teal-900" : "bg-teal-700"}
      relative inline-flex h-[38px] w-[74px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">{props.label}</span>
      <span
        aria-hidden="true"
        className={`${props.checked ? "translate-x-9" : "translate-x-0"}
        pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      >
        {props.children}
      </span>
    </Switch>
  );
};
export default Toggle;
