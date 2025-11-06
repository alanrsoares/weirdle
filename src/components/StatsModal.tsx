"use client";

import { useMemo, type FC } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useStatsStore } from "~/stores/stats";

export type Props = {
  open: boolean;
  onClose: () => void;
};

const StatsModal: FC<Props> = (props) => {
  const { state } = useStatsStore();

  const totalPlayed = state.wins + state.losses;
  const winPercentage = !state.wins ? 0 : (state.wins / totalPlayed) * 100;
  const maxDistributionValue = Math.max(...state.distribution, 1);

  const stats = useMemo(
    () => [
      {
        label: "Played",
        value: totalPlayed,
      },
      {
        label: "Win %",
        value: `${winPercentage.toFixed(0)}%`,
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
    [state.currentStreak, state.maxStreak, totalPlayed, winPercentage],
  );

  return (
    <Dialog open={props.open} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold tracking-wide uppercase">
            Statistics
          </DialogTitle>
          <DialogDescription className="text-center">
            Track your game performance and progress over time.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-1 rounded-lg border bg-card p-3 text-center"
              >
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Distribution Chart */}
          <div className="space-y-2">
            <div className="text-center text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Guess Distribution
            </div>
            <div className="space-y-2">
              {state.distribution.map((value, index) => {
                const percentage = state.wins
                  ? (value / maxDistributionValue) * 100
                  : 0;
                const hasValue = value > 0;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground">
                      {index + 1}
                    </div>
                    <div className="relative flex h-8 flex-1 items-center overflow-hidden rounded-md bg-muted">
                      <div
                        className={cn(
                          "flex h-full items-center justify-end px-2 transition-all duration-500",
                          hasValue
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}
                        style={{
                          width: `${hasValue ? Math.max(percentage, 6) : 0}%`,
                        }}
                      >
                        {hasValue && (
                          <span className="text-xs font-semibold">{value}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;
