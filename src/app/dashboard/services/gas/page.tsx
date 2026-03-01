"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function GasBookingPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<"form" | "processing" | "receipt">("form");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ address: "", locality: "", landmark: "", pincode: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState<any>(null);

  const unitPrice = 950;
  const total = quantity * unitPrice;

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
        body: JSON.stringify({ serviceType: "GAS_CYLINDER", quantity, ...form }),
      });
      const data = await res.json();
      if (res.ok) {
        await new Promise((r) => setTimeout(r, 2500));
        setReceipt(data);
        setStep("receipt");
      } else {
        setErrors({ address: data.error || "Booking failed" });
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
            <p className="text-sm font-medium text-zinc-900">Processing Payment</p>
            <p className="text-xs text-zinc-400 mt-1">₹{total.toLocaleString()} • Gas Cylinder × {quantity}</p>
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
            <h2 className="text-base font-semibold text-zinc-900">Booking Confirmed</h2>
            <p className="text-xs text-zinc-400">Gas Cylinder × {quantity}</p>
          </div>
          <div className="border-t border-dashed border-zinc-200 pt-3 space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Payment ID</span><span className="font-mono text-zinc-900">{receipt?.payment?.paymentId}</span></div>
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Amount</span><span className="font-medium text-zinc-900">₹{receipt?.payment?.amount?.toLocaleString()}</span></div>
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Delivery</span><span className="text-zinc-900">{form.locality}</span></div>
            <div className="flex justify-between text-xs"><span className="text-zinc-500">Status</span><span className="text-emerald-600 font-medium">Booked</span></div>
          </div>
          <Button className="w-full mt-4" size="sm" onClick={() => router.push("/dashboard/services")}>Back to Services</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">🔥 Buy Gas Cylinder</h1>
          <p className="text-sm text-zinc-500 mt-0.5">LPG cylinder delivery to your door</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/services")}>← Back</Button>
      </div>

      <Card>
        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">Quantity</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-sm font-medium">−</button>
            <span className="text-lg font-semibold text-zinc-900 w-6 text-center">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-sm font-medium">+</button>
            <span className="text-xs text-zinc-400 ml-2">₹{unitPrice}/unit</span>
          </div>
        </div>

        {/* Address Fields */}
        <Input label="Delivery Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} placeholder="Full address" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input label="Locality" required value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} error={errors.locality} placeholder="Area" />
          <Input label="Landmark" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} placeholder="Near..." />
        </div>
        <Input label="Pincode" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} error={errors.pincode} placeholder="6-digit pincode" className="mt-2" />

        {/* Total */}
        <div className="flex justify-between items-center bg-zinc-50 rounded-lg p-3 mt-4">
          <span className="text-sm text-zinc-600">Total Amount</span>
          <span className="text-lg font-bold text-zinc-900">₹{total.toLocaleString()}</span>
        </div>

        <Button className="w-full mt-3" onClick={handleSubmit}>Pay ₹{total.toLocaleString()} & Book</Button>
      </Card>
    </div>
  );
}
