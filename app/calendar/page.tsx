"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import API from "@/lib/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

interface Client {
  id: number;
  full_name: string;
}

interface Appointment {
  id: number;
  client: number;
  client_name: string;
  title: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  notes: string;
}

export default function CalendarPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    title: "",
    appointment_date: "",
    appointment_time: "",
    duration_minutes: 60,
    notes: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsRes = await API.get("clients/");
        setClients(clientsRes.data);

        const appointmentsRes = await API.get("appointments/");
        setAppointments(appointmentsRes.data);
      } catch {
        alert("Failed to load calendar data");
      }
    };

    loadData();
  }, []);

  const refreshAppointments = async () => {
    const appointmentsRes = await API.get("appointments/");
    setAppointments(appointmentsRes.data);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "duration_minutes"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const createAppointment = async () => {
    try {
      setLoading(true);

      await API.post("appointments/", {
        ...formData,
        client: Number(formData.client),
      });

      setFormData({
        client: "",
        title: "",
        appointment_date: "",
        appointment_time: "",
        duration_minutes: 60,
        notes: "",
      });

      await refreshAppointments();

      alert("Appointment scheduled successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendError = error.response?.data;
        console.log("Backend error:", backendError);

        if (backendError?.non_field_errors) {
          alert(backendError.non_field_errors[0]);
          return;
        }
      }

      alert("Failed to schedule appointment");
    } finally {
      setLoading(false);
    }
  };

  const calendarEvents = appointments.map((appointment) => ({
    id: String(appointment.id),
    title: `${appointment.client_name} - ${appointment.title}`,
    start: `${appointment.appointment_date}T${appointment.appointment_time}`,
  }));

  return (
  <ProtectedRoute>
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Schedule Appointment
              </h1>

              <p className="text-gray-500 mb-8">
                Select a client and schedule a training appointment.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createAppointment();
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block mb-2 font-semibold">
                    Client
                  </label>

                  <select
                    name="client"
                    required
                    value={formData.client}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  >
                    <option value="">Choose a client</option>

                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Appointment Title
                  </label>

                  <input
                    name="title"
                    required
                    placeholder="e.g. Strength Assessment"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Date
                  </label>

                  <input
                    type="date"
                    name="appointment_date"
                    required
                    value={formData.appointment_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Time
                  </label>

                  <input
                    type="time"
                    name="appointment_time"
                    required
                    value={formData.appointment_time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Duration (Minutes)
                  </label>

                  <input
                    type="number"
                    name="duration_minutes"
                    min={15}
                    required
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl p-4"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
                >
                  {loading ? "Scheduling..." : "Schedule Appointment"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Appointment Calendar
              </h2>

              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                ]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={calendarEvents}
                height="auto"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}