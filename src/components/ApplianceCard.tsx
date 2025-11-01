import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Timer } from "lucide-react";
import { Appliance } from "@/hooks/useSmartHome";

interface ApplianceCardProps {
  appliance: Appliance;
  isLoading: boolean;
  onToggle: (id: number) => void;
  onClick: () => void;
  onScheduleClick: () => void;
  onTimerClick: () => void;
}

export const ApplianceCard = ({
  appliance,
  isLoading,
  onToggle,
  onClick,
  onScheduleClick,
  onTimerClick,
}: ApplianceCardProps) => {
  const stateColor = appliance.state ? "text-success" : "text-muted-foreground";
  const stateText = appliance.state ? "ON" : "OFF";
  const hasActiveSchedules = appliance.schedules.some((s) => s.enabled);
  const hasActiveTimer = appliance.timer !== null;

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-card/70 backdrop-blur-xl border-border/50"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl">{appliance.icon}</div>
          <Switch
            checked={appliance.state}
            onCheckedChange={() => onToggle(appliance.id)}
            disabled={isLoading}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-success"
          />
        </div>
        <h3 className="font-semibold text-lg mb-2">{appliance.name}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className={`text-sm font-medium ${stateColor} flex items-center gap-2`}>
              {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              {stateText}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Power:</span>
            <span className="text-sm font-medium">{appliance.power}W</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated: {new Date(appliance.lastUpdate).toLocaleTimeString()}
          </div>
        </div>

        {/* Schedule and Timer Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant={hasActiveSchedules ? "default" : "outline"}
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onScheduleClick();
            }}
          >
            <Clock className="h-4 w-4 mr-1" />
            {hasActiveSchedules ? `${appliance.schedules.filter((s) => s.enabled).length}` : "Schedule"}
          </Button>
          <Button
            size="sm"
            variant={hasActiveTimer ? "default" : "outline"}
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onTimerClick();
            }}
          >
            <Timer className="h-4 w-4 mr-1" />
            Timer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
