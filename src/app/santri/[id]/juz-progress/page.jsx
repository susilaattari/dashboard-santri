"use client";

import { useParams } from "next/navigation";
import JuzProgressDashboard from "@/components/JuzProgressDashboard";

export default function SantriJuzProgressPage() {
  const params = useParams();

  return (
    <JuzProgressDashboard
      santriId={params.id} // ← Pass ID dari URL
    />
  );
}
