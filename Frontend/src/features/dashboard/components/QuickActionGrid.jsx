import { Key, Server, Gauge, Activity, AlertTriangle, HeartPulse } from "lucide-react";

function QuickActionGrid() {
  const actions = [
    { name: "Create API Key", icon: Key, action: "create-key" },
    { name: "Register Service", icon: Server, action: "add-service" },
    { name: "Set Rate Limit", icon: Gauge, action: "set-limit" },
    { name: "Traffic Monitor", icon: Activity, action: "view-traffic" },
    { name: "Security Alerts", icon: AlertTriangle, action: "alerts" },
    { name: "System Health", icon: HeartPulse, action: "health" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.name}
            type="button"
            className="rounded-[20px] border border-[#EBECEF] bg-white p-4 shadow-2xs hover:shadow-sm hover:border-[#18181B]/30 transition-all flex flex-col justify-between h-24 text-left cursor-pointer group"
          >
            <div className="h-8 w-8 rounded-xl border border-[#EBECEF] bg-[#F8F9FA] flex items-center justify-center text-[#18181B] group-hover:bg-[#18181B] group-hover:text-white transition-all shadow-2xs">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-[#18181B] tracking-tight group-hover:text-[#18181B]">
              {act.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default QuickActionGrid;
