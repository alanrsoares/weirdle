"use client";

import { useState, type FC } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { useGameStore } from "~/stores/game";
import { useStatsStore } from "~/stores/stats";

export type Props = {
  open: boolean;
  onClose: () => void;
};

const SettingsModal: FC<Props> = (props) => {
  const { actions, state } = useGameStore();
  const { actions: statsActions } = useStatsStore();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleDarkModeChange = (checked: boolean) => {
    // Only toggle if the value doesn't match current state
    if (checked !== state.darkMode) {
      actions.toggleDarkMode();
    }
  };

  const handleResetStats = () => {
    statsActions.resetStats();
    setShowConfirmReset(false);
    props.onClose();
  };

  const handleCancelReset = () => {
    setShowConfirmReset(false);
  };

  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        if (!open) {
          setShowConfirmReset(false);
          props.onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        {showConfirmReset ? (
          <>
            <DialogHeader>
              <DialogTitle>Reset Statistics</DialogTitle>
              <DialogDescription>
                Are you sure you want to reset all your statistics? This action
                cannot be undone and will permanently delete all your game data,
                including wins, losses, streaks, and distribution history.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelReset}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleResetStats}
                className="w-full sm:w-auto"
              >
                Reset Statistics
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Customize your game experience and preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Dark Mode Setting */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="dark-mode"
                    className="text-base font-semibold"
                  >
                    Dark mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={state.darkMode}
                  onCheckedChange={handleDarkModeChange}
                />
              </div>

              <Separator />

              {/* Reset Stats Section */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-base font-semibold">Statistics</Label>
                  <p className="text-sm text-muted-foreground">
                    Clear all your game statistics and start fresh
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowConfirmReset(true)}
                  className="w-full sm:w-auto"
                >
                  Reset Statistics
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
