import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeMcuIp: string;
  onUpdateIp: (ip: string) => boolean;
}

export const SettingsModal = ({
  open,
  onOpenChange,
  nodeMcuIp,
  onUpdateIp,
}: SettingsModalProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [ipInput, setIpInput] = useState(nodeMcuIp);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleIpUpdate = () => {
    if (onUpdateIp(ipInput)) {
      // IP updated successfully
    }
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
            <h3 className="font-semibold">NodeMCU Configuration</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="ip-address" className="text-sm">IP Address</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="ip-address"
                    placeholder="192.168.1.100"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleIpUpdate} size="sm">
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Current: {nodeMcuIp}
                </p>
              </div>
            </div>
          </div>

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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
