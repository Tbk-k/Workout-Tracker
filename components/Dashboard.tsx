import React, { useState, useMemo } from 'react';
import { Workout, MuscleGroup } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const processWorkoutData = (workouts: Workout[], startDateStr: string, endDateStr: string) => {
  if (!startDateStr || !endDateStr) {
    return { volumeChartData: [], setsChartData: [], totalVolume: 0, totalSets: 0, totalWorkouts: 0, volumeOverTime: [] };
  }
    
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  endDate.setHours(23, 59, 59, 999);
  
  const filteredWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= startDate && workoutDate <= endDate;
  });

  const volumeByMuscleGroup: { [key in MuscleGroup]?: number } = {};
  const setsByMuscleGroup: { [key in MuscleGroup]?: number } = {};

  for (const workout of filteredWorkouts) {
    for (const exercise of workout.exercises) {
      const group = exercise.muscleGroup;
      volumeByMuscleGroup[group] = (volumeByMuscleGroup[group] || 0) + exercise.volume;
      setsByMuscleGroup[group] = (setsByMuscleGroup[group] || 0) + exercise.sets.length;
    }
  }
  
  const volumeChartData = Object.entries(volumeByMuscleGroup).map(([name, value]) => ({ name, Objętość: value }));
  const setsChartData = Object.entries(setsByMuscleGroup).map(([name, value]) => ({ name, Serie: value }));

  const totalVolume = filteredWorkouts.reduce((sum, w) => sum + w.volume, 0);
  const totalSets = Object.values(setsByMuscleGroup).reduce((sum, s) => sum + (s || 0), 0);
  const totalWorkouts = filteredWorkouts.length;
  
  const volumeOverTime = workouts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(w => ({
      date: new Date(w.date).toLocaleDateString('pl-PL'),
      Objętość: w.volume,
  }));


  return { volumeChartData, setsChartData, totalVolume, totalSets, totalWorkouts, volumeOverTime };
};

const getISODateString = (date: Date) => date.toISOString().split('T')[0];

// Fix: Define DashboardProps interface
interface DashboardProps {
  workouts: Workout[];
}

const Dashboard: React.FC<DashboardProps> = ({ workouts }) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(getISODateString(thirtyDaysAgo));
  const [endDate, setEndDate] = useState<string>(getISODateString(today));
  
  const setDateRange = (period: 'today' | 'week' | 'month') => {
    const today = new Date();
    const end = getISODateString(today);
    let start: string;

    if (period === 'today') {
      start = getISODateString(today);
    } else if (period === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      start = getISODateString(sevenDaysAgo);
    } else { // month
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      start = getISODateString(thirtyDaysAgo);
    }
    setStartDate(start);
    setEndDate(end);
  };

  const { volumeChartData, setsChartData, totalVolume, totalSets, totalWorkouts, volumeOverTime } = useMemo(
    () => processWorkoutData(workouts, startDate, endDate),
    [workouts, startDate, endDate]
  );
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const dateRangeLabel = startDate === endDate ? formatDate(startDate) : `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const renderChart = (title: string, data: any[], dataKey: string, color: string) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md h-96">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#A0AEC0" angle={-45} textAnchor="end" interval={0} />
          <YAxis stroke="#A0AEC0" />
          <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none', color: '#E2E8F0' }} cursor={{fill: 'rgba(113, 113, 122, 0.2)'}}/>
          <Legend />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">Statystyki</h1>

      <div className="mb-6 bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center flex-wrap">
        <div className="flex-grow flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex-1 min-w-[160px]">
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-400 mb-1">Data początkowa</label>
                <input 
                    type="date" 
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500"
                />
            </div>
            <div className="flex-1 min-w-[160px]">
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-400 mb-1">Data końcowa</label>
                <input 
                    type="date" 
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500"
                />
            </div>
        </div>
        <div className="flex gap-2 pt-2 md:pt-6">
            <button onClick={() => setDateRange('today')} className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-2 rounded-md transition-colors">Dziś</button>
            <button onClick={() => setDateRange('week')} className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-2 rounded-md transition-colors">7 dni</button>
            <button onClick={() => setDateRange('month')} className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-2 rounded-md transition-colors">30 dni</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h4 className="text-gray-400 text-sm font-medium">Całkowita objętość</h4>
            <p className="text-xs text-gray-500 h-4">{dateRangeLabel}</p>
            <p className="text-3xl font-bold text-white mt-2">{totalVolume.toLocaleString()} kg</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h4 className="text-gray-400 text-sm font-medium">Liczba serii</h4>
            <p className="text-xs text-gray-500 h-4">{dateRangeLabel}</p>
            <p className="text-3xl font-bold text-white mt-2">{totalSets}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h4 className="text-gray-400 text-sm font-medium">Liczba treningów</h4>
            <p className="text-xs text-gray-500 h-4">{dateRangeLabel}</p>
            <p className="text-3xl font-bold text-white mt-2">{totalWorkouts}</p>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {renderChart('Objętość na partie mięśniowe', volumeChartData, 'Objętość', '#14b8a6')}
        {renderChart('Liczba serii na partie mięśniowe', setsChartData, 'Serie', '#6366f1')}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-md h-96">
        <h3 className="text-lg font-semibold mb-4 text-white">Objętość treningowa w czasie (cała historia)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={volumeOverTime} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} cursor={{fill: 'rgba(113, 113, 122, 0.2)'}}/>
            <Legend />
            <Line type="monotone" dataKey="Objętość" stroke="#14b8a6" strokeWidth={2} dot={{r:4, fill: '#14b8a6'}} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Dashboard;