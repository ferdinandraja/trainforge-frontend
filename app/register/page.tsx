"use client";

import { useState } from "react";
import API from "@/lib/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await API.post("register/", { username, password });
    alert("Registered! Please login.");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 shadow rounded space-y-3">
        <h1>Register</h1>

        <input onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}