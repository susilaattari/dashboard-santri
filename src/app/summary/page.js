"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import SantriJuzSummary from "@/components/SantriJuzSummary";

export default function GuruDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!session?.user?.guru_id) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/juz-summary`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return <SantriJuzSummary data={data} />;
}
