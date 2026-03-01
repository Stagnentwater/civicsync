"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Complaint {
  id: string; department: string; description: string; locality: string;
  address: string; landmark: string; pincode: string; status: string;
  createdAt: string; user: { name: string; phone: string };
}

export default function AdminComplaintsPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => { fetchComplaints(); }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/admin/complaints?status=${filter}` : "/api/admin/complaints";
      const res = await fetch(url);
      if (res.ok) { const data = await res.json(); setComplaints(data.complaints); }
    } catch { console.error("Failed"); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchComplaints();
    } catch { console.error("Failed"); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">{dict.admin.allComplaints}</h1>
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>{dict.common.back}</Button>
      </div>

      <div className="flex gap-1.5 mb-4">
        {["", "OPEN", "IN_PROGRESS", "RESOLVED"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
            {s === "" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner text={dict.common.loading} /> :
      complaints.length === 0 ? <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center"><p className="text-sm text-zinc-400">{dict.common.noData}</p></div> : (
        <div className="space-y-2">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-lg p-4">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-900">{c.department}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      c.status === "OPEN" ? "bg-blue-50 text-blue-700" :
                      c.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                    }`}>{c.status.replace("_", " ")}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{c.user.name} ({c.user.phone}) • {new Date(c.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-zinc-600 mt-1.5">{c.description}</p>
                  {(c.locality || c.address) && (
                    <div className="mt-2 bg-zinc-50 rounded p-2 text-xs text-zinc-500">
                      {c.locality && <span>{c.locality}</span>}
                      {c.address && <span> • {c.address}</span>}
                      {c.pincode && <span> • {c.pincode}</span>}
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 lg:flex-col">
                  {c.status !== "IN_PROGRESS" && <Button size="sm" variant="outline" onClick={() => updateStatus(c.id, "IN_PROGRESS")} loading={updatingId === c.id}>→ In Progress</Button>}
                  {c.status !== "RESOLVED" && <Button size="sm" variant="success" onClick={() => updateStatus(c.id, "RESOLVED")} loading={updatingId === c.id}>✓ Resolve</Button>}
                  {c.status !== "OPEN" && <Button size="sm" variant="secondary" onClick={() => updateStatus(c.id, "OPEN")} loading={updatingId === c.id}>↺ Reopen</Button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
