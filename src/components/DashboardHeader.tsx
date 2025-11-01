import { useState, useEffect } from "react";
import { Settings, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  isOnline: boolean;
  onSettingsClick: () => void;
}

export const DashboardHeader = ({ isOnline, onSettingsClick }: DashboardHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-card/70 backdrop-blur-xl border-b border-border rounded-2xl p-6 mb-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Smart Home Energy Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-success">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium text-destructive">Offline</span>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onSettingsClick}
            className="rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
