"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/sidebar";
import API from "@/lib/api";
import axios from "axios";
import { Archive, Pencil } from "lucide-react";
import AdminRoute from "@/components/AdminRoute";

interface Trainer {
  id: number;
  username: string;
  email: string;
}

interface Subscription {
  id: number;
  trainer: number;
  trainer_username: string;
  plan_name: string;
  status: string;
  monthly_price: string;
  start_date: string;
  end_date: string | null;
  is_archived: boolean;
  created_at: string;
}

export default function SubscriptionAdminPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    trainer: "",
    plan_name: "starter",
    status: "active",
    monthly_price: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const res = await API.get("subscriptions/");
        setSubscriptions(res.data);
      } catch {
        alert("Failed to load subscriptions");
      }
    };

    loadSubscriptions();
  }, []);

  const refreshSubscriptions = async () => {
    const res = await API.get("subscriptions/");
    setSubscriptions(res.data);
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      trainer: "",
      plan_name: "starter",
      status: "active",
      monthly_price: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveSubscription = async () => {
    try {
      const payload = {
        trainer: Number(formData.trainer),
        plan_name: formData.plan_name,
        status: formData.status,
        monthly_price: formData.monthly_price,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
      };

      if (editingId) {
        await API.put(`subscriptions/${editingId}/`, payload);
      } else {
        await API.post("subscriptions/", payload);
      }

      await refreshSubscriptions();
      resetForm();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Backend error:", error.response?.data);
      }

      alert("Failed to save subscription");
    }
  };

  const editSubscription = (subscription: Subscription) => {
    setEditingId(subscription.id);

    setFormData({
      trainer: String(subscription.trainer),
      plan_name: subscription.plan_name,
      status: subscription.status,
      monthly_price: subscription.monthly_price,
      start_date: subscription.start_date,
      end_date: subscription.end_date || "",
    });
  };

  const archiveSubscription = async (id: number) => {
    if (!confirm("Archive this subscription?")) return;

    try {
      await API.patch(`subscriptions/${id}/archive/`);
      await refreshSubscriptions();
    } catch {
      alert("Failed to archive subscription");
    }
  };

  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);

  const paginatedSubscriptions = subscriptions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-4xl font-bold text-slate-800">
                SaaS Subscription Admin
              </h1>

              <p className="text-gray-500 mt-2">
                Create, list, edit, and archive subscriptions. Deleting is not allowed.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSubscription();
                }}
                className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
              >
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingId ? "Edit Subscription" : "Create Subscription"}
                </h2>

                <div>
                  <label className="block mb-2 font-semibold">
                    Trainer User ID
                  </label>

                  <input
                    type="number"
                    name="trainer"
                    required
                    placeholder="e.g. 1"
                    value={formData.trainer}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Plan
                  </label>

                  <select
                    name="plan_name"
                    required
                    value={formData.plan_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  >
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Status
                  </label>

                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Monthly Price
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="monthly_price"
                    required
                    placeholder="29.99"
                    value={formData.monthly_price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
                >
                  {editingId ? "Update Subscription" : "Create Subscription"}
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
                  Subscription List
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-sm text-gray-500">
                        <th className="py-3 pr-4">Trainer</th>
                        <th className="py-3 pr-4">Plan</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-4">Price</th>
                        <th className="py-3 pr-4">Start</th>
                        <th className="py-3 pr-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedSubscriptions.map((subscription) => (
                        <tr
                          key={subscription.id}
                          className="border-b text-sm"
                        >
                          <td className="py-4 pr-4 font-semibold">
                            {subscription.trainer_username}
                          </td>

                          <td className="py-4 pr-4 capitalize">
                            {subscription.plan_name}
                          </td>

                          <td className="py-4 pr-4">
                            <span
                              className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                                subscription.is_archived
                                  ? "bg-gray-200 text-gray-600"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {subscription.status}
                            </span>
                          </td>

                          <td className="py-4 pr-4">
                            ${subscription.monthly_price}
                          </td>

                          <td className="py-4 pr-4">
                            {subscription.start_date}
                          </td>

                          <td className="py-4 pr-4">
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  editSubscription(subscription)
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Pencil size={18} />
                              </button>

                              {!subscription.is_archived && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    archiveSubscription(subscription.id)
                                  }
                                  className="text-orange-600 hover:text-orange-800"
                                >
                                  <Archive size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {subscriptions.length === 0 && (
                    <div className="text-center text-gray-500 p-8">
                      No subscriptions yet.
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-5 py-3 rounded-2xl border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <p className="text-sm text-gray-500">
                    Page {page} of {totalPages || 1}
                  </p>

                  <button
                    type="button"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className="px-5 py-3 rounded-2xl border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}