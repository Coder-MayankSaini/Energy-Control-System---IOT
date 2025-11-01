import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appliance } from "@/hooks/useSmartHome";
import { Zap, Clock, DollarSign } from "lucide-react";

interface ApplianceDetailsProps {
  appliance: Appliance;
  electricityRate: number;
}

export const ApplianceDetails = ({
  appliance,
  electricityRate,
}: ApplianceDetailsProps) => {
  const dailyCost = appliance.energyToday * electricityRate;
  const usageHours = Math.floor(appliance.usageDuration / 3600);
  const usageMinutes = Math.floor((appliance.usageDuration % 3600) / 60);

  return (
    <Card className="bg-card/70 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{appliance.icon}</span>
          {appliance.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
            <Zap className="h-5 w-5 mb-2 text-primary" />
            <p className="text-xs text-muted-foreground mb-1">Energy Today</p>
            <p className="text-lg font-bold">{appliance.energyToday.toFixed(2)} kWh</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
            <Clock className="h-5 w-5 mb-2 text-success" />
            <p className="text-xs text-muted-foreground mb-1">Usage Time</p>
            <p className="text-lg font-bold">
              {usageHours}h {usageMinutes}m
            </p>
          </div>
          <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
            <DollarSign className="h-5 w-5 mb-2 text-warning" />
            <p className="text-xs text-muted-foreground mb-1">Daily Cost</p>
            <p className="text-lg font-bold">₹{dailyCost.toFixed(2)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Power:</span>
            <span className="font-medium">{appliance.power}W</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span
              className={`font-medium ${
                appliance.state ? "text-success" : "text-muted-foreground"
              }`}
            >
              {appliance.state ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
