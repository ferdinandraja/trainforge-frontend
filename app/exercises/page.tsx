"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import API from "@/lib/api";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import BackButton from "@/components/BackButton";

interface Exercise {
  id: number;
  name: string;
  description: string;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const res = await API.get("exercises/");
        setExercises(res.data);
      } catch {
        alert("Failed to load exercises");
      }
    };

    loadExercises();
  }, []);

  const refreshExercises = async () => {
    const res = await API.get("exercises/");
    setExercises(res.data);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveExercise = async () => {
    try {
      setLoading(true);

      if (editingId) {
        await API.put(`exercises/${editingId}/`, formData);
      } else {
        await API.post("exercises/", formData);
      }

      await refreshExercises();
      resetForm();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Backend error:", error.response?.data);
      }

      alert("Failed to save exercise");
    } finally {
      setLoading(false);
    }
  };

  const editExercise = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setFormData({
      name: exercise.name,
      description: exercise.description,
    });
  };

  const deleteExercise = async (id: number) => {
    if (!confirm("Delete this exercise?")) return;

    try {
      await API.delete(`exercises/${id}/`);
      await refreshExercises();

      if (editingId === id) {
        resetForm();
      }
    } catch {
      alert("Failed to delete exercise");
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
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveExercise();
            }}
            className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
          >
            <h1 className="text-3xl font-bold text-slate-800">
              {editingId ? "Edit Exercise" : "Create Exercise"}
            </h1>

            <div>
              <label className="block mb-2 font-semibold">
                Exercise Name
              </label>

              <input
                name="name"
                required
                placeholder="e.g. Bench Press"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl p-4"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Description
              </label>

              <textarea
                name="description"
                required
                rows={5}
                placeholder="Explain how to perform this exercise..."
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl p-4"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Exercise"
                : "Create Exercise"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </form>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Exercise List
            </h2>

            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 rounded-2xl p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {exercise.name}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        {exercise.description}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => editExercise(exercise)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteExercise(exercise.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {exercises.length === 0 && (
                <div className="text-center text-gray-500 p-8">
                  No exercises yet.
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