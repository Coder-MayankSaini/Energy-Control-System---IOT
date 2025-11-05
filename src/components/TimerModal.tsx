import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Timer as TimerIcon, X } from "lucide-react";
import { Appliance } from "@/hooks/useSmartHome";

interface TimerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appliance: Appliance | null;
  onSetTimer: (applianceId: number, duration: number, action: "on" | "off") => void;
  onCancelTimer: (applianceId: number) => void;
}

export const TimerModal = ({
  open,
  onOpenChange,
  appliance,
  onSetTimer,
  onCancelTimer,
}: TimerModalProps) => {
  const [duration, setDuration] = useState(30);
  const [action, setAction] = useState<"on" | "off">("off");

  const handleSetTimer = () => {
    if (!appliance || duration <= 0) return;
    onSetTimer(appliance.id, duration, action);
    onOpenChange(false);
  };

  const handleCancelTimer = () => {
    if (!appliance) return;
    onCancelTimer(appliance.id);
  };

  const getRemainingTime = () => {
    if (!appliance?.timer) return null;
    const elapsed = (Date.now() - appliance.timer.startTime) / 1000;
    const remaining = Math.max(0, appliance.timer.duration - elapsed);
    return Math.ceil(remaining);
  };

  if (!appliance) return null;

  const remainingTime = getRemainingTime();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TimerIcon className="h-5 w-5" />
            Timer for {appliance.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Active Timer */}
          {appliance.timer && remainingTime !== null && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Timer</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelTimer}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-2xl font-bold">{remainingTime} sec remaining</div>
              <div className="text-sm text-muted-foreground">
                Will turn {appliance.timer.action.toUpperCase()}
              </div>
            </div>
          )}

          {/* Set New Timer */}
          <div className="space-y-4 p-4 rounded-lg bg-card/50 border border-border/50">
            <h3 className="font-semibold">Set New Timer</h3>
            
            <div className="space-y-2">
              <Label>Duration (seconds)</Label>
              <Input
                type="number"
                min="1"
                max="86400"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              />
              <div className="flex gap-2 text-xs">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDuration(10)}
                >
                  10 sec
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDuration(30)}
                >
                  30 sec
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDuration(60)}
                >
                  1 min
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDuration(120)}
                >
                  2 min
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>After timer ends</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={action === "on" ? "default" : "outline"}
                  onClick={() => setAction("on")}
                  className="flex-1"
                >
                  Turn ON
                </Button>
                <Button
                  size="sm"
                  variant={action === "off" ? "default" : "outline"}
                  onClick={() => setAction("off")}
                  className="flex-1"
                >
                  Turn OFF
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSetTimer}
              disabled={duration <= 0}
              className="w-full"
            >
              Start Timer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
