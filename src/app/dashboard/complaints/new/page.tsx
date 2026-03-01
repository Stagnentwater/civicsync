"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function NewComplaintPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const departments = Object.entries(dict.departments).map(([value, label]) => ({ value, label }));

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/complaint", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department, description, locality, address, landmark, pincode }),
      });
      const data = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.error || "Failed to file complaint");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="max-w-sm mx-auto px-4 py-12 text-center">
        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <div className="text-3xl mb-3">✅</div>
          <h1 className="text-lg font-semibold text-zinc-900 mb-1">{dict.common.complaintFiled}</h1>
          <p className="text-sm text-zinc-500 mb-4">Your complaint will be reviewed shortly.</p>
          <div className="flex flex-col gap-2">
            <Button size="sm" onClick={() => router.push("/dashboard/complaints")}>{dict.common.viewComplaints}</Button>
            <Button size="sm" variant="ghost" onClick={() => router.push("/dashboard")}>{dict.common.dashboard}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">{dict.common.fileComplaint}</h1>
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>{dict.common.back}</Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm" role="alert">{error}</div>
        )}

        {/* Steps */}
        <div className="flex items-center gap-1 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${step >= s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"}`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-px mx-1.5 ${step > s ? "bg-zinc-900" : "bg-zinc-200"}`} />}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <Select label={dict.common.department} placeholder={dict.common.selectDepartment} options={departments} value={department} onChange={(e) => setDepartment(e.target.value)} />
              <Button fullWidth onClick={() => setStep(2)} disabled={!department}>Next →</Button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-xs text-zinc-400 mb-1">{dict.common.locationHint || "Where is the issue located?"}</p>
              <Input label={dict.common.locality || "Locality"} placeholder="e.g. Banjara Hills" value={locality} onChange={(e) => setLocality(e.target.value)} />
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-zinc-700 mb-1">{dict.common.address || "Address"}</label>
                <textarea id="address" className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 min-h-[80px] resize-y" placeholder="Full address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <Input label={dict.common.landmark || "Landmark"} placeholder="Optional" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
              <Input label={dict.common.pincode || "Pincode"} placeholder="e.g. 500034" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} />
              <div className="flex gap-2">
                <Button variant="ghost" fullWidth onClick={() => setStep(1)}>← Back</Button>
                <Button fullWidth onClick={() => setStep(3)} disabled={!locality || address.length < 5}>Next →</Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">{dict.common.description}</label>
                <textarea id="description" className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 min-h-[100px] resize-y" placeholder={dict.common.describeIssue} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
                <p className="text-xs font-medium text-zinc-600 mb-1.5">Summary</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-zinc-400">Dept:</span>
                  <span className="text-zinc-700">{departments.find(d => d.value === department)?.label}</span>
                  <span className="text-zinc-400">Location:</span>
                  <span className="text-zinc-700">{locality}</span>
                  {pincode && <><span className="text-zinc-400">Pincode:</span><span className="text-zinc-700">{pincode}</span></>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" fullWidth onClick={() => setStep(2)}>← Back</Button>
                <Button fullWidth onClick={handleSubmit} loading={loading} disabled={description.length < 10}>{dict.common.submit}</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
