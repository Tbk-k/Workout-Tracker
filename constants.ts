
import { MuscleGroup, WorkoutTemplate } from './types';

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    name: "Push A",
    exercises: [
      { name: "Wyciskanie sztangi leżąc", muscleGroup: MuscleGroup.Chest },
      { name: "Wyciskanie hantli skos góra", muscleGroup: MuscleGroup.Chest },
      { name: "Rozpiętki na maszynie", muscleGroup: MuscleGroup.Chest },
      { name: "Wyciskanie żołnierskie (OHP)", muscleGroup: MuscleGroup.Shoulders },
      { name: "Wznosy boczne hantlami", muscleGroup: MuscleGroup.Shoulders },
      { name: "Pompki na poręczach (dipsy)", muscleGroup: MuscleGroup.Triceps },
    ],
  },
  {
    name: "Pull A",
    exercises: [
      { name: "Podciąganie na drążku", muscleGroup: MuscleGroup.Back },
      { name: "Wiosłowanie sztangą", muscleGroup: MuscleGroup.Back },
      { name: "Ściąganie drążka wyciągu górnego", muscleGroup: MuscleGroup.Back },
      { name: "Face pulls", muscleGroup: MuscleGroup.Shoulders },
      { name: "Uginanie ramion ze sztangą", muscleGroup: MuscleGroup.Biceps },
      { name: "Uginanie ramion z hantlami (młotkowe)", muscleGroup: MuscleGroup.Biceps },
    ],
  },
  {
    name: "Leg A",
    exercises: [
      { name: "Przysiady ze sztangą", muscleGroup: MuscleGroup.Legs },
      { name: "Martwy ciąg rumuński (RDL)", muscleGroup: MuscleGroup.Legs },
      { name: "Wypychanie na suwnicy", muscleGroup: MuscleGroup.Legs },
      { name: "Uginanie nóg na maszynie (leżąc)", muscleGroup: MuscleGroup.Legs },
      { name: "Prostowanie nóg na maszynie", muscleGroup: MuscleGroup.Legs },
      { name: "Wspięcia na palce", muscleGroup: MuscleGroup.Legs },
    ],
  },
    {
    name: "Push B",
    exercises: [
      { name: "Wyciskanie hantli leżąc", muscleGroup: MuscleGroup.Chest },
      { name: "Wyciskanie sztangi skos góra", muscleGroup: MuscleGroup.Chest },
      { name: "Pompki z obciążeniem", muscleGroup: MuscleGroup.Chest },
      { name: "Wyciskanie hantli siedząc", muscleGroup: MuscleGroup.Shoulders },
      { name: "Arnoldki", muscleGroup: MuscleGroup.Shoulders },
      { name: "Francuskie wyciskanie sztangi", muscleGroup: MuscleGroup.Triceps },
    ],
  },
  {
    name: "Pull B",
    exercises: [
      { name: "Wiosłowanie hantlem w opadzie", muscleGroup: MuscleGroup.Back },
      { name: "Martwy ciąg klasyczny", muscleGroup: MuscleGroup.Back },
      { name: "Przyciąganie linki wyciągu dolnego", muscleGroup: MuscleGroup.Back },
      { name: "Odwrotne rozpiętki (Reverse fly)", muscleGroup: MuscleGroup.Shoulders },
      { name: "Uginanie ramion na modlitewniku", muscleGroup: MuscleGroup.Biceps },
      { name: "Uginanie Zottmana", muscleGroup: MuscleGroup.Biceps },
    ],
  },
  {
    name: "Leg B",
    exercises: [
      { name: "Hack przysiady", muscleGroup: MuscleGroup.Legs },
      { name: "Dzień dobry (Good mornings)", muscleGroup: MuscleGroup.Legs },
      { name: "Zakroki z hantlami", muscleGroup: MuscleGroup.Legs },
      { name: "Żuraw (Nordic ham curls)", muscleGroup: MuscleGroup.Legs },
      { name: "Odwodzenie nogi na maszynie", muscleGroup: MuscleGroup.Legs },
      { name: "Wspięcia na palce siedząc", muscleGroup: MuscleGroup.Legs },
    ],
  },
];

export const ALL_EXERCISES = Array.from(new Set(WORKOUT_TEMPLATES.flatMap(wt => wt.exercises.map(ex => ex.name)))).sort();
