import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ApplianceCard } from "@/components/ApplianceCard";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { SettingsModal } from "@/components/SettingsModal";
import { ScheduleModal } from "@/components/ScheduleModal";
import { TimerModal } from "@/components/TimerModal";
import { useSmartHome } from "@/hooks/useSmartHome";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedApplianceId, setSelectedApplianceId] = useState<number | null>(null);
  const [scheduleApplianceId, setScheduleApplianceId] = useState<number | null>(null);
  const [timerApplianceId, setTimerApplianceId] = useState<number | null>(null);

  const {
    appliances,
    isOnline,
    notifications,
    loadingAppliances,
    toggleAppliance,
    dismissNotification,
    addSchedule,
    deleteSchedule,
    toggleSchedule,
    setTimer,
    cancelTimer,
    esp32Ip,
    updateEsp32Ip,
  } = useSmartHome();

  const scheduleAppliance = scheduleApplianceId
    ? appliances.find((a) => a.id === scheduleApplianceId)
    : null;

  const timerAppliance = timerApplianceId
    ? appliances.find((a) => a.id === timerApplianceId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          isOnline={isOnline}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <NotificationsPanel
          notifications={notifications}
          onDismiss={dismissNotification}
        />

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Appliance Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appliances.map((appliance) => (
              <ApplianceCard
                key={appliance.id}
                appliance={appliance}
                isLoading={loadingAppliances.has(appliance.id)}
                onToggle={toggleAppliance}
                onClick={() => setSelectedApplianceId(appliance.id)}
                onScheduleClick={() => setScheduleApplianceId(appliance.id)}
                onTimerClick={() => setTimerApplianceId(appliance.id)}
              />
            ))}
          </div>
        </div>

        <SettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          esp32Ip={esp32Ip}
          onUpdateIp={updateEsp32Ip}
        />

        <ScheduleModal
          open={scheduleApplianceId !== null}
          onOpenChange={(open) => !open && setScheduleApplianceId(null)}
          appliance={scheduleAppliance}
          onAddSchedule={addSchedule}
          onDeleteSchedule={deleteSchedule}
          onToggleSchedule={toggleSchedule}
        />

        <TimerModal
          open={timerApplianceId !== null}
          onOpenChange={(open) => !open && setTimerApplianceId(null)}
          appliance={timerAppliance}
          onSetTimer={setTimer}
          onCancelTimer={cancelTimer}
        />
      </div>
    </div>
  );
};

export default Index;
