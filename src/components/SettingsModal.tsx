import { useCallback, useEffect, useState } from "react";
import Modal, { Props as ModalProps } from "./Modal";
import Toggle from "./Toggle";

export type Props = Pick<ModalProps, "open" | "onClose">;

const toggleDarMode = () => {
  document.body.classList.toggle("dark");
};

export default function SettingsModal(props: Props) {
  const [hasDarkMode, setHasDarkMode] = useState(false);

  useEffect(() => {
    setHasDarkMode(document.body.classList.contains("dark"));
  }, []);

  const handleToggleDarkMode = useCallback((checked: boolean) => {
    setHasDarkMode(checked);

    toggleDarMode();
  }, []);

  return (
    <Modal title="Settings" open={props.open} onClose={props.onClose}>
      <div className="flex justify-between items-center gap-4">
        <label className="font-semibold">Dark mode:</label>
        <Toggle checked={hasDarkMode} onChange={handleToggleDarkMode} />
      </div>
    </Modal>
  );
}
