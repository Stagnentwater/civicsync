"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
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

  const departments = Object.entries(dict.departments).map(([value, label]) => ({
    value,
    label,
  }));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department, description, locality, address, landmark, pincode }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to file complaint");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <Card className="text-center py-8">
          <div className="text-6xl mb-4" aria-hidden="true">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            {dict.common.complaintFiled}
          </h1>
          <p className="text-gray-500 mb-6">
            Your complaint has been registered and will be reviewed shortly.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button onClick={() => router.push("/dashboard/complaints")}>
              {dict.common.viewComplaints}
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              {dict.common.dashboard}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {dict.common.fileComplaint}
        </h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          {dict.common.back}
        </Button>
      </div>

      <Card>
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              <span className={`ml-2 text-sm font-medium ${step >= s ? "text-blue-700" : "text-gray-400"}`}>
                {s === 1 ? dict.common.department : s === 2 ? dict.common.locationDetails || "Location" : dict.common.description}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 mx-3 ${step > s ? "bg-blue-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Department */}
          {step === 1 && (
            <>
              <Select
                label={dict.common.department}
                placeholder={dict.common.selectDepartment}
                options={departments}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                aria-required="true"
              />
              <div className="pt-4">
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!department}
                >
                  {dict.common.next || "Next"} →
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Location details */}
          {step === 2 && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📍 {dict.common.locationDetails || "Location Details"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {dict.common.locationHint || "Where should the action be taken? Provide the location details."}
                </p>
              </div>

              <Input
                label={dict.common.locality || "Locality / Area"}
                placeholder={dict.common.enterLocality || "e.g. Banjara Hills, Kukatpally, MG Road"}
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                aria-required="true"
              />

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  {dict.common.address || "Full Address"}
                </label>
                <textarea
                  id="address"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 min-h-[100px] resize-y"
                  placeholder={dict.common.enterAddress || "Enter the full address where the issue exists"}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  aria-required="true"
                />
              </div>

              <Input
                label={dict.common.landmark || "Landmark (Optional)"}
                placeholder={dict.common.enterLandmark || "e.g. Near City Hospital, Opposite Metro Station"}
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />

              <Input
                label={dict.common.pincode || "Pincode (Optional)"}
                placeholder={dict.common.enterPincode || "e.g. 500034"}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />

              <div className="flex gap-3 pt-4">
                <Button variant="outline" fullWidth onClick={() => setStep(1)}>
                  ← {dict.common.back}
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => setStep(3)}
                  disabled={!locality || address.length < 5}
                >
                  {dict.common.next || "Next"} →
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  {dict.common.description}
                </label>
                <textarea
                  id="description"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 min-h-[150px] resize-y"
                  placeholder={dict.common.describeIssue}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-required="true"
                />
              </div>

              {/* Summary preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">📋 {dict.common.summary || "Summary"}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">{dict.common.department}:</span>
                  <span className="font-medium">{departments.find(d => d.value === department)?.label || department}</span>
                  <span className="text-gray-500">{dict.common.locality || "Locality"}:</span>
                  <span className="font-medium">{locality}</span>
                  <span className="text-gray-500">{dict.common.address || "Address"}:</span>
                  <span className="font-medium">{address}</span>
                  {landmark && (
                    <>
                      <span className="text-gray-500">{dict.common.landmark || "Landmark"}:</span>
                      <span className="font-medium">{landmark}</span>
                    </>
                  )}
                  {pincode && (
                    <>
                      <span className="text-gray-500">{dict.common.pincode || "Pincode"}:</span>
                      <span className="font-medium">{pincode}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" fullWidth onClick={() => setStep(2)}>
                  ← {dict.common.back}
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={description.length < 10}
                >
                  {dict.common.submit} {dict.common.complaints}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
