import React, { useState, useMemo } from 'react';
import { Page, Workout, WorkoutTemplate } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WORKOUT_TEMPLATES } from './constants';
import NewWorkout from './components/NewWorkout';
import History from './components/History';
import Dashboard from './components/Dashboard';
import Progression from './components/Progression';
import Settings from './components/Settings';
import Login from './components/Login';
import { DumbbellIcon, BarChartIcon, HistoryIcon, SettingsIcon, TrendingUpIcon } from './components/Icons';

const LogoutIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${isActive ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
    {icon}
    <span className="mx-4 font-medium">{label}</span>
  </button>
);

export default function App() {
  const [page, setPage] = useState<Page>('Statystyki');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('currentUser', null);
  
  const workoutKey = useMemo(() => currentUser ? `workouts_${currentUser}` : 'workouts', [currentUser]);
  const templateKey = useMemo(() => currentUser ? `templates_${currentUser}` : 'workout_templates', [currentUser]);

  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(workoutKey, []);
  const [templates, setTemplates] = useLocalStorage<WorkoutTemplate[]>(templateKey, WORKOUT_TEMPLATES);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('Statystyki'); 
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts(prev => [...prev, workout]);
  };

  const deleteWorkout = (workoutId: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
  };
  
  const saveTemplates = (newTemplates: WorkoutTemplate[]) => {
    setTemplates(newTemplates);
  };
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }
  
  const renderPage = () => {
    switch (page) {
      case 'Nowy Trening':
        return <NewWorkout templates={templates} workouts={workouts} onSave={addWorkout} onSetPage={setPage} />;
      case 'Historia':
        return <History workouts={workouts} onDelete={deleteWorkout} />;
      case 'Progresja':
        return <Progression workouts={workouts} />;
      case 'Ustawienia':
        return <Settings templates={templates} onSave={saveTemplates} />;
      case 'Statystyki':
      default:
        return <Dashboard workouts={workouts} />;
    }
  };
  
  const navItems: { page: Page; icon: React.ReactNode; label: string }[] = [
    { page: 'Nowy Trening', icon: <DumbbellIcon className="w-6 h-6" />, label: 'Nowy Trening' },
    { page: 'Statystyki', icon: <BarChartIcon className="w-6 h-6" />, label: 'Statystyki' },
    { page: 'Progresja', icon: <TrendingUpIcon className="w-6 h-6" />, label: 'Progresja' },
    { page: 'Historia', icon: <HistoryIcon className="w-6 h-6" />, label: 'Historia' },
    { page: 'Ustawienia', icon: <SettingsIcon className="w-6 h-6" />, label: 'Ustawienia' },
  ];

  const handleSetPage = (p: Page) => {
    setPage(p);
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
       <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

      <aside className={`fixed top-0 left-0 z-30 flex flex-col h-full w-64 bg-gray-800 shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-center p-6 border-b border-gray-700">
          <DumbbellIcon className="w-8 h-8 text-teal-400" />
          <span className="ml-3 text-2xl font-semibold text-white">GymTracker</span>
        </div>
        <nav className="mt-6 flex-grow">
          {navItems.map(item => (
            <NavItem 
              key={item.page}
              icon={item.icon}
              label={item.label}
              isActive={page === item.page}
              onClick={() => handleSetPage(item.page)}
            />
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200">
                <LogoutIcon className="w-6 h-6" />
                <span className="mx-4 font-medium">Wyloguj</span>
            </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-gray-800 lg:hidden">
          <div className="flex items-center">
            <DumbbellIcon className="w-6 h-6 text-teal-400" />
            <span className="ml-2 text-xl font-semibold text-white">GymTracker</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-300 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
