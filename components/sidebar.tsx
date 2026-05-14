"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  Activity,
  Bot,
  LogOut,
  ClipboardList,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    router.replace("/login");
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/clients", label: "Clients", icon: <Users size={18} /> },
    { href: "/programs/create", label: "Programs", icon: <ClipboardList size={18} /> },
    { href: "/calendar", label: "Calendar", icon: <Calendar size={18} /> },
    { href: "/exercises", label: "Exercises", icon: <Dumbbell size={18} /> },
    { href: "/exercise-progress", label: "Progress", icon: <Activity size={18} /> },
    { href: "/ai-assistant", label: "AI Assistant", icon: <Bot size={18} /> },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-900 text-white p-3 rounded-xl shadow-lg"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 z-50 min-h-screen w-72 bg-slate-900 text-white p-6 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">TrainForge</h1>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-white"
          >
            <X />
          </button>
        </div>

        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-800 transition"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full mt-10 flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}