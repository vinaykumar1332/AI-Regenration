import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/Button/button";
import { Card } from "@/app/components/ui/Card/card";
import { X, Trash2, CheckCircle, AlertCircle, Info } from "lucide-react";

export function NotificationPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Generation Complete",
      message: "Your image generation completed successfully",
      timestamp: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "New Feature Available",
      message: "Try our new bulk processing capabilities",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "alert",
      title: "Job Failed",
      message: "Video generation failed due to timeout",
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "success",
      title: "Subscription Updated",
      message: "Your subscription has been renewed",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: 5,
      type: "info",
      title: "API Rate Limit",
      message: "You're using 75% of your monthly API quota",
      timestamp: "2 days ago",
      read: true,
    },
  ]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "border-l-green-500/50 bg-green-500/5";
      case "alert":
        return "border-l-red-500/50 bg-red-500/5";
      case "info":
      default:
        return "border-l-blue-500/50 bg-blue-500/5";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] max-h-[70vh]"
          >
            <Card className="shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
                <div>
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-background/50 rounded-md transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      No new notifications
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    <AnimatePresence>
                      {notifications.map((notif, index) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 hover:bg-muted/30 transition-colors border-l-4 ${getColor(notif.type)}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-sm">{notif.title}</h4>
                                {!notif.read && (
                                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground/70 mt-2">
                                {notif.timestamp}
                              </p>
                            </div>
                            <button
                              onClick={() => removeNotification(notif.id)}
                              className="flex-shrink-0 p-1 hover:bg-destructive/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border bg-card/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={clearAll}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
