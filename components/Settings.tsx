import React, { useState } from 'react';
import { WorkoutTemplate, ExerciseTemplate, MuscleGroup } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface SettingsProps {
  templates: WorkoutTemplate[];
  onSave: (templates: WorkoutTemplate[]) => void;
}

// Rozszerzone typy z tymczasowymi ID dla stabilnych kluczy w React
interface EditableExerciseTemplate extends ExerciseTemplate {
  _id: string;
}
interface EditableWorkoutTemplate {
  _id: string;
  name: string;
  exercises: EditableExerciseTemplate[];
}

const Settings: React.FC<SettingsProps> = ({ templates, onSave }) => {
  
  const [editableTemplates, setEditableTemplates] = useState<EditableWorkoutTemplate[]>(() => 
    JSON.parse(JSON.stringify(templates)).map((template: WorkoutTemplate) => ({
      ...template,
      _id: `t-${Math.random().toString(36).substr(2, 9)}`,
      exercises: template.exercises.map((exercise: ExerciseTemplate) => ({
        ...exercise,
        _id: `ex-${Math.random().toString(36).substr(2, 9)}`,
      })),
    }))
  );
  
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleTemplateNameChange = (templateId: string, newName: string) => {
    setEditableTemplates(current =>
      current.map(t => (t._id === templateId ? { ...t, name: newName } : t))
    );
  };

  const handleExerciseChange = (templateId: string, exerciseId: string, field: 'name' | 'muscleGroup', value: string) => {
    setEditableTemplates(current =>
      current.map(t => {
        if (t._id === templateId) {
          return {
            ...t,
            exercises: t.exercises.map(ex =>
              ex._id === exerciseId ? { ...ex, [field]: value } : ex
            ),
          };
        }
        return t;
      })
    );
  };

  const addExercise = (templateId: string) => {
    setEditableTemplates(current =>
      current.map(t => {
        if (t._id === templateId) {
          const newExercise: EditableExerciseTemplate = {
            _id: `ex-${Math.random().toString(36).substr(2, 9)}`,
            name: '',
            muscleGroup: MuscleGroup.Chest,
          };
          return { ...t, exercises: [...t.exercises, newExercise] };
        }
        return t;
      })
    );
  };
  
  const removeExercise = (templateId: string, exerciseId: string) => {
    setEditableTemplates(current =>
      current.map(t => {
        if (t._id === templateId) {
          return { ...t, exercises: t.exercises.filter(ex => ex._id !== exerciseId) };
        }
        return t;
      })
    );
  };

  const addTemplate = () => {
    if (newTemplateName.trim() === '') {
        alert('Nazwa planu nie może być pusta.');
        return;
    }
    const newTemplate: EditableWorkoutTemplate = {
      _id: `t-${Math.random().toString(36).substr(2, 9)}`,
      name: newTemplateName.trim(),
      exercises: [],
    };
    setEditableTemplates(current => [...current, newTemplate]);
    setNewTemplateName('');
  };

  const removeTemplate = (templateId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten plan treningowy?')) {
        setEditableTemplates(current => current.filter(t => t._id !== templateId));
    }
  };

  const saveChanges = () => {
    // Usuń tymczasowe _id przed zapisem
    const cleanedTemplates = editableTemplates.map(t => {
        const { _id, exercises, ...rest } = t;
        return {
            ...rest,
            exercises: exercises.map(({ _id, ...exRest }) => exRest)
        };
    });
    onSave(cleanedTemplates);
    alert('Zmiany zapisane!');
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">Ustawienia Planów Treningowych</h1>

      <div className="space-y-6">
        {editableTemplates.map(template => (
          <div key={template._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <input 
                    type="text"
                    value={template.name}
                    onChange={(e) => handleTemplateNameChange(template._id, e.target.value)}
                    className="flex-grow mr-4 text-xl font-semibold bg-transparent border-b-2 border-gray-600 focus:border-teal-500 outline-none text-white"
                />
                <button onClick={() => removeTemplate(template._id)} className="flex-shrink-0 text-red-500 hover:text-red-400 p-2" aria-label="Usuń plan treningowy">
                    <TrashIcon />
                </button>
            </div>
            
            <div className="space-y-2">
              {template.exercises.map(ex => (
                <div key={ex._id} className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="Nazwa ćwiczenia"
                    value={ex.name}
                    onChange={(e) => handleExerciseChange(template._id, ex._id, 'name', e.target.value)}
                    className="flex-grow bg-gray-700 rounded-md p-2 text-white"
                  />
                  <select
                    value={ex.muscleGroup}
                    onChange={(e) => handleExerciseChange(template._id, ex._id, 'muscleGroup', e.target.value)}
                    className="bg-gray-700 rounded-md p-2 text-white"
                  >
                    {Object.values(MuscleGroup).map(mg => <option key={mg} value={mg}>{mg}</option>)}
                  </select>
                  <button onClick={() => removeExercise(template._id, ex._id)} className="text-red-500 hover:text-red-400 p-2" aria-label="Usuń ćwiczenie">
                    <TrashIcon className="w-5 h-5"/>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addExercise(template._id)} className="mt-4 flex items-center gap-2 text-teal-400 hover:text-teal-300">
              <PlusIcon className="w-5 h-5"/> Dodaj ćwiczenie
            </button>
          </div>
        ))}

        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Dodaj nowy plan</h3>
            <div className="flex gap-2">
                <input 
                    type="text"
                    placeholder="Nazwa nowego planu"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTemplate()}
                    className="flex-grow bg-gray-700 rounded-md p-2 text-white"
                />
                <button onClick={addTemplate} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg">
                    Dodaj
                </button>
            </div>
        </div>

        <button onClick={saveChanges} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          Zapisz wszystkie zmiany
        </button>
      </div>
    </div>
  );
};

export default Settings;