import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Appliance } from "@/hooks/useSmartHome";

interface ApplianceCardProps {
  appliance: Appliance;
  isLoading: boolean;
  onToggle: (id: number) => void;
  onClick: () => void;
}

export const ApplianceCard = ({
  appliance,
  isLoading,
  onToggle,
  onClick,
}: ApplianceCardProps) => {
  const stateColor = appliance.state ? "text-success" : "text-muted-foreground";
  const stateText = appliance.state ? "ON" : "OFF";

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
      </CardContent>
    </Card>
  );
};
