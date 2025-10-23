
import React, { useState, useMemo } from 'react';
import { Workout } from '../types';
import { ALL_EXERCISES } from '../constants';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';


interface ProgressionProps {
  workouts: Workout[];
}

const Progression: React.FC<ProgressionProps> = ({ workouts }) => {
  const [selectedExercise, setSelectedExercise] = useState<string>(ALL_EXERCISES[0]);

  const progressionData = useMemo(() => {
    if (!selectedExercise) return [];
    
    const data: {date: string; maxWeight: number; volume: number}[] = [];

    workouts.forEach(workout => {
        const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
        if (exercise && exercise.sets.length > 0) {
            const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
            const volume = exercise.volume;
            data.push({
                date: new Date(workout.date).toLocaleDateString('pl-PL'),
                maxWeight,
                volume
            });
        }
    });

    return data.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedExercise, workouts]);
  
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Progresja</h1>

      <div className="mb-6">
        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-400 mb-1">Wybierz ćwiczenie</label>
        <select
          id="exercise-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full md:w-1/2 bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
        >
          {ALL_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
        </select>
      </div>
      
      {progressionData.length < 2 ? (
          <p className="text-gray-400">Za mało danych do wyświetlenia progresji. Wykonaj przynajmniej dwa treningi z tym ćwiczeniem.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md h-96">
                <h3 className="text-lg font-semibold mb-4 text-white">Maksymalny ciężar w czasie</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressionData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
                        <Legend />
                        <Line type="monotone" dataKey="maxWeight" name="Max ciężar (kg)" stroke="#2dd4bf" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md h-96">
                <h3 className="text-lg font-semibold mb-4 text-white">Objętość w czasie</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressionData} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" />
                        <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} />
                        <Legend />
                        <Line type="monotone" dataKey="volume" name="Objętość (kg)" stroke="#60a5fa" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      )}
    </div>
  );
};

export default Progression;
