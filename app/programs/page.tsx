"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import API from "@/lib/api";

export default function CreateProgram() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createProgram = async () => {
    await API.post("programs/", { title, description });
    alert("Created!");
  };

  return (
    <ProtectedRoute>
    <div className="p-6">
      <h1>Create Program</h1>

      <input
        placeholder="Title"
        className="border p-2 block mb-2"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 block mb-2"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={createProgram} className="bg-blue-600 text-white p-2">
        Create
      </button>
    </div>
    </ProtectedRoute>
  );
}