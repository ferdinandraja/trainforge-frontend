"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import API from "@/lib/api";
import axios from "axios";
import BackButton from "@/components/BackButton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Plus } from "lucide-react";

interface Client {
  id: number;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  goal: string;
  notes: string;
}

interface ProgressRecord {
  id: number;
  client: number;
  client_name: string;
  weight_kg: number;
  body_fat_percentage: number | null;
  muscle_mass_kg: number | null;
  progress_notes: string;
  recorded_at: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id;

  const [client, setClient] = useState<Client | null>(null);
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    weight_kg: "",
    body_fat_percentage: "",
    muscle_mass_kg: "",
    progress_notes: "",
  });

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const clientRes = await API.get(`clients/${id}/`);
        setClient(clientRes.data);

        const progressRes = await API.get(`progress/?client=${id}`);
        setRecords(progressRes.data);
      } catch {
        alert("Failed to load client progress");
      }
    };

    loadData();
  }, [id]);

  const refreshProgress = async () => {
    const progressRes = await API.get(`progress/?client=${id}`);
    setRecords(progressRes.data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createProgress = async () => {
    try {
      setLoading(true);

      await API.post("progress/", {
        client: Number(id),
        weight_kg: Number(formData.weight_kg),
        body_fat_percentage: formData.body_fat_percentage
          ? Number(formData.body_fat_percentage)
          : null,
        muscle_mass_kg: formData.muscle_mass_kg
          ? Number(formData.muscle_mass_kg)
          : null,
        progress_notes: formData.progress_notes,
      });

      setFormData({
        weight_kg: "",
        body_fat_percentage: "",
        muscle_mass_kg: "",
        progress_notes: "",
      });

      await refreshProgress();
      alert("Progress added");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Backend error:", error.response?.data);
      }

      alert("Failed to add progress");
    } finally {
      setLoading(false);
    }
  };

  const chartData = [...records]
    .reverse()
    .map((record) => ({
      date: new Date(record.recorded_at).toLocaleDateString(),
      weight: record.weight_kg,
      bodyFat: record.body_fat_percentage,
      muscleMass: record.muscle_mass_kg,
    }));

  if (!client) {
    return (
      <ProtectedRoute>
        <div className="p-10">Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-6">
  <BackButton />
</div>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-4xl font-bold text-slate-800">
                {client.full_name}
              </h1>

              <p className="text-gray-500 mt-2">
                Age {client.age} • {client.email || "No email"} •{" "}
                {client.phone || "No phone"}
              </p>

              <div className="bg-blue-50 rounded-2xl p-5 mt-6">
                <p className="text-sm text-blue-700 font-semibold">
                  Client Goal
                </p>
                <p className="text-slate-700 mt-1">{client.goal}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createProgress();
                }}
                className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
              >
                <h2 className="text-2xl font-bold text-slate-800">
                  Add Body Progress
                </h2>

                <div>
                  <label className="block mb-2 font-semibold">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    name="weight_kg"
                    required
                    value={formData.weight_kg}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Body Fat %
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    name="body_fat_percentage"
                    value={formData.body_fat_percentage}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Muscle Mass (kg)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    name="muscle_mass_kg"
                    value={formData.muscle_mass_kg}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Notes
                  </label>

                  <textarea
                    name="progress_notes"
                    rows={4}
                    value={formData.progress_notes}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus size={18} />
                  {loading ? "Saving..." : "Add Progress"}
                </button>
              </form>

              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    Weight Progress
                  </h2>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#2563eb"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    Progress History
                  </h2>

                  <div className="space-y-4">
                    {records.map((record) => (
                      <div
                        key={record.id}
                        className="border border-gray-200 rounded-2xl p-5"
                      >
                        <p className="text-sm text-gray-500">
                          {new Date(record.recorded_at).toLocaleDateString()}
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-blue-700">Weight</p>
                            <p className="font-bold">
                              {record.weight_kg}kg
                            </p>
                          </div>

                          <div className="bg-green-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-green-700">
                              Body Fat
                            </p>
                            <p className="font-bold">
                              {record.body_fat_percentage ?? "-"}%
                            </p>
                          </div>

                          <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <p className="text-sm text-purple-700">
                              Muscle
                            </p>
                            <p className="font-bold">
                              {record.muscle_mass_kg ?? "-"}kg
                            </p>
                          </div>
                        </div>

                        {record.progress_notes && (
                          <p className="text-gray-700 mt-4">
                            {record.progress_notes}
                          </p>
                        )}
                      </div>
                    ))}

                    {records.length === 0 && (
                      <p className="text-center text-gray-500 p-8">
                        No progress records yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}