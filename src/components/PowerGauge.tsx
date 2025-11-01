import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface PowerGaugeProps {
  power: number;
  maxPower?: number;
}

export const PowerGauge = ({ power, maxPower = 500 }: PowerGaugeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gauge background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#2a2a3e";
    ctx.stroke();

    // Calculate angle based on power
    const percentage = Math.min(power / maxPower, 1);
    const angle = Math.PI + percentage * Math.PI;

    // Determine color based on power level
    let color = "#00C853"; // Green
    if (power > 400) color = "#F44336"; // Red
    else if (power > 300) color = "#FF9800"; // Orange
    else if (power > 100) color = "#FFC107"; // Yellow

    // Draw power arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, angle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();

    // Draw needle
    const needleLength = radius - 30;
    const needleAngle = angle;
    const needleX = centerX + needleLength * Math.cos(needleAngle);
    const needleY = centerY + needleLength * Math.sin(needleAngle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleX, needleY);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Draw scale markers
    for (let i = 0; i <= 10; i++) {
      const markerAngle = Math.PI + (i / 10) * Math.PI;
      const markerStartRadius = radius - 15;
      const markerEndRadius = radius - 5;
      const startX = centerX + markerStartRadius * Math.cos(markerAngle);
      const startY = centerY + markerStartRadius * Math.sin(markerAngle);
      const endX = centerX + markerEndRadius * Math.cos(markerAngle);
      const endY = centerY + markerEndRadius * Math.sin(markerAngle);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }
  }, [power, maxPower]);

  return (
    <Card className="bg-card/70 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle>Real-Time Power Consumption</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          className="max-w-full"
        />
        <div className="text-center mt-4">
          <p className="text-4xl font-bold">{Math.round(power)}W</p>
          <p className="text-sm text-muted-foreground">Current Power Usage</p>
        </div>
      </CardContent>
    </Card>
  );
};
