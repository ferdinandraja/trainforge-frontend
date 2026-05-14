"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import API from "@/lib/api";
import axios from "axios";
import { ChevronDown, ChevronRight } from "lucide-react";
import BackButton from "@/components/BackButton";

interface Client {
  id: number;
  full_name: string;
}

interface Program {
  id: number;
  title: string;
  client: number;
}

interface Exercise {
  id: number;
  name: string;
}

interface ExerciseProgress {
  id: number;
  client_name: string;
  program_title: string;
  exercise_name: string;
  weight_used_kg: number | null;
  sets_completed: number;
  reps_completed: number;
  notes: string;
  recorded_at: string;
}

export default function ExerciseProgressPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [records, setRecords] = useState<ExerciseProgress[]>([]);

  const [openClients, setOpenClients] = useState<Record<string, boolean>>({});
  const [openExercises, setOpenExercises] = useState<Record<string, boolean>>(
    {}
  );

  const [formData, setFormData] = useState({
    client: "",
    program: "",
    exercise: "",
    weight_used_kg: "",
    sets_completed: "",
    reps_completed: "",
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsRes = await API.get("clients/");
        setClients(clientsRes.data);

        const programsRes = await API.get("programs/");
        setPrograms(programsRes.data);

        const exercisesRes = await API.get("exercises/");
        setExercises(exercisesRes.data);

        const progressRes = await API.get("exercise-progress/");
        setRecords(progressRes.data);
      } catch {
        alert("Failed to load exercise progress data");
      }
    };

    loadData();
  }, []);

  const refreshRecords = async () => {
    const res = await API.get("exercise-progress/");
    setRecords(res.data);
  };

  const toggleClient = (clientName: string) => {
    setOpenClients((prev) => ({
      ...prev,
      [clientName]: !prev[clientName],
    }));
  };

  const toggleExercise = (clientName: string, exerciseName: string) => {
    const key = `${clientName}-${exerciseName}`;

    setOpenExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createRecord = async () => {
    try {
      await API.post("exercise-progress/", {
        client: Number(formData.client),
        program: Number(formData.program),
        exercise: Number(formData.exercise),
        weight_used_kg: formData.weight_used_kg
          ? Number(formData.weight_used_kg)
          : null,
        sets_completed: Number(formData.sets_completed),
        reps_completed: Number(formData.reps_completed),
        notes: formData.notes,
      });

      setFormData({
        client: "",
        program: "",
        exercise: "",
        weight_used_kg: "",
        sets_completed: "",
        reps_completed: "",
        notes: "",
      });

      await refreshRecords();
      alert("Exercise progress recorded");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Backend error:", error.response?.data);
      }

      alert("Failed to record exercise progress");
    }
  };

  const filteredPrograms = programs.filter(
    (program) => String(program.client) === formData.client
  );

  const groupedByClient = records.reduce((clientsGroup, record) => {
    if (!clientsGroup[record.client_name]) {
      clientsGroup[record.client_name] = {};
    }

    if (!clientsGroup[record.client_name][record.exercise_name]) {
      clientsGroup[record.client_name][record.exercise_name] = [];
    }

    clientsGroup[record.client_name][record.exercise_name].push(record);

    return clientsGroup;
  }, {} as Record<string, Record<string, ExerciseProgress[]>>);

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
        <div className="mb-6">
  <BackButton />
</div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createRecord();
            }}
            className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
          >
            <h1 className="text-3xl font-bold text-slate-800">
              Exercise Progress
            </h1>

            <select
              name="client"
              required
              value={formData.client}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>

            <select
              name="program"
              required
              value={formData.program}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            >
              <option value="">Select Program</option>
              {filteredPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>

            <select
              name="exercise"
              required
              value={formData.exercise}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            >
              <option value="">Select Exercise</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.1"
              name="weight_used_kg"
              placeholder="Weight Used (kg)"
              value={formData.weight_used_kg}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <input
              type="number"
              name="sets_completed"
              required
              min={1}
              placeholder="Sets Completed"
              value={formData.sets_completed}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <input
              type="number"
              name="reps_completed"
              required
              min={1}
              placeholder="Reps Completed"
              value={formData.reps_completed}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <textarea
              name="notes"
              rows={4}
              placeholder="Progress notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
            >
              Save Progress
            </button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Exercise Progress History
            </h2>

            <div className="space-y-5">
              {Object.entries(groupedByClient).map(
                ([clientName, exercisesGroup]) => {
                  const isClientOpen = openClients[clientName] ?? false;

                  return (
                    <div
                      key={clientName}
                      className="border border-gray-200 rounded-3xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleClient(clientName)}
                        className="w-full flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-6"
                      >
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800 text-left">
                            {clientName}
                          </h3>
                          <p className="text-sm text-gray-500 text-left">
                            {Object.keys(exercisesGroup).length} exercises
                            tracked
                          </p>
                        </div>

                        {isClientOpen ? <ChevronDown /> : <ChevronRight />}
                      </button>

                      {isClientOpen && (
                        <div className="p-6 space-y-5">
                          {Object.entries(exercisesGroup).map(
                            ([exerciseName, progressRecords]) => {
                              const key = `${clientName}-${exerciseName}`;
                              const isExerciseOpen =
                                openExercises[key] ?? false;

                              return (
                                <div
                                  key={exerciseName}
                                  className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleExercise(clientName, exerciseName)
                                    }
                                    className="w-full flex justify-between items-center p-5 hover:bg-gray-100"
                                  >
                                    <div>
                                      <h4 className="text-xl font-bold text-slate-800 text-left">
                                        {exerciseName}
                                      </h4>
                                      <p className="text-sm text-gray-500 text-left">
                                        {progressRecords.length} progress
                                        records
                                      </p>
                                    </div>

                                    {isExerciseOpen ? (
                                      <ChevronDown />
                                    ) : (
                                      <ChevronRight />
                                    )}
                                  </button>

                                  {isExerciseOpen && (
                                    <div className="p-5 space-y-4">
                                      {progressRecords.map((record) => (
                                        <div
                                          key={record.id}
                                          className="bg-white rounded-2xl border border-gray-200 p-5"
                                        >
                                          <p className="text-sm text-gray-500 mb-2">
                                            {new Date(
                                              record.recorded_at
                                            ).toLocaleDateString()}
                                          </p>

                                          <p className="text-gray-500 mb-4">
                                            {record.program_title}
                                          </p>

                                          <div className="grid md:grid-cols-3 gap-4">
                                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                              <p className="text-sm text-blue-700">
                                                Weight
                                              </p>
                                              <p className="font-bold">
                                                {record.weight_used_kg ?? "-"}{" "}
                                                kg
                                              </p>
                                            </div>

                                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                              <p className="text-sm text-green-700">
                                                Sets
                                              </p>
                                              <p className="font-bold">
                                                {record.sets_completed}
                                              </p>
                                            </div>

                                            <div className="bg-purple-50 rounded-xl p-4 text-center">
                                              <p className="text-sm text-purple-700">
                                                Reps
                                              </p>
                                              <p className="font-bold">
                                                {record.reps_completed}
                                              </p>
                                            </div>
                                          </div>

                                          {record.notes && (
                                            <p className="text-gray-700 mt-4">
                                              {record.notes}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}

              {records.length === 0 && (
                <p className="text-center text-gray-500">
                  No exercise progress records yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}