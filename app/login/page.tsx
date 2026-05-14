"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("login/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-700 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-2">
          TrainForge
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Sign in to continue
        </p>

        <div className="space-y-4">
          <input
            placeholder="Username"
            value={username}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/trainer-signup")}
            className="w-full mt-4 border border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-2xl font-semibold"
          >
            Create Trainer Account
          </button>
        </div>
      </div>
    </div>
  );
}