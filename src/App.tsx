import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { CampusDataProvider } from './context/CampusDataContext.js';
import { Sidebar, ActiveTab } from './components/layout/Sidebar.js';
import { TopNavbar } from './components/layout/TopNavbar.js';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal.js';
import { NotificationDrawer } from './components/modals/NotificationDrawer.js';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer.js';
import { CrossModuleOrchestratorModal } from './components/ai/CrossModuleOrchestratorModal.js';

// Modules
import { DashboardModule } from './components/modules/DashboardModule.js';
import { TimetableModule } from './components/modules/TimetableModule.js';
import { OccupancyModule } from './components/modules/OccupancyModule.js';
import { TransportModule } from './components/modules/TransportModule.js';
import { LaboratoryModule } from './components/modules/LaboratoryModule.js';
import { GrievanceModule } from './components/modules/GrievanceModule.js';
import { EnergyModule } from './components/modules/EnergyModule.js';
import { CampusDigitalTwin } from './components/modules/CampusDigitalTwin.js';
import { SafetyEmergencyModule } from './components/modules/SafetyEmergencyModule.js';
import { QueueModule } from './components/modules/QueueModule.js';
import { LostFoundModule } from './components/modules/LostFoundModule.js';
import { KnowledgeHubModule } from './components/modules/KnowledgeHubModule.js';
import { AnalyticsReportsModule } from './components/modules/AnalyticsReportsModule.js';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState<boolean>(false);
  const [assistantDrawerOpen, setAssistantDrawerOpen] = useState<boolean>(false);
  const [orchestratorModalOpen, setOrchestratorModalOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  // Sync theme with body class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardModule
            onNavigate={setActiveTab}
            onOpenOrchestrator={() => setOrchestratorModalOpen(true)}
            onOpenAssistant={() => setAssistantDrawerOpen(true)}
          />
        );
      case 'timetable':
        return <TimetableModule />;
      case 'occupancy':
        return <OccupancyModule />;
      case 'transport':
        return <TransportModule />;
      case 'laboratories':
        return <LaboratoryModule />;
      case 'grievances':
        return <GrievanceModule />;
      case 'energy':
        return <EnergyModule />;
      case 'digital_twin':
        return <CampusDigitalTwin />;
      case 'safety':
        return <SafetyEmergencyModule />;
      case 'queue':
        return <QueueModule />;
      case 'lost_found':
        return <LostFoundModule />;
      case 'knowledge_hub':
        return <KnowledgeHubModule />;
      case 'analytics':
        return <AnalyticsReportsModule />;
      default:
        return (
          <DashboardModule
            onNavigate={setActiveTab}
            onOpenOrchestrator={() => setOrchestratorModalOpen(true)}
            onOpenAssistant={() => setAssistantDrawerOpen(true)}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} antialiased font-sans`}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenOrchestrator={() => setOrchestratorModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenAssistant={() => setAssistantDrawerOpen(true)}
          onOpenNotifications={() => setNotificationDrawerOpen(true)}
          onToggleSidebarMobile={() => setSidebarCollapsed(!sidebarCollapsed)}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderModule()}
        </main>
      </div>

      {/* Modals & Slide-Overs */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={setActiveTab}
      />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNavigate={setActiveTab}
      />

      <AIAssistantDrawer
        isOpen={assistantDrawerOpen}
        onClose={() => setAssistantDrawerOpen(false)}
        onNavigate={setActiveTab}
      />

      <CrossModuleOrchestratorModal
        isOpen={orchestratorModalOpen}
        onClose={() => setOrchestratorModalOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CampusDataProvider>
        <MainAppContent />
      </CampusDataProvider>
    </AuthProvider>
  );
}
