import React from 'react';
import { Page } from '../types';
import { HomeIcon, AiIcon, LearningIcon, TelescopeIcon, ExplorerIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, TargetIcon, LiveAnalysisIcon } from './icons/NavIcons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}> = ({ icon, label, isActive, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group ${
      isActive
        ? 'bg-blue-500/20 text-blue-300 shadow-lg'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
    } ${isCollapsed ? 'justify-center' : ''}`}
  >
    {icon}
    {!isCollapsed && <span className="ml-4 whitespace-nowrap">{label}</span>}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isCollapsed, setIsCollapsed }) => {
  return (
    <aside className={`fixed top-0 left-0 z-30 h-screen bg-black/20 backdrop-blur-sm border-r border-gray-700/50 p-6 flex-shrink-0 flex flex-col hidden md:flex transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center mb-12 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
        <TelescopeIcon className="w-10 h-10 text-blue-400 flex-shrink-0" />
        {!isCollapsed && (
            <h1 className="ml-3 text-2xl font-bold text-white font-orbitron whitespace-nowrap">
            Exo<span className="text-blue-400">Discover</span>
            </h1>
        )}
      </div>
      <nav className="flex flex-col space-y-3">
        <NavItem
          icon={<HomeIcon className="w-6 h-6 flex-shrink-0" />}
          label="Home"
          isActive={activePage === 'home'}
          onClick={() => setActivePage('home')}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<AiIcon className="w-6 h-6 flex-shrink-0" />}
          label="AI Dashboard"
          isActive={activePage === 'dashboard'}
          onClick={() => setActivePage('dashboard')}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<LiveAnalysisIcon className="w-6 h-6 flex-shrink-0" />}
          label="Live Analysis"
          isActive={activePage === 'live-analysis'}
          onClick={() => setActivePage('live-analysis')}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<ExplorerIcon className="w-6 h-6 flex-shrink-0" />}
          label="Data Explorer"
          isActive={activePage === 'data-explorer'}
          onClick={() => setActivePage('data-explorer')}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<LearningIcon className="w-6 h-6 flex-shrink-0" />}
          label="Learning Center"
          isActive={activePage === 'learning-center'}
          onClick={() => setActivePage('learning-center')}
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<TargetIcon className="w-6 h-6 flex-shrink-0" />}
          label="Training Grounds"
          isActive={activePage === 'training-grounds'}
          onClick={() => setActivePage('training-grounds')}
          isCollapsed={isCollapsed}
        />
      </nav>
      <div className="mt-auto text-center text-xs text-gray-500">
        {!isCollapsed && (
            <div className="transition-opacity duration-200">
                <p className="font-orbitron">NASA Space Apps 2025</p>
                <p>&copy; ExoDiscover Project</p>
            </div>
        )}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mt-4 p-2 rounded-lg hover:bg-gray-700/50 w-full flex justify-center text-gray-400 hover:text-white"
        >
            {isCollapsed ? <ChevronDoubleRightIcon className="w-5 h-5" /> : <ChevronDoubleLeftIcon className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};