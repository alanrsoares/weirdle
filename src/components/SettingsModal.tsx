import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "stores/game";
import Modal, { Props as ModalProps } from "./Modal";
import Toggle from "./Toggle";

export type Props = Pick<ModalProps, "open" | "onClose">;

export default function SettingsModal(props: Props) {
  const { actions, state } = useGameStore();

  return (
    <Modal title="Settings" open={props.open} onClose={props.onClose}>
      <div className="flex justify-between items-center gap-4">
        <label className="font-semibold">Dark mode:</label>
        <Toggle checked={state.darkMode} onChange={actions.toggleDarkMode} />
      </div>
    </Modal>
  );
}
