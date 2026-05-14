"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}