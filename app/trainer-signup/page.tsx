"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

export default function TrainerSignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    specialization: "",
    experience_years: 0,
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await API.post(
        "trainer-signup/",
        formData
      );

      alert("Trainer account created");

      router.push("/login");
    } catch {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          Trainer Signup
        </h1>

        <p className="text-gray-500 mb-8">
          Create your personal trainer account.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold">
              Username
            </label>

            <input
              type="text"
              name="username"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Specialization
            </label>

            <input
              type="text"
              name="specialization"
              placeholder="Strength Training"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Experience (Years)
            </label>

            <input
              type="number"
              name="experience_years"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl p-4"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-semibold">
            Bio
          </label>

          <textarea
            name="bio"
            rows={5}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-2xl p-4"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
        >
          {loading
            ? "Creating Account..."
            : "Create Trainer Account"}
        </button>
      </div>
    </div>
  );
}