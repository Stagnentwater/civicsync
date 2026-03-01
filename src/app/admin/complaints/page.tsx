"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
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
  user: { name: string; phone: string };
}

export default function AdminComplaintsPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const url = filter
        ? `/api/admin/complaints?status=${filter}`
        : "/api/admin/complaints";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints);
      }
    } catch {
      console.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchComplaints();
      }
    } catch {
      console.error("Failed to update complaint");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{dict.admin.allComplaints}</h1>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          {dict.common.back}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap" role="group" aria-label="Filter complaints">
        {["", "OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-pressed={filter === status}
          >
            {status === "" ? "All" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text={dict.common.loading} />
      ) : complaints.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">{dict.common.noData}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">📋</span>
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        {complaint.department}
                      </p>
                      <p className="text-sm text-gray-500">
                        By: {complaint.user.name} ({complaint.user.phone}) •{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 mt-2">{complaint.description}</p>
                      {(complaint.locality || complaint.address) && (
                        <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm">
                          <p className="font-semibold text-gray-700 mb-1">📍 Location:</p>
                          {complaint.locality && <p className="text-gray-600">Area: {complaint.locality}</p>}
                          {complaint.address && <p className="text-gray-600">Address: {complaint.address}</p>}
                          {complaint.landmark && <p className="text-gray-600">Landmark: {complaint.landmark}</p>}
                          {complaint.pincode && <p className="text-gray-600">Pincode: {complaint.pincode}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 ml-11">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        complaint.status === "OPEN"
                          ? "bg-blue-100 text-blue-800"
                          : complaint.status === "IN_PROGRESS"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {complaint.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    {dict.admin.updateStatus}:
                  </p>
                  {complaint.status !== "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(complaint.id, "IN_PROGRESS")}
                      loading={updatingId === complaint.id}
                    >
                      → {dict.common.inProgress}
                    </Button>
                  )}
                  {complaint.status !== "RESOLVED" && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => updateStatus(complaint.id, "RESOLVED")}
                      loading={updatingId === complaint.id}
                    >
                      ✓ {dict.common.resolved}
                    </Button>
                  )}
                  {complaint.status !== "OPEN" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(complaint.id, "OPEN")}
                      loading={updatingId === complaint.id}
                    >
                      ↺ {dict.common.open}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
