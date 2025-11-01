import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, RotateCcw, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResetStatistics: () => void;
}

export const SettingsModal = ({
  open,
  onOpenChange,
  onResetStatistics,
}: SettingsModalProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>System Settings</DialogTitle>
          <DialogDescription>
            Configure your smart home dashboard settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">WiFi Network:</span>
                <span className="font-medium">Home-WiFi-5G</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signal Strength:</span>
                <span className="font-medium">-45 dBm (Excellent)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address:</span>
                <span className="font-medium">192.168.1.100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime:</span>
                <span className="font-medium">2d 15h 42m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Firmware:</span>
                <span className="font-medium">v1.2.3</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <Label htmlFor="theme-toggle">Dark Mode</Label>
              </div>
              <Switch
                id="theme-toggle"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Now
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onResetStatistics}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Statistics
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
