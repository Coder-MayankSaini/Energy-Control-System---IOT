import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export interface Appliance {
  id: number;
  name: string;
  icon: string;
  state: boolean;
  power: number;
  lastUpdate: number;
  energyToday: number;
  usageDuration: number;
}

export interface Metrics {
  voltage: number;
  current: number;
  power: number;
  energyToday: number;
  powerFactor: number;
  frequency: number;
  timestamp: number;
}

export interface HistoryDataPoint {
  time: string;
  power: number;
}

export interface WeeklyDataPoint {
  day: string;
  energy: number;
}

export interface Notification {
  id: number;
  type: "info" | "warning" | "error";
  message: string;
  timestamp: number;
}

const NODEMCU_IP = "192.168.1.100";
const API_PORT = 80;
const UPDATE_INTERVAL = 2000;
const ELECTRICITY_RATE = 8.5;

// Mock data for demo since NodeMCU might not be available
const mockAppliances: Appliance[] = [
  {
    id: 1,
    name: "Living Room Light",
    icon: "💡",
    state: false,
    power: 60,
    lastUpdate: Date.now(),
    energyToday: 0.48,
    usageDuration: 28800,
  },
  {
    id: 2,
    name: "Bedroom Fan",
    icon: "🌀",
    state: true,
    power: 75,
    lastUpdate: Date.now(),
    energyToday: 0.9,
    usageDuration: 43200,
  },
  {
    id: 3,
    name: "TV Hall",
    icon: "📺",
    state: false,
    power: 150,
    lastUpdate: Date.now(),
    energyToday: 1.2,
    usageDuration: 21600,
  },
  {
    id: 4,
    name: "Kitchen Outlet",
    icon: "🔌",
    state: true,
    power: 85,
    lastUpdate: Date.now(),
    energyToday: 0.68,
    usageDuration: 25200,
  },
];

const mockMetrics: Metrics = {
  voltage: 230.5,
  current: 0.91,
  power: 210,
  energyToday: 3.26,
  powerFactor: 0.98,
  frequency: 50,
  timestamp: Date.now(),
};

export const useSmartHome = () => {
  const [appliances, setAppliances] = useState<Appliance[]>(mockAppliances);
  const [metrics, setMetrics] = useState<Metrics>(mockMetrics);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [history24h, setHistory24h] = useState<HistoryDataPoint[]>([]);
  const [history7d, setHistory7d] = useState<WeeklyDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock historical data
  useEffect(() => {
    const generate24h = () => {
      const data: HistoryDataPoint[] = [];
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i.toString().padStart(2, "0")}:00`,
          power: Math.floor(Math.random() * 300) + 50,
        });
      }
      return data;
    };

    const generate7d = () => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day) => ({
        day,
        energy: Math.floor(Math.random() * 10) + 5,
      }));
    };

    setHistory24h(generate24h());
    setHistory7d(generate7d());
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        power: Math.max(0, prev.power + (Math.random() - 0.5) * 20),
        current: Math.max(0, prev.current + (Math.random() - 0.5) * 0.1),
        timestamp: Date.now(),
      }));

      // Random high power warning
      if (Math.random() > 0.95) {
        addNotification("warning", "High power consumption detected");
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const addNotification = useCallback(
    (type: "info" | "warning" | "error", message: string) => {
      const newNotification: Notification = {
        id: Date.now(),
        type,
        message,
        timestamp: Date.now(),
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 5));
    },
    []
  );

  const toggleAppliance = useCallback(
    async (id: number) => {
      setIsLoading(true);
      const appliance = appliances.find((a) => a.id === id);
      if (!appliance) return;

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        setAppliances((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, state: !a.state, lastUpdate: Date.now() }
              : a
          )
        );

        addNotification(
          "info",
          `${appliance.name} turned ${!appliance.state ? "ON" : "OFF"}`
        );

        toast({
          title: "Success",
          description: `${appliance.name} ${!appliance.state ? "ON" : "OFF"}`,
        });
      } catch (error) {
        addNotification("error", `Failed to control ${appliance.name}`);
        toast({
          title: "Error",
          description: "Failed to control appliance",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [appliances, addNotification]
  );

  const dismissNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const resetStatistics = useCallback(() => {
    setAppliances((prev) =>
      prev.map((a) => ({ ...a, energyToday: 0, usageDuration: 0 }))
    );
    setMetrics((prev) => ({ ...prev, energyToday: 0 }));
    addNotification("info", "Statistics reset successfully");
    toast({
      title: "Success",
      description: "Statistics have been reset",
    });
  }, [addNotification]);

  return {
    appliances,
    metrics,
    isOnline,
    notifications,
    history24h,
    history7d,
    isLoading,
    toggleAppliance,
    dismissNotification,
    resetStatistics,
    electricityRate: ELECTRICITY_RATE,
  };
};
