
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardMain } from "./DashboardMain";
import { BatchManagement } from "./BatchManagement";
import { BatchExtractor } from "./BatchExtractor";
import { TemplateLibrary } from "./TemplateLibrary";
import { Analytics } from "./Analytics";
import { DashboardSettings } from "./DashboardSettings";

export const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardMain />;
      case "batches":
        return <BatchManagement />;
      case "batch-extractor":
        return <BatchExtractor />;
      case "templates":
        return <TemplateLibrary />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <DashboardSettings />;
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <main className="flex-1 overflow-auto">
        {renderMainContent()}
      </main>
    </div>
  );
};
