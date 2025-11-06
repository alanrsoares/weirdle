"use client";

import { useState, type FC } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
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
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleDarkModeChange = (checked: boolean) => {
    // Only toggle if the value doesn't match current state
    if (checked !== state.darkMode) {
      actions.toggleDarkMode();
    }
  };

  const handleResetStats = () => {
    statsActions.resetStats();
    setShowResetDialog(false);
  };

  return (
    <>
      <Dialog
        open={props.open}
        onOpenChange={(open) => !open && props.onClose()}
      >
        <DialogContent className="sm:max-w-[425px]">
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
                <Label htmlFor="dark-mode" className="text-base font-semibold">
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
                onClick={() => setShowResetDialog(true)}
                className="w-full sm:w-auto"
              >
                Reset Statistics
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Stats Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Statistics</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all your statistics? This action
              cannot be undone and will permanently delete all your game data,
              including wins, losses, streaks, and distribution history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetStats}>
              Reset Statistics
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SettingsModal;
