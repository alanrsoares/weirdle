import { useMemo } from "react";
import { useStatsStore } from "stores/stats";
import Modal, { Props as ModalProps } from "./Modal";

export type Props = Pick<ModalProps, "open" | "onClose">;

export default function StatsModal(props: Props) {
  const { state } = useStatsStore();

  const totalPlayed = state.wins + state.losses;

  const stats = useMemo(
    () => [
      {
        label: "Played",
        value: totalPlayed,
      },
      {
        label: "Win %",
        value: (!state.wins ? 0 : (state.wins / totalPlayed) * 100).toFixed(0),
      },
      {
        label: "Current Streak",
        value: state.currentStreak,
      },
      {
        label: "Max Streak",
        value: state.maxStreak,
      },
    ],
    [state.currentStreak, state.maxStreak, state.wins, totalPlayed]
  );

  return (
    <Modal title="Statistics" open={props.open} onClose={props.onClose}>
      <div className="grid min-h-[20vh] w-full gap-4">
        <div className="flex w-full gap-2 text-black">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="grid flex-1 place-items-center gap-2 border p-2 px-3 text-center"
            >
              <div className="text-sm font-semibold text-gray-600">
                {stat.label}
              </div>
              {stat.value}
            </div>
          ))}
        </div>
        <div className="grid gap-1">
          {state.distribution.map((value, index) => (
            <div key={index} className="flex items-center font-semibold">
              <div className="w-8 p-2 pr-1">{index + 1}</div>
              <div
                className="font-white gap-2 bg-gray-600 px-2 py-1 text-white"
                style={{ width: `${value ? (value / state.wins) * 100 : 6}%` }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
