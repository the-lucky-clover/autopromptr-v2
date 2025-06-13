
import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardMain from "./DashboardMain";

export const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-auto">
        <DashboardMain activeSection={activeSection} />
      </main>
    </div>
  );
};
