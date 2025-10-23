
import React, { useState, useEffect, useCallback } from 'react';
import { WorkoutTemplate, Workout, LoggedExercise, Set as LoggedSet, Page } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface NewWorkoutProps {
  templates: WorkoutTemplate[];
  workouts: Workout[];
  onSave: (workout: Workout) => void;
  onSetPage: (page: Page) => void;
}

const NewWorkout: React.FC<NewWorkoutProps> = ({ templates, workouts, onSave, onSetPage }) => {
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>(templates[0]?.name || '');
  const [currentWorkout, setCurrentWorkout] = useState<Omit<Workout, 'id' | 'volume' | 'duration'> | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startWorkout = useCallback(() => {
    const template = templates.find(t => t.name === selectedTemplateName);
    if (template) {
      const today = new Date().toISOString().split('T')[0];
      setCurrentWorkout({
        date: today,
        workoutType: template.name,
        exercises: template.exercises.map(ex => ({
          id: `${Date.now()}-${ex.name}`,
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          sets: [],
          volume: 0,
        })),
      });
      setStartTime(new Date());
    }
  }, [selectedTemplateName, templates]);

  useEffect(() => {
    startWorkout();
  }, [startWorkout]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentWorkout) {
      setCurrentWorkout({ ...currentWorkout, date: e.target.value });
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplateName(e.target.value);
  };
  
  const addSet = (exerciseId: string) => {
    if (!currentWorkout) return;
    const newExercises = currentWorkout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: LoggedSet = { 
          id: `${exerciseId}-${ex.sets.length}`,
          weight: lastSet?.weight || 0,
          reps: lastSet?.reps || 0
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    });
    setCurrentWorkout({ ...currentWorkout, exercises: newExercises });
  };

  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
    if (!currentWorkout) return;
    const newExercises = currentWorkout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const newSets = ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s);
        return { ...ex, sets: newSets };
      }
      return ex;
    });
    setCurrentWorkout({ ...currentWorkout, exercises: newExercises });
  };
  
  const removeSet = (exerciseId: string, setId: string) => {
    if (!currentWorkout) return;
    const newExercises = currentWorkout.exercises.map(ex => {
        if (ex.id === exerciseId) {
            return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
        }
        return ex;
    });
    setCurrentWorkout({ ...currentWorkout, exercises: newExercises });
  };

  const getLastPerformance = (exerciseName: string) => {
    for (let i = workouts.length - 1; i >= 0; i--) {
      const workout = workouts[i];
      const exercise = workout.exercises.find(ex => ex.name === exerciseName);
      if (exercise && exercise.sets.length > 0) {
        const lastWeight = exercise.sets[0].weight;
        const setsCount = exercise.sets.length;
        const reps = exercise.sets.map(s => s.reps).join(', ');
        return `Ostatnio: ${lastWeight}kg, ${setsCount} serie (${reps} reps)`;
      }
    }
    return 'Brak poprzednich danych.';
  };

  const saveWorkout = () => {
    if (currentWorkout && startTime) {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      let totalVolume = 0;
      const exercisesWithVolume = currentWorkout.exercises.map(ex => {
        const exerciseVolume = ex.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
        totalVolume += exerciseVolume;
        return {...ex, volume: exerciseVolume};
      });

      const finalWorkout: Workout = {
        id: Date.now().toString(),
        ...currentWorkout,
        exercises: exercisesWithVolume,
        volume: totalVolume,
        duration,
      };
      onSave(finalWorkout);
      alert(`Trening zapisany! Całkowita objętość: ${totalVolume}kg`);
      setCurrentWorkout(null);
      onSetPage('Historia');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Nowy Trening</h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <label htmlFor="workout-template" className="block text-sm font-medium text-gray-400 mb-1">Wybierz plan treningowy</label>
          <select 
            id="workout-template"
            value={selectedTemplateName}
            onChange={handleTemplateChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
          >
            {templates.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        {currentWorkout && (
            <div className="flex-1">
                <label htmlFor="workout-date" className="block text-sm font-medium text-gray-400 mb-1">Data</label>
                <input 
                    type="date" 
                    id="workout-date"
                    value={currentWorkout.date}
                    onChange={handleDateChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>
        )}
      </div>

      {currentWorkout ? (
        <div className="space-y-6">
          {currentWorkout.exercises.map((exercise, exIndex) => (
            <div key={exercise.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-white">{exercise.name} <span className="text-sm text-gray-400 font-normal">({exercise.muscleGroup})</span></h3>
              <p className="text-xs text-gray-500 mb-4">{getLastPerformance(exercise.name)}</p>
              
              <div className="space-y-3">
                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold w-8">{setIndex + 1}.</span>
                    <input 
                      type="number" 
                      placeholder="kg"
                      value={set.weight || ''}
                      onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-24 bg-gray-700 rounded-md p-2 text-center"
                    />
                    <input 
                      type="number"
                      placeholder="reps"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                      className="w-24 bg-gray-700 rounded-md p-2 text-center"
                    />
                    <button onClick={() => removeSet(exercise.id, set.id)} className="text-red-500 hover:text-red-400 p-2">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button onClick={() => addSet(exercise.id)} className="mt-4 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                <PlusIcon className="w-5 h-5"/>
                Dodaj serię
              </button>
            </div>
          ))}
          <button onClick={saveWorkout} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Zapisz Trening
          </button>
        </div>
      ) : (
        <p>Wybierz plan, aby rozpocząć...</p>
      )}
    </div>
  );
};

export default NewWorkout;
