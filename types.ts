
export enum MuscleGroup {
  Chest = "Klatka piersiowa",
  Back = "Plecy",
  Legs = "Nogi",
  Shoulders = "Barki",
  Biceps = "Biceps",
  Triceps = "Triceps",
  Core = "Brzuch",
}

export interface ExerciseTemplate {
  name: string;
  muscleGroup: MuscleGroup;
}

export interface WorkoutTemplate {
  name: string;
  exercises: ExerciseTemplate[];
}

export interface Set {
  id: string;
  weight: number;
  reps: number;
}

export interface LoggedExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: Set[];
  volume: number;
}

export interface Workout {
  id: string;
  date: string;
  workoutType: string;
  duration: number; // in minutes
  volume: number;
  exercises: LoggedExercise[];
}

export type Page = "Nowy Trening" | "Statystyki" | "Historia" | "Progresja" | "Ustawienia";
