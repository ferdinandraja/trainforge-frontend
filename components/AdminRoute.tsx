"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await API.get("me/");

        if (!res.data.is_staff) {
          router.replace("/dashboard");
          return;
        }

        setAllowed(true);
      } catch {
        router.replace("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  return <>{children}</>;
}