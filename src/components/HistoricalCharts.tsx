import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { HistoryDataPoint, WeeklyDataPoint } from "@/hooks/useSmartHome";

interface HistoricalChartsProps {
  history24h: HistoryDataPoint[];
  history7d: WeeklyDataPoint[];
}

export const HistoricalCharts = ({
  history24h,
  history7d,
}: HistoricalChartsProps) => {
  const [activeTab, setActiveTab] = useState<"24h" | "7d">("24h");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="bg-card/70 backdrop-blur-xl border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>24-Hour Power History</CardTitle>
            <Button
              variant={activeTab === "24h" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("24h")}
            >
              24h
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={history24h}>
              <defs>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                label={{ value: "Power (W)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="power"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPower)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/70 backdrop-blur-xl border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>7-Day Energy Consumption</CardTitle>
            <Button
              variant={activeTab === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("7d")}
            >
              7d
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={history7d}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                label={{ value: "Energy (kWh)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="energy" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
