
import React, { useState, useMemo } from 'react';
import { Workout, MuscleGroup } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

interface DashboardProps {
  workouts: Workout[];
}

const processWorkoutData = (workouts: Workout[], timeFilter: 'day' | 'week' | 'month') => {
  const now = new Date();
  const filteredWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    if (timeFilter === 'day') {
      return workoutDate.toDateString() === now.toDateString();
    }
    if (timeFilter === 'week') {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return workoutDate >= oneWeekAgo;
    }
    if (timeFilter === 'month') {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return workoutDate >= oneMonthAgo;
    }
    return true;
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


const Dashboard: React.FC<DashboardProps> = ({ workouts }) => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'day' | 'month'>('week');
  
  const { volumeChartData, setsChartData, totalVolume, totalSets, totalWorkouts, volumeOverTime } = useMemo(
    () => processWorkoutData(workouts, timeFilter),
    [workouts, timeFilter]
  );
  
  const timeFilterLabels = { day: 'Dziś', week: 'Ostatnie 7 dni', month: 'Ostatnie 30 dni'};

  const renderChart = (title: string, data: any[], dataKey: string, color: string) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md h-96">
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#A0AEC0" angle={-45} textAnchor="end" interval={0} />
          <YAxis stroke="#A0AEC0" />
          <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none', color: '#E2E8F0' }} />
          <Legend />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Statystyki</h1>

      <div className="mb-6">
        <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg w-min">
            {(['day', 'week', 'month'] as const).map(filter => (
                 <button key={filter} onClick={() => setTimeFilter(filter)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${timeFilter === filter ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{timeFilterLabels[filter]}</button>
            ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h4 className="text-gray-400 text-sm font-medium">Całkowita objętość ({timeFilterLabels[timeFilter]})</h4>
            <p className="text-3xl font-bold text-white mt-2">{totalVolume.toLocaleString()} kg</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h4 className="text-gray-400 text-sm font-medium">Liczba serii ({timeFilterLabels[timeFilter]})</h4>
            <p className="text-3xl font-bold text-white mt-2">{totalSets}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h4 className="text-gray-400 text-sm font-medium">Liczba treningów ({timeFilterLabels[timeFilter]})</h4>
            <p className="text-3xl font-bold text-white mt-2">{totalWorkouts}</p>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {renderChart(`Objętość na partie mięśniowe (${timeFilterLabels[timeFilter]})`, volumeChartData, 'Objętość', '#2dd4bf')}
        {renderChart(`Liczba serii na partie mięśniowe (${timeFilterLabels[timeFilter]})`, setsChartData, 'Serie', '#60a5fa')}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-md h-96">
        <h3 className="text-lg font-semibold mb-4 text-white">Objętość treningowa w czasie</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={volumeOverTime} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="date" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="Objętość" stroke="#2dd4bf" strokeWidth={2} dot={{r:4}} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Dashboard;
