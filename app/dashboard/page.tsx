"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/sidebar";
import API from "@/lib/api";
import {
  CalendarDays,
  Dumbbell,
  Users,
  Activity,
  Plus,
  ArrowRight,
} from "lucide-react";
import BackButton from "@/components/BackButton";

interface Program {
  id: number;
  title: string;
  description: string;
  client_name?: string;
  client_age?: number;
  client_goal?: string;
  start_date?: string;
  preferred_appointment_times?: string;
}

interface Client {
  id: number;
  full_name: string;
}

interface Appointment {
  id: number;
  title: string;
  client_name: string;
  appointment_date: string;
  appointment_time: string;
}

export default function DashboardPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const programsRes = await API.get("programs/");
        setPrograms(programsRes.data);

        const clientsRes = await API.get("clients/");
        setClients(clientsRes.data);

        const appointmentsRes = await API.get("appointments/");
        setAppointments(appointmentsRes.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load dashboard data");
      }
    };

    loadDashboard();
  }, []);

  const upcomingAppointments = appointments.slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-gradient-to-r from-slate-900 to-blue-800 rounded-3xl p-8 text-white shadow-xl">
              <h1 className="text-4xl font-bold">Welcome back 👋</h1>

              <p className="text-blue-100 mt-2">
                Manage your clients, programs, appointments, and progress from
                one place.
              </p>

              <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mt-8">
                <Link
                  href="/clients"
                  className="bg-white text-slate-900 px-5 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:bg-gray-100 transition"
                >
                  <Plus size={18} />
                  New Client
                </Link>

                <Link
                  href="/programs/create"
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-4 rounded-2xl font-semibold flex items-center gap-3 transition"
                >
                  <Plus size={18} />
                  Create Program
                </Link>

                <Link
                  href="/calendar"
                  className="border border-white/30 hover:bg-white/10 px-5 py-4 rounded-2xl font-semibold flex items-center gap-3 transition"
                >
                  <CalendarDays size={18} />
                  Schedule Session
                </Link>

                <Link
                  href="/exercise-progress"
                  className="border border-white/30 hover:bg-white/10 px-5 py-4 rounded-2xl font-semibold flex items-center gap-3 transition"
                >
                  <Activity size={18} />
                  Add Progress
                </Link>

                <Link
                  href="/ai-assistant"
                  className="border border-white/30 hover:bg-white/10 px-5 py-4 rounded-2xl font-semibold flex items-center gap-3 transition"
                >
                  <Dumbbell size={18} />
                  AI Plan
                </Link>
                <Link
  href="/subscriptions"
  className="border border-white/30 hover:bg-white/10 px-5 py-4 rounded-2xl font-semibold flex items-center gap-3 transition"
>
  Admin Subscriptions
</Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard
                title="Active Clients"
                value={clients.length}
                icon={<Users />}
                description="Clients currently managed"
              />

              <StatCard
                title="Active Programs"
                value={programs.length}
                icon={<Dumbbell />}
                description="Training plans created"
              />

              <StatCard
                title="Upcoming Sessions"
                value={appointments.length}
                icon={<CalendarDays />}
                description="Scheduled appointments"
              />

              <StatCard
                title="Progress Tracking"
                value="Live"
                icon={<Activity />}
                description="Exercise records available"
              />
            </div>

            <div className="grid xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-white rounded-3xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">
                      Recent Programs
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Quickly access your latest training plans.
                    </p>
                  </div>

                  <Link
                    href="/programs/create"
                    className="text-blue-600 font-semibold flex items-center gap-1"
                  >
                    New Program <ArrowRight size={18} />
                  </Link>
                </div>

                <div className="grid xl:grid-cols-2 gap-6">
                  {programs.slice(0, 4).map((program) => (
                    <div
                      key={program.id}
                      className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition bg-white min-w-0"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <p className="text-sm text-blue-600 font-semibold mb-2">
                            {program.client_name || "No client assigned"}
                          </p>

                          <h3 className="text-xl font-bold text-slate-800 break-words">
                            {program.title}
                          </h3>
                        </div>

                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap">
                          Active
                        </span>
                      </div>

                      <p className="text-gray-600 mt-4 line-clamp-2 break-words">
                        {program.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <div className="bg-gray-50 rounded-2xl p-4 min-w-0">
                          <p className="text-xs text-gray-500">Client Age</p>

                          <p className="font-bold text-slate-800">
                            {program.client_age || "-"}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 min-w-0">
                          <p className="text-xs text-gray-500">Start Date</p>

                          <p className="font-bold text-slate-800 break-words">
                            {program.start_date || "-"}
                          </p>
                        </div>
                      </div>

                      {program.client_goal && (
                        <div className="bg-blue-50 rounded-2xl p-4 mt-4">
                          <p className="text-xs text-blue-700 font-semibold">
                            Client Goal
                          </p>

                          <p className="text-sm text-slate-700 mt-1 break-words">
                            {program.client_goal}
                          </p>
                        </div>
                      )}

                      {program.preferred_appointment_times && (
                        <p className="text-sm text-gray-500 mt-4 break-words">
                          Preferred: {program.preferred_appointment_times}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                        <Link
                          href={`/programs/${program.id}`}
                          className="text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-semibold"
                        >
                          View
                        </Link>

                        <Link
                          href="/exercise-progress"
                          className="text-center border border-gray-300 hover:bg-gray-50 text-slate-700 px-4 py-3 rounded-2xl font-semibold"
                        >
                          Progress
                        </Link>

                        <Link
                          href="/calendar"
                          className="text-center border border-gray-300 hover:bg-gray-50 text-slate-700 px-4 py-3 rounded-2xl font-semibold"
                        >
                          Schedule
                        </Link>
                      </div>
                    </div>
                  ))}

                  {programs.length === 0 && (
                    <div className="xl:col-span-2 text-center text-gray-500 p-10">
                      No programs yet. Create your first training program.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Upcoming Sessions
                </h2>

                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-gray-50 rounded-2xl p-5"
                    >
                      <p className="font-bold text-slate-800">
                        {appointment.client_name}
                      </p>

                      <p className="text-gray-600 text-sm">
                        {appointment.title}
                      </p>

                      <p className="text-blue-600 text-sm font-semibold mt-3">
                        {appointment.appointment_date} at{" "}
                        {appointment.appointment_time}
                      </p>
                    </div>
                  ))}

                  {upcomingAppointments.length === 0 && (
                    <p className="text-gray-500">
                      No upcoming sessions scheduled.
                    </p>
                  )}
                </div>

                <Link
                  href="/calendar"
                  className="block text-center mt-6 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-semibold"
                >
                  Open Calendar
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>

          <p className="text-4xl font-bold text-slate-900 mt-3">
            {value}
          </p>
        </div>

        <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl">
          {icon}
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-5">{description}</p>
    </div>
  );
}