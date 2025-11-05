import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export interface Schedule {
  id: string;
  enabled: boolean;
  time: string; // HH:mm format
  days: number[]; // 0-6 (Sun-Sat)
  action: "on" | "off";
}

export interface Timer {
  enabled: boolean;
  duration: number; // seconds
  startTime: number; // timestamp
  action: "on" | "off";
}

export interface Appliance {
  id: number;
  name: string;
  icon: string;
  state: boolean;
  power: number;
  lastUpdate: number;
  energyToday: number;
  usageDuration: number;
  schedules: Schedule[];
  timer: Timer | null;
  inverted?: boolean; // For relays that work opposite (active LOW)
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

const DEFAULT_NODEMCU_IP = "10.105.117.150";
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
    schedules: [],
    timer: null,
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
    schedules: [],
    timer: null,
    inverted: true,
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
    schedules: [],
    timer: null,
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
    schedules: [],
    timer: null,
    inverted: true,
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
  const [nodeMcuIp, setNodeMcuIp] = useState<string>(() => {
    return localStorage.getItem("nodeMcuIp") || DEFAULT_NODEMCU_IP;
  });

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
        // Map appliance ID to relay index (1->0, 2->1, 3->2, 4->3)
        const relayIndex = id - 1;
        const url = `http://${nodeMcuIp}/toggle?r=${relayIndex}`;
        
        // Call NodeMCU relay toggle endpoint
        await fetch(url, { mode: 'no-cors' });

        // For inverted relays, the state needs to be flipped
        const newState = appliance.inverted ? appliance.state : !appliance.state;

        setAppliances((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, state: newState, lastUpdate: Date.now() }
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

  const addSchedule = useCallback((applianceId: number, schedule: Omit<Schedule, "id">) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now().toString(),
    };
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === applianceId
          ? { ...a, schedules: [...a.schedules, newSchedule] }
          : a
      )
    );
    addNotification("info", "Schedule added successfully");
    toast({
      title: "Success",
      description: "Schedule has been added",
    });
  }, [addNotification]);

  const deleteSchedule = useCallback((applianceId: number, scheduleId: string) => {
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === applianceId
          ? { ...a, schedules: a.schedules.filter((s) => s.id !== scheduleId) }
          : a
      )
    );
    addNotification("info", "Schedule deleted");
  }, [addNotification]);

  const toggleSchedule = useCallback((applianceId: number, scheduleId: string) => {
    setAppliances((prev) =>
      prev.map((a) =>
        a.id === applianceId
          ? {
              ...a,
              schedules: a.schedules.map((s) =>
                s.id === scheduleId ? { ...s, enabled: !s.enabled } : s
              ),
            }
          : a
      )
    );
  }, []);

  const setTimer = useCallback((applianceId: number, duration: number, action: "on" | "off") => {
    const appliance = appliances.find((a) => a.id === applianceId);
    if (!appliance) return;

    const timer: Timer = {
      enabled: true,
      duration,
      startTime: Date.now(),
      action,
    };

    setAppliances((prev) =>
      prev.map((a) => (a.id === applianceId ? { ...a, timer } : a))
    );

    addNotification("info", `Timer set for ${duration} seconds`);
    toast({
      title: "Success",
      description: `Timer set for ${duration} seconds`,
    });
  }, [appliances, addNotification]);

  const cancelTimer = useCallback((applianceId: number) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === applianceId ? { ...a, timer: null } : a))
    );
    addNotification("info", "Timer cancelled");
  }, [addNotification]);

  const updateNodeMcuIp = useCallback((newIp: string) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIp)) {
      toast({
        title: "Invalid IP",
        description: "Please enter a valid IP address",
        variant: "destructive",
      });
      return false;
    }
    
    const parts = newIp.split('.');
    if (parts.some(part => parseInt(part) > 255)) {
      toast({
        title: "Invalid IP",
        description: "IP address parts must be between 0-255",
        variant: "destructive",
      });
      return false;
    }

    setNodeMcuIp(newIp);
    localStorage.setItem("nodeMcuIp", newIp);
    addNotification("info", `NodeMCU IP updated to ${newIp}`);
    toast({
      title: "Success",
      description: "NodeMCU IP address updated",
    });
    return true;
  }, [addNotification]);

  // Check timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      appliances.forEach((appliance) => {
        if (appliance.timer && appliance.timer.enabled) {
          const elapsed = (now - appliance.timer.startTime) / 1000; // seconds
          if (elapsed >= appliance.timer.duration) {
            toggleAppliance(appliance.id);
            cancelTimer(appliance.id);
            addNotification(
              "info",
              `Timer completed: ${appliance.name} turned ${appliance.timer.action.toUpperCase()}`
            );
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [appliances, toggleAppliance, cancelTimer, addNotification]);

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
    addSchedule,
    deleteSchedule,
    toggleSchedule,
    setTimer,
    cancelTimer,
    electricityRate: ELECTRICITY_RATE,
    nodeMcuIp,
    updateNodeMcuIp,
  };
};
