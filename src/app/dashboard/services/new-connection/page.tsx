"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function NewConnectionForm() {
  const { dict } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [step, setStep] = useState<"form" | "processing" | "receipt">("form");
  const [connType, setConnType] = useState<"water" | "gas">(typeParam === "gas" ? "gas" : "water");
  const [form, setForm] = useState({ address: "", locality: "", landmark: "", pincode: "" });
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 17.385, lng: 78.4867 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState<any>(null);

  const price = connType === "water" ? 3500 : 2800;
  const serviceType = connType === "water" ? "NEW_WATER_CONNECTION" : "NEW_GAS_CONNECTION";

  useEffect(() => {
    if (typeParam === "gas" || typeParam === "water") setConnType(typeParam);
  }, [typeParam]);

  // Try to get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {} // keep default coords
      );
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setCoords({ lat, lng });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.address || form.address.length < 5) e.address = "Address must be at least 5 characters";
    if (!form.locality) e.locality = "Locality is required";
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStep("processing");
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          quantity: 1,
          ...form,
          latitude: coords.lat,
          longitude: coords.lng,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        await new Promise((r) => setTimeout(r, 3000));
        setReceipt(data);
        setStep("receipt");
      } else {
        setErrors({ address: data.error || "Application failed" });
        setStep("form");
      }
    } catch {
      setErrors({ address: "Network error" });
      setStep("form");
    }
  };

  if (step === "processing") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/70 z-50">
        <Card>
          <div className="text-center py-6 px-8">
            <div className="w-10 h-10 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-zinc-900">Processing Application</p>
            <p className="text-xs text-zinc-400 mt-1">New {connType === "water" ? "Water" : "Gas"} Connection • ₹{price.toLocaleString()}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (step === "receipt") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <Card>
          <div className="text-center mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-emerald-600 text-lg">✓</span>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">Application Submitted</h2>
            <p className="text-xs text-zinc-400">New {connType === "water" ? "Water" : "Gas"} Connection</p>
          </div>
          <div className="border-t border-dashed border-zinc-200 pt-3 space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Payment ID</span><span className="font-mono text-zinc-900">{receipt?.payment?.paymentId}</span></div>
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Amount</span><span className="font-medium text-zinc-900">₹{receipt?.payment?.amount?.toLocaleString()}</span></div>
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Location</span><span className="text-zinc-900">{form.locality}</span></div>
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Coordinates</span><span className="font-mono text-zinc-900">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Status</span><span className="text-emerald-600 font-medium">Booked</span></div>
          </div>
          <p className="text-xs text-zinc-400 mt-3 text-center">A technician will visit for site inspection within 7 working days.</p>
          <Button className="w-full mt-3" size="sm" onClick={() => router.push("/dashboard/services")}>Back to Services</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">
            {connType === "water" ? "🚰" : "⛽"} New {connType === "water" ? "Water" : "Gas"} Connection
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">Apply for a new {connType} connection</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/services")}>← Back</Button>
      </div>

      {/* Connection Type Toggle */}
      <div className="flex gap-1 bg-zinc-100 rounded-lg p-0.5 mb-4">
        <button
          onClick={() => setConnType("water")}
          className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${connType === "water" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
        >
          🚰 Water Connection — ₹3,500
        </button>
        <button
          onClick={() => setConnType("gas")}
          className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${connType === "gas" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}
        >
          ⛽ Gas Connection — ₹2,800
        </button>
      </div>

      <Card>
        {/* Map */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">Select Location on Map</label>
          <div className="rounded-lg overflow-hidden border border-zinc-200">
            <iframe
              title="Location Map"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01}%2C${coords.lat - 0.01}%2C${coords.lng + 0.01}%2C${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="grid grid-cols-2 gap-2 flex-1">
              <Input
                label="Latitude"
                value={coords.lat.toString()}
                onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) || 0 })}
                placeholder="Latitude"
              />
              <Input
                label="Longitude"
                value={coords.lng.toString()}
                onChange={(e) => setCoords({ ...coords, lng: parseFloat(e.target.value) || 0 })}
                placeholder="Longitude"
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                  () => setErrors({ ...errors, address: "Unable to get location" })
                );
              }
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900 underline mt-1"
          >
            📍 Use my current location
          </button>
        </div>

        {/* Address Fields */}
        <Input label="Full Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} placeholder="House no, street, area" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input label="Locality" required value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} error={errors.locality} placeholder="Colony/Area" />
          <Input label="Landmark" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="Near..." />
        </div>
        <Input label="Pincode" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} error={errors.pincode} placeholder="6-digit pincode" className="mt-2" />

        {/* Fee Display */}
        <div className="flex justify-between items-center bg-zinc-50 rounded-lg p-3 mt-4">
          <div>
            <span className="text-sm text-zinc-600">Application Fee</span>
            <p className="text-xs text-zinc-400">One-time connection charge</p>
          </div>
          <span className="text-lg font-bold text-zinc-900">₹{price.toLocaleString()}</span>
        </div>

        <Button className="w-full mt-3" onClick={handleSubmit}>Pay ₹{price.toLocaleString()} & Apply</Button>
      </Card>
    </div>
  );
}

export default function NewConnectionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" /></div>}>
      <NewConnectionForm />
    </Suspense>
  );
}
