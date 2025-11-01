import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, TrendingUp, Battery } from "lucide-react";
import { Metrics } from "@/hooks/useSmartHome";

interface MetricsPanelProps {
  metrics: Metrics;
}

const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  unit: string;
  icon: any;
  color: string;
}) => (
  <Card className="bg-card/70 backdrop-blur-xl border-border/50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">
            {value.toFixed(2)} <span className="text-sm font-normal">{unit}</span>
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const MetricsPanel = ({ metrics }: MetricsPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-in">
      <MetricCard
        title="Voltage"
        value={metrics.voltage}
        unit="V"
        icon={Zap}
        color="bg-primary"
      />
      <MetricCard
        title="Current"
        value={metrics.current}
        unit="A"
        icon={Activity}
        color="bg-success"
      />
      <MetricCard
        title="Power"
        value={metrics.power}
        unit="W"
        icon={TrendingUp}
        color={metrics.power > 300 ? "bg-warning" : "bg-primary"}
      />
      <MetricCard
        title="Energy Today"
        value={metrics.energyToday}
        unit="kWh"
        icon={Battery}
        color="bg-success"
      />
    </div>
  );
};
