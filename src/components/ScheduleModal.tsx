import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Clock } from "lucide-react";
import { Appliance, Schedule } from "@/hooks/useSmartHome";

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appliance: Appliance | null;
  onAddSchedule: (applianceId: number, schedule: Omit<Schedule, "id">) => void;
  onDeleteSchedule: (applianceId: number, scheduleId: string) => void;
  onToggleSchedule: (applianceId: number, scheduleId: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ScheduleModal = ({
  open,
  onOpenChange,
  appliance,
  onAddSchedule,
  onDeleteSchedule,
  onToggleSchedule,
}: ScheduleModalProps) => {
  const [time, setTime] = useState("08:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [action, setAction] = useState<"on" | "off">("on");

  const handleAddSchedule = () => {
    if (!appliance || selectedDays.length === 0) return;

    onAddSchedule(appliance.id, {
      enabled: true,
      time,
      days: selectedDays,
      action,
    });

    // Reset form
    setTime("08:00");
    setSelectedDays([]);
    setAction("on");
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  if (!appliance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schedule {appliance.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Schedule */}
          <div className="space-y-4 p-4 rounded-lg bg-card/50 border border-border/50">
            <h3 className="font-semibold">Add New Schedule</h3>
            
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Days</Label>
              <div className="flex gap-2">
                {DAYS.map((day, index) => (
                  <Button
                    key={day}
                    size="sm"
                    variant={selectedDays.includes(index) ? "default" : "outline"}
                    onClick={() => toggleDay(index)}
                    className="w-12"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
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
              onClick={handleAddSchedule}
              disabled={selectedDays.length === 0}
              className="w-full"
            >
              Add Schedule
            </Button>
          </div>

          {/* Existing Schedules */}
          <div className="space-y-2">
            <h3 className="font-semibold">Active Schedules</h3>
            {appliance.schedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No schedules yet</p>
            ) : (
              <div className="space-y-2">
                {appliance.schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{schedule.time}</span>
                        <span className="text-xs text-muted-foreground">
                          {schedule.days.map((d) => DAYS[d]).join(", ")}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Turn {schedule.action.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={() => onToggleSchedule(appliance.id, schedule.id)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteSchedule(appliance.id, schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
