"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import BackButton from "@/components/BackButton";

interface Client {
  id: number;
  full_name: string;
  age: number;
  goal: string;
}

interface ExerciseForm {
  name: string;
  description: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  notes: string;
}

interface WorkoutForm {
  name: string;
  day: string;
  notes: string;
  exercises: ExerciseForm[];
}

export default function CreateProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState("");

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [programData, setProgramData] = useState({
    client: "",
    title: "",
    description: "",
    start_date: "",
  });

  const [workouts, setWorkouts] = useState<WorkoutForm[]>([
    {
      name: "",
      day: "",
      notes: "",
      exercises: [
        {
          name: "",
          description: "",
          sets: 3,
          reps: 10,
          rest_seconds: 60,
          notes: "",
        },
      ],
    },
  ]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await API.get("clients/");
        setClients(res.data);
      } catch {
        alert("Failed to load clients");
      }
    };

    loadClients();
  }, []);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleProgramChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setProgramData({
      ...programData,
      [e.target.name]: e.target.value,
    });
  };

  const handleWorkoutChange = (
    workoutIndex: number,
    field: keyof WorkoutForm,
    value: string
  ) => {
    const updated = [...workouts];

    updated[workoutIndex] = {
      ...updated[workoutIndex],
      [field]: value,
    };

    setWorkouts(updated);
  };

  const handleExerciseChange = (
    workoutIndex: number,
    exerciseIndex: number,
    field: keyof ExerciseForm,
    value: string | number
  ) => {
    const updated = [...workouts];

    updated[workoutIndex].exercises[exerciseIndex] = {
      ...updated[workoutIndex].exercises[exerciseIndex],
      [field]: value,
    };

    setWorkouts(updated);
  };

  const addWorkout = () => {
    setWorkouts([
      ...workouts,
      {
        name: "",
        day: "",
        notes: "",
        exercises: [
          {
            name: "",
            description: "",
            sets: 3,
            reps: 10,
            rest_seconds: 60,
            notes: "",
          },
        ],
      },
    ]);
  };

  const removeWorkout = (index: number) => {
    if (workouts.length === 1) {
      alert("At least one workout is required.");
      return;
    }

    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const addExercise = (workoutIndex: number) => {
    const updated = [...workouts];

    updated[workoutIndex].exercises.push({
      name: "",
      description: "",
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      notes: "",
    });

    setWorkouts(updated);
  };

  const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
    const updated = [...workouts];

    if (updated[workoutIndex].exercises.length === 1) {
      alert("At least one exercise is required.");
      return;
    }

    updated[workoutIndex].exercises = updated[
      workoutIndex
    ].exercises.filter((_, i) => i !== exerciseIndex);

    setWorkouts(updated);
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      alert("Please select at least one preferred appointment day.");
      return;
    }

    if (!preferredTime) {
      alert("Please select a preferred appointment time.");
      return;
    }

    try {
      setLoading(true);

      const programRes = await API.post("programs/", {
        client: Number(programData.client),
        title: programData.title,
        description: programData.description,
        start_date: programData.start_date,
        preferred_appointment_times: `${selectedDays.join(
          ", "
        )} at ${preferredTime}`,
      });

      const programId = programRes.data.id;

      for (const workout of workouts) {
        const workoutRes = await API.post("workouts/", {
          program: programId,
          name: workout.name,
          day: workout.day,
          notes: workout.notes,
        });

        const workoutId = workoutRes.data.id;

        for (const exercise of workout.exercises) {
          const exerciseRes = await API.post("exercises/", {
            name: exercise.name,
            description: exercise.description,
          });

          const exerciseId = exerciseRes.data.id;

          await API.post("workout-exercises/", {
            workout: workoutId,
            exercise: exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            rest_seconds: exercise.rest_seconds,
            notes: exercise.notes,
          });
        }
      }

      alert("Program created successfully");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Backend error:", error.response?.data);
      }

      alert("Failed to create program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
        <div className="mb-6">
  <BackButton />
</div>
        <div className="max-w-6xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Create Training Program
            </h1>

            <p className="text-gray-500 mb-10">
              Create a personalized training plan for an existing client.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block mb-2 font-semibold">
                  Select Client
                </label>

                <select
                  name="client"
                  required
                  value={programData.client}
                  onChange={handleProgramChange}
                  className="w-full border border-gray-300 rounded-2xl p-4"
                >
                  <option value="">Choose a client</option>

                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Program Title
                </label>

                <input
                  type="text"
                  name="title"
                  required
                  value={programData.title}
                  onChange={handleProgramChange}
                  className="w-full border border-gray-300 rounded-2xl p-4"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Start Date</label>

                <input
                  type="date"
                  name="start_date"
                  required
                  value={programData.start_date}
                  onChange={handleProgramChange}
                  className="w-full border border-gray-300 rounded-2xl p-4"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block mb-3 font-semibold">
                Preferred Appointment Days
              </label>

              <div className="flex flex-wrap gap-3">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-5 py-3 rounded-2xl border transition ${
                      selectedDays.includes(day)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block mb-2 font-semibold">
                Preferred Appointment Time
              </label>

              <input
                type="time"
                required
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl p-4"
              />
            </div>

            <div className="mb-10">
              <label className="block mb-2 font-semibold">
                Program Description
              </label>

              <textarea
                name="description"
                required
                rows={5}
                value={programData.description}
                onChange={handleProgramChange}
                className="w-full border border-gray-300 rounded-2xl p-4"
              />
            </div>

            <div className="space-y-10">
              {workouts.map((workout, workoutIndex) => (
                <div
                  key={workoutIndex}
                  className="border border-gray-200 rounded-3xl p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Workout {workoutIndex + 1}
                    </h2>

                    <button
                      type="button"
                      onClick={() => removeWorkout(workoutIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block mb-2 font-semibold text-sm text-gray-700">
                        Workout Name
                      </label>

                      <input
                        type="text"
                        required
                        placeholder="e.g. Upper Body Strength"
                        value={workout.name}
                        onChange={(e) =>
                          handleWorkoutChange(
                            workoutIndex,
                            "name",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-2xl p-4 w-full"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold text-sm text-gray-700">
                        Workout Day
                      </label>

                      <input
                        type="text"
                        required
                        placeholder="e.g. Monday"
                        value={workout.day}
                        onChange={(e) =>
                          handleWorkoutChange(
                            workoutIndex,
                            "day",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-2xl p-4 w-full"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 font-semibold text-sm text-gray-700">
                      Workout Notes
                    </label>

                    <textarea
                      placeholder="Optional workout notes..."
                      value={workout.notes}
                      onChange={(e) =>
                        handleWorkoutChange(
                          workoutIndex,
                          "notes",
                          e.target.value
                        )
                      }
                      rows={3}
                      className="w-full border border-gray-300 rounded-2xl p-4"
                    />
                  </div>

                  <div className="space-y-6">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={exerciseIndex}
                        className="bg-white rounded-2xl p-6 border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-lg">
                            Exercise {exerciseIndex + 1}
                          </h3>

                          <button
                            type="button"
                            onClick={() =>
                              removeExercise(workoutIndex, exerciseIndex)
                            }
                            className="text-red-500"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block mb-2 font-semibold text-sm text-gray-700">
                              Exercise Name
                            </label>

                            <input
                              type="text"
                              required
                              placeholder="e.g. Bench Press"
                              value={exercise.name}
                              onChange={(e) =>
                                handleExerciseChange(
                                  workoutIndex,
                                  exerciseIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded-2xl p-4 w-full"
                            />
                          </div>

                          <div>
                            <label className="block mb-2 font-semibold text-sm text-gray-700">
                              Total Sets
                            </label>

                            <input
                              type="number"
                              required
                              min={1}
                              placeholder="e.g. 4"
                              value={exercise.sets}
                              onChange={(e) =>
                                handleExerciseChange(
                                  workoutIndex,
                                  exerciseIndex,
                                  "sets",
                                  Number(e.target.value)
                                )
                              }
                              className="border border-gray-300 rounded-2xl p-4 w-full"
                            />
                          </div>

                          <div>
                            <label className="block mb-2 font-semibold text-sm text-gray-700">
                              Repetitions (Reps)
                            </label>

                            <input
                              type="number"
                              required
                              min={1}
                              placeholder="e.g. 12"
                              value={exercise.reps}
                              onChange={(e) =>
                                handleExerciseChange(
                                  workoutIndex,
                                  exerciseIndex,
                                  "reps",
                                  Number(e.target.value)
                                )
                              }
                              className="border border-gray-300 rounded-2xl p-4 w-full"
                            />
                          </div>

                          <div>
                            <label className="block mb-2 font-semibold text-sm text-gray-700">
                              Rest Time (Seconds)
                            </label>

                            <input
                              type="number"
                              required
                              min={0}
                              placeholder="e.g. 60"
                              value={exercise.rest_seconds}
                              onChange={(e) =>
                                handleExerciseChange(
                                  workoutIndex,
                                  exerciseIndex,
                                  "rest_seconds",
                                  Number(e.target.value)
                                )
                              }
                              className="border border-gray-300 rounded-2xl p-4 w-full"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-2 font-semibold text-sm text-gray-700">
                            Exercise Description
                          </label>

                          <textarea
                            required
                            placeholder="Describe how to perform this exercise correctly..."
                            rows={3}
                            value={exercise.description}
                            onChange={(e) =>
                              handleExerciseChange(
                                workoutIndex,
                                exerciseIndex,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-2xl p-4 mb-4"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 font-semibold text-sm text-gray-700">
                            Exercise Notes (Optional)
                          </label>

                          <textarea
                            placeholder="Additional trainer notes..."
                            rows={2}
                            value={exercise.notes}
                            onChange={(e) =>
                              handleExerciseChange(
                                workoutIndex,
                                exerciseIndex,
                                "notes",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-2xl p-4"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addExercise(workoutIndex)}
                    className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Exercise
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addWorkout}
              className="mt-8 bg-slate-700 hover:bg-slate-800 text-white px-6 py-4 rounded-2xl flex items-center gap-2"
            >
              <Plus size={18} />
              Add Workout
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl text-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Creating Program..." : "Create Training Program"}
            </button>
          </form>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}