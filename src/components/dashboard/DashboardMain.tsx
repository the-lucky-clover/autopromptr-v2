
import { Analytics } from "./Analytics";
import { BatchManagement } from "./BatchManagement";
import { TemplateLibrary } from "./TemplateLibrary";
import { ApiKeyManagement } from "./ApiKeyManagement";
import DashboardSettings from "./DashboardSettings";
import LocalToolsSettings from "./LocalToolsSettings";
import LocalExecutionQueue from "./LocalExecutionQueue";

const DashboardMain = ({ activeSection }: { activeSection: string }) => {
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Analytics />;
      case "batches":
        return <BatchManagement />;
      case "templates":
        return <TemplateLibrary />;
      case "local-tools":
        return <LocalToolsSettings />;
      case "execution-queue":
        return <LocalExecutionQueue />;
      case "analytics":
        return <Analytics />;
      case "api-keys":
        return <ApiKeyManagement />;
      case "settings":
        return <DashboardSettings />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-950 overflow-auto">
      {renderSection()}
    </div>
  );
};

export default DashboardMain;
