import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  Settings,
  Zap,
  Users,
  CreditCard,
  Key,
  BookOpen,
  Monitor,
  Play,
  Calendar,
  Cpu,
  List
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "batches", label: "Batch Management", icon: FileText },
    { id: "templates", label: "Template Library", icon: BookOpen },
    { id: "local-tools", label: "Local Tools", icon: Monitor },
    { id: "execution-queue", label: "Execution Queue", icon: List },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-gray-900 border-r border-gray-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-white">AutoPromptr</span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
                activeSection === item.id && "bg-gray-800 text-white",
                collapsed && "px-2"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
              {!collapsed && item.label}
            </Button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
          {!collapsed && <span className="ml-3">Collapse</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
