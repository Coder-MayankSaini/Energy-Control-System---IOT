import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ApplianceCard } from "@/components/ApplianceCard";
import { MetricsPanel } from "@/components/MetricsPanel";
import { PowerGauge } from "@/components/PowerGauge";
import { HistoricalCharts } from "@/components/HistoricalCharts";
import { ApplianceDetails } from "@/components/ApplianceDetails";
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
    electricityRate,
    nodeMcuIp,
    updateNodeMcuIp,
  } = useSmartHome();

  const selectedAppliance = selectedApplianceId
    ? appliances.find((a) => a.id === selectedApplianceId)
    : null;

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

        <MetricsPanel metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Appliance Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appliances.map((appliance) => (
                <ApplianceCard
                  key={appliance.id}
                  appliance={appliance}
                  isLoading={isLoading}
                  onToggle={toggleAppliance}
                  onClick={() => setSelectedApplianceId(appliance.id)}
                  onScheduleClick={() => setScheduleApplianceId(appliance.id)}
                  onTimerClick={() => setTimerApplianceId(appliance.id)}
                />
              ))}
            </div>
          </div>
          <div>
            <PowerGauge power={metrics.power} />
          </div>
        </div>

        <HistoricalCharts history24h={history24h} history7d={history7d} />

        {selectedAppliance && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Appliance Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {appliances.map((appliance) => (
                <ApplianceDetails
                  key={appliance.id}
                  appliance={appliance}
                  electricityRate={electricityRate}
                />
              ))}
            </div>
          </div>
        )}

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onResetStatistics={resetStatistics}
        nodeMcuIp={nodeMcuIp}
        onUpdateIp={updateNodeMcuIp}
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
