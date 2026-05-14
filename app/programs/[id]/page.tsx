"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import API from "@/lib/api";
import BackButton from "@/components/BackButton";

interface Program {
  id: number;
  title: string;
  description: string;
  client_name: string;
  client_age: number;
  client_goal: string;
  preferred_appointment_times: string;
  start_date: string;
}

interface Workout {
  id: number;
  name: string;
  day: string;
  notes: string;
}

interface WorkoutExercise {
  id: number;
  exercise_name: string;
  exercise_description: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  notes: string;
  workout: number;
}

export default function ProgramDetailPage() {
  const params = useParams();
  const id = params.id;

  const [program, setProgram] = useState<Program | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const programRes = await API.get(`programs/${id}/`);
        setProgram(programRes.data);

        const workoutsRes = await API.get(`workouts/?program=${id}`);
        setWorkouts(workoutsRes.data);

        const workoutExerciseRes = await API.get("workout-exercises/");
        setWorkoutExercises(workoutExerciseRes.data);
      } catch {
        alert("Failed to load program");
      }
    };

    loadData();
  }, [id]);

  if (!program) return <div className="p-10">Loading...</div>;

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
        <div className="mb-6">
  <BackButton />
</div>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-slate-800">
              {program.title}
            </h1>

            <p className="text-gray-600 mt-4">{program.description}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Client Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">Client Name</p>
                <p className="text-xl font-bold text-slate-800">
                  {program.client_name}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">Client Age</p>
                <p className="text-xl font-bold text-slate-800">
                  {program.client_age}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="text-xl font-bold text-slate-800">
                  {program.start_date}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">
                  Preferred Appointment Times
                </p>
                <p className="text-xl font-bold text-slate-800">
                  {program.preferred_appointment_times}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 rounded-2xl p-5">
              <p className="text-sm text-blue-700 font-semibold">
                Client Goal
              </p>
              <p className="text-slate-800 mt-2">{program.client_goal}</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Workouts
            </h2>

            <div className="space-y-6">
              {workouts.map((workout) => {
                const exercises = workoutExercises.filter(
                  (item) => item.workout === workout.id
                );

                return (
                  <div
                    key={workout.id}
                    className="bg-white rounded-3xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {workout.name}
                        </h3>
                        <p className="text-gray-500">{workout.day}</p>
                      </div>
                    </div>

                    {workout.notes && (
                      <p className="bg-gray-50 rounded-2xl p-4 mb-6 text-gray-700">
                        {workout.notes}
                      </p>
                    )}

                    <div className="space-y-4">
                      {exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="bg-gray-50 rounded-2xl p-5"
                        >
                          <h4 className="text-xl font-bold text-slate-800">
                            {exercise.exercise_name}
                          </h4>

                          <p className="text-gray-600 mt-2">
                            {exercise.exercise_description}
                          </p>

                          <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-white rounded-xl p-4">
                              <p className="text-sm text-gray-500">Sets</p>
                              <p className="text-xl font-bold">{exercise.sets}</p>
                            </div>

                            <div className="bg-white rounded-xl p-4">
                              <p className="text-sm text-gray-500">Reps</p>
                              <p className="text-xl font-bold">{exercise.reps}</p>
                            </div>

                            <div className="bg-white rounded-xl p-4">
                              <p className="text-sm text-gray-500">Rest</p>
                              <p className="text-xl font-bold">
                                {exercise.rest_seconds}s
                              </p>
                            </div>
                          </div>

                          {exercise.notes && (
                            <p className="mt-4 text-gray-700">
                              Notes: {exercise.notes}
                            </p>
                          )}
                        </div>
                      ))}

                      {exercises.length === 0 && (
                        <p className="text-gray-500">No exercises added.</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {workouts.length === 0 && (
                <div className="bg-white rounded-3xl shadow-md p-8 text-gray-500 text-center">
                  No workouts added.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}