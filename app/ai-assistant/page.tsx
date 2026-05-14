"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import API from "@/lib/api";

export default function AIAssistantPage() {
  const [formData, setFormData] = useState({
    goal: "",
    experience: "",
    limitations: "",
    focus: "",
  });

  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePlan = async () => {
    try {
      setLoading(true);

      const res = await API.post("ai/training-plan/", formData);
      setSuggestion(res.data.suggestion);
    } catch {
      alert("Failed to generate AI suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                generatePlan();
              }}
              className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
            >
              <h1 className="text-3xl font-bold text-slate-800">
                AI Training Plan Assistant
              </h1>

              <p className="text-gray-500">
                Generate a draft plan suggestion. Trainer review is required.
              </p>

              <textarea
                name="goal"
                required
                placeholder="Client goal, e.g. build strength, lose weight, improve endurance"
                rows={4}
                value={formData.goal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl p-4"
              />

              <input
                name="experience"
                placeholder="Experience level, e.g. beginner, intermediate"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl p-4"
              />

              <textarea
                name="limitations"
                placeholder="Limitations or injuries, e.g. knee pain, no barbell access"
                rows={3}
                value={formData.limitations}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl p-4"
              />

              <input
                name="focus"
                placeholder="Training focus, e.g. upper body, full body, mobility"
                value={formData.focus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl p-4"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Draft Plan"}
              </button>
            </form>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                AI Draft Suggestion
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4 mb-6">
                This is an AI-generated draft. The trainer must review and edit it before using it with a client.
              </div>

              {suggestion ? (
                <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 rounded-2xl p-5">
                  {suggestion}
                </pre>
              ) : (
                <p className="text-gray-500">
                  Your AI-generated plan will appear here.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}