import React, { useState } from 'react';
import { Workout } from '../types';
import { ChevronDownIcon, TrashIcon } from './Icons';

interface HistoryProps {
  workouts: Workout[];
  onDelete: (workoutId: string) => void;
}

const History: React.FC<HistoryProps> = ({ workouts, onDelete }) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);

  const toggleExpand = (workoutId: string) => {
    setExpandedWorkoutId(expandedWorkoutId === workoutId ? null : workoutId);
  };
  
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">Historia Treningów</h1>
      {sortedWorkouts.length === 0 ? (
        <p className="text-gray-400">Brak zapisanych treningów. Ukończ pierwszy trening, aby zobaczyć go tutaj.</p>
      ) : (
        <div className="space-y-4">
          {sortedWorkouts.map(workout => (
            <div key={workout.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-700/50 transition-colors" onClick={() => toggleExpand(workout.id)}>
                <div>
                  <p className="text-lg font-semibold">{workout.workoutType}</p>
                  <p className="text-sm text-gray-400">{new Date(workout.date).toLocaleDateString('pl-PL')} | {workout.duration} min | Objętość: {workout.volume} kg</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Czy na pewno chcesz usunąć ten trening?')) {
                            onDelete(workout.id);
                        }
                      }} 
                      className="text-red-500 hover:text-red-400 p-2"
                      aria-label="Usuń trening"
                    >
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform ${expandedWorkoutId === workout.id ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {expandedWorkoutId === workout.id && (
                <div className="p-4 border-t border-gray-700">
                  <h4 className="font-semibold mb-2">Szczegóły:</h4>
                  <ul className="space-y-2">
                    {workout.exercises.filter(ex => ex.sets.length > 0).map(ex => (
                      <li key={ex.id} className="text-sm">
                        <p className="font-medium text-gray-300">{ex.name}</p>
                        <p className="text-gray-400 pl-4">
                          {ex.sets.map((s, i) => `${s.weight}kg x ${s.reps} reps`).join(' | ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
