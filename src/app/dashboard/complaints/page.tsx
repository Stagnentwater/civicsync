"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Complaint {
  id: string;
  department: string;
  description: string;
  locality: string;
  address: string;
  landmark: string;
  pincode: string;
  status: string;
  createdAt: string;
}

export default function ComplaintsPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaint");
      const data = await res.json();
      if (res.ok) setComplaints(data.complaints);
    } catch { console.error("Failed to fetch complaints"); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">{dict.common.viewComplaints}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Track your filed complaints</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => router.push("/dashboard/complaints/new")}>+ New</Button>
          <Button size="sm" variant="ghost" onClick={() => router.push("/dashboard")}>{dict.common.back}</Button>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
          <p className="text-zinc-400 text-sm">{dict.common.noData}</p>
          <Button size="sm" className="mt-4" onClick={() => router.push("/dashboard/complaints/new")}>
            {dict.common.fileComplaint}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-900">{c.department}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-zinc-600 mt-1.5">{c.description}</p>
                  {(c.locality || c.address) && (
                    <div className="mt-2 bg-zinc-50 rounded p-2 text-xs text-zinc-500">
                      {c.locality && <span>{c.locality}</span>}
                      {c.address && <span> • {c.address}</span>}
                      {c.pincode && <span> • {c.pincode}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
