import Link from "next/link";
import { Dumbbell, Calendar, Users, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Dumbbell className="text-blue-400" size={32} />
          <span className="text-2xl font-bold">TrainForge</span>
        </div>

      </nav>

      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Personalized Experince for Personal Trainer.
          </h1>

          <p className="text-slate-300 text-lg mt-6 max-w-xl">
            TrainForge helps personal trainers to create a more personalized experience to manage clients, create
            personalised workout programs, schedule appointments, and monitor
            exercise progress in one place.
          </p>

          <div className="flex gap-4 mt-10">
            <Link
              href="/trainer-signup"
              className="bg-blue-600 hover:bg-blue-700 px-7 py-4 rounded-2xl font-semibold"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="border border-white/30 hover:bg-white/10 px-7 py-4 rounded-2xl font-semibold"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-3xl p-8 shadow-2xl">
          <div className="grid gap-5">
            <Feature
              icon={<Users />}
              title="Client Management"
              description="Create, edit, list, and delete client records."
            />

            <Feature
              icon={<Dumbbell />}
              title="Training Programs"
              description="Build custom plans with workouts, exercises, sets, and reps."
            />

            <Feature
              icon={<Calendar />}
              title="Appointment Scheduling"
              description="Schedule sessions and view them in a calendar."
            />

            <Feature
              icon={<TrendingUp />}
              title="Progress Tracking"
              description="Track client progress by exercise over time."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 text-slate-900 flex gap-4">
      <div className="text-blue-600">{icon}</div>

      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-slate-600 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}