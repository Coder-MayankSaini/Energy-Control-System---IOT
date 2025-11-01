import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, X } from "lucide-react";
import { Notification } from "@/hooks/useSmartHome";

interface NotificationsPanelProps {
  notifications: Notification[];
  onDismiss: (id: number) => void;
}

export const NotificationsPanel = ({
  notifications,
  onDismiss,
}: NotificationsPanelProps) => {
  if (notifications.length === 0) return null;

  return (
    <Card className="mb-6 bg-card/70 backdrop-blur-xl border-border/50 animate-slide-in">
      <CardHeader>
        <CardTitle className="text-lg">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((notification) => {
          const isWarning = notification.type === "warning";
          const isError = notification.type === "error";
          const bgColor = isError
            ? "bg-destructive/10"
            : isWarning
            ? "bg-warning/10"
            : "bg-primary/10";
          const textColor = isError
            ? "text-destructive"
            : isWarning
            ? "text-warning"
            : "text-primary";

          return (
            <div
              key={notification.id}
              className={`flex items-start justify-between p-3 rounded-lg ${bgColor} animate-slide-in`}
            >
              <div className="flex items-start gap-3">
                {isWarning || isError ? (
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${textColor}`} />
                ) : (
                  <Info className={`h-5 w-5 mt-0.5 ${textColor}`} />
                )}
                <div>
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onDismiss(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
