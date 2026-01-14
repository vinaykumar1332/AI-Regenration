import { Card } from "@/app/components/ui/Card/card";



export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "text-primary" }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-semibold mb-2">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === "positive" ? "text-green-600" :
                changeType === "negative" ? "text-red-600" :
                  "text-muted-foreground"
              }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-primary/10 ${iconColor}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </Card>
  );
}













