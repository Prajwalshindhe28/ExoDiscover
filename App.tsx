import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import TrainingGroundsPage from './pages/TrainingGroundsPage';
import LearningCenterPage from './pages/LearningCenterPage';
import ExplorerPage from './pages/ExplorerPage';
import LiveAnalysisPage from './pages/LiveAnalysisPage';
import { Page } from './types';
import Chatbot from './components/Chatbot';
import { ScrollToTopButton } from './components/ScrollToTopButton';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderPage = useCallback(() => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'training-grounds':
        return <TrainingGroundsPage />;
      case 'learning-center':
        return <LearningCenterPage />;
      case 'data-explorer':
        return <ExplorerPage />;
      case 'live-analysis':
        return <LiveAnalysisPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  }, [activePage]);

  return (
    <div className="text-gray-200 min-h-screen">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className={`px-4 sm:px-6 lg:px-8 pt-4 pb-8 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {renderPage()}
      </main>
      <Chatbot />
      <ScrollToTopButton />
    </div>
  );
};

export default App;