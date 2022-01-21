import Modal, { Props as ModalProps } from "./Modal";

export type Props = Pick<ModalProps, "open" | "onClose">;

export default function StatsModal(props: Props) {
  return (
    <Modal title="Statistics" open={props.open} onClose={props.onClose}>
      Hello Statistics
    </Modal>
  );
}
