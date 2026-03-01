"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
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

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaint");
      const data = await res.json();
      if (res.ok) {
        setComplaints(data.complaints);
      }
    } catch {
      console.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{dict.common.viewComplaints}</h1>
          <p className="text-gray-500 mt-1">Track your filed complaints</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push("/dashboard/complaints/new")}>
            + {dict.common.fileComplaint}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            {dict.common.back}
          </Button>
        </div>
      </div>

      {complaints.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-4xl mb-4" aria-hidden="true">📭</p>
          <p className="text-gray-500 text-lg">{dict.common.noData}</p>
          <p className="text-gray-400 text-sm mt-2">
            You haven&apos;t filed any complaints yet.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/dashboard/complaints/new")}>
              {dict.common.fileComplaint}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl" aria-hidden="true">📋</span>
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        {complaint.department}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()} •{" "}
                        {new Date(complaint.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2 ml-11">{complaint.description}</p>
                  {(complaint.locality || complaint.address) && (
                    <div className="mt-2 ml-11 bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="font-semibold text-gray-700 mb-1">📍 Location:</p>
                      {complaint.locality && (
                        <p className="text-gray-600">Area: {complaint.locality}</p>
                      )}
                      {complaint.address && (
                        <p className="text-gray-600">Address: {complaint.address}</p>
                      )}
                      {complaint.landmark && (
                        <p className="text-gray-600">Landmark: {complaint.landmark}</p>
                      )}
                      {complaint.pincode && (
                        <p className="text-gray-600">Pincode: {complaint.pincode}</p>
                      )}
                    </div>
                  )}
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
