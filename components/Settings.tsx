
import React, { useState } from 'react';
import { WorkoutTemplate, ExerciseTemplate, MuscleGroup } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface SettingsProps {
  templates: WorkoutTemplate[];
  onSave: (templates: WorkoutTemplate[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ templates, onSave }) => {
  const [editableTemplates, setEditableTemplates] = useState<WorkoutTemplate[]>(JSON.parse(JSON.stringify(templates)));
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleTemplateNameChange = (index: number, newName: string) => {
    const updated = [...editableTemplates];
    updated[index].name = newName;
    setEditableTemplates(updated);
  };

  const handleExerciseChange = (templateIndex: number, exerciseIndex: number, field: 'name' | 'muscleGroup', value: string) => {
    const updated = [...editableTemplates];
    (updated[templateIndex].exercises[exerciseIndex] as any)[field] = value;
    setEditableTemplates(updated);
  };

  const addExercise = (templateIndex: number) => {
    const updated = [...editableTemplates];
    updated[templateIndex].exercises.push({ name: '', muscleGroup: MuscleGroup.Chest });
    setEditableTemplates(updated);
  };
  
  const removeExercise = (templateIndex: number, exerciseIndex: number) => {
    const updated = [...editableTemplates];
    updated[templateIndex].exercises.splice(exerciseIndex, 1);
    setEditableTemplates(updated);
  };

  const addTemplate = () => {
    if (newTemplateName.trim() === '') {
        alert('Nazwa planu nie może być pusta.');
        return;
    }
    setEditableTemplates([...editableTemplates, { name: newTemplateName, exercises: [] }]);
    setNewTemplateName('');
  };

  const removeTemplate = (templateIndex: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten plan treningowy?')) {
        const updated = [...editableTemplates];
        updated.splice(templateIndex, 1);
        setEditableTemplates(updated);
    }
  };

  const saveChanges = () => {
    onSave(editableTemplates);
    alert('Zmiany zapisane!');
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">Ustawienia Planów Treningowych</h1>

      <div className="space-y-6">
        {editableTemplates.map((template, tIndex) => (
          <div key={tIndex} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <input 
                    type="text"
                    value={template.name}
                    onChange={(e) => handleTemplateNameChange(tIndex, e.target.value)}
                    className="text-xl font-semibold bg-transparent border-b-2 border-gray-600 focus:border-cyan-500 outline-none text-white"
                />
                <button onClick={() => removeTemplate(tIndex)} className="text-red-500 hover:text-red-400">
                    <TrashIcon />
                </button>
            </div>
            
            <div className="space-y-2">
              {template.exercises.map((ex, eIndex) => (
                <div key={eIndex} className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="Nazwa ćwiczenia"
                    value={ex.name}
                    onChange={(e) => handleExerciseChange(tIndex, eIndex, 'name', e.target.value)}
                    className="flex-grow bg-gray-700 rounded-md p-2"
                  />
                  <select
                    value={ex.muscleGroup}
                    onChange={(e) => handleExerciseChange(tIndex, eIndex, 'muscleGroup', e.target.value)}
                    className="bg-gray-700 rounded-md p-2"
                  >
                    {Object.values(MuscleGroup).map(mg => <option key={mg} value={mg}>{mg}</option>)}
                  </select>
                  <button onClick={() => removeExercise(tIndex, eIndex)} className="text-red-500 hover:text-red-400 p-2">
                    <TrashIcon className="w-5 h-5"/>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addExercise(tIndex)} className="mt-4 flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
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
                    className="flex-grow bg-gray-700 rounded-md p-2"
                />
                <button onClick={addTemplate} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
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
