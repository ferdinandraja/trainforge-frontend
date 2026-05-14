"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import API from "@/lib/api";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import BackButton from "@/components/BackButton";

interface Client {
  id: number;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  goal: string;
  notes: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    email: "",
    phone: "",
    goal: "",
    notes: "",
  });

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

  const refreshClients = async () => {
    const res = await API.get("clients/");
    setClients(res.data);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      full_name: "",
      age: "",
      email: "",
      phone: "",
      goal: "",
      notes: "",
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

  const saveClient = async () => {
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
      };

      if (editingId) {
        await API.put(`clients/${editingId}/`, payload);
      } else {
        await API.post("clients/", payload);
      }

      await refreshClients();
      resetForm();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Backend error:", error.response?.data);
      }

      alert("Failed to save client");
    }
  };

  const editClient = (client: Client) => {
    setEditingId(client.id);
    setFormData({
      full_name: client.full_name,
      age: String(client.age),
      email: client.email || "",
      phone: client.phone || "",
      goal: client.goal,
      notes: client.notes || "",
    });
  };

  const deleteClient = async (id: number) => {
    if (!confirm("Delete this client?")) return;

    try {
      await API.delete(`clients/${id}/`);
      await refreshClients();
    } catch {
      alert("Failed to delete client");
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
              saveClient();
            }}
            className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
          >
            <h1 className="text-3xl font-bold text-slate-800">
              {editingId ? "Edit Client" : "Create Client"}
            </h1>

            <input
              name="full_name"
              required
              placeholder="Full name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <input
              type="number"
              name="age"
              required
              min={1}
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <textarea
              name="goal"
              required
              placeholder="Client goal"
              rows={3}
              value={formData.goal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
            >
              {editingId ? "Update Client" : "Create Client"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full border border-gray-300 py-4 rounded-2xl font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </form>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Clients
            </h2>

            <div className="space-y-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="border border-gray-200 rounded-2xl p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        {client.full_name}
                      </h3>
                      <p className="text-gray-500">Age: {client.age}</p>
                      <p className="text-gray-700 mt-2">{client.goal}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => editClient(client)}
                        className="text-blue-600"
                      >
                        <Pencil />
                      </button>

                      <button
                        onClick={() => deleteClient(client.id)}
                        className="text-red-500"
                      >
                        <Trash2 />
                      </button>
                      <Link
  href={`/clients/${client.id}`}
  className="text-blue-600 font-semibold"
>
  View Progress
</Link>
                    </div>
                  </div>
                </div>
              ))}

              {clients.length === 0 && (
                <div className="text-center text-gray-500 p-8">
                  No clients yet.
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