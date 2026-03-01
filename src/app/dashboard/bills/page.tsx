"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

interface Bill {
  id: string;
  billType: string;
  label: string;
  amount: number;
  dueDate: string;
  status: string;
  payments: { id: string; status: string; createdAt: string }[];
}

interface PaymentReceipt {
  id: string;
  amount: number;
  billType: string;
  label: string;
}

const BILL_ICONS: Record<string, string> = {
  Electricity: "⚡",
  Water: "💧",
  "Property Tax": "🏠",
  Gas: "🔥",
  Sewerage: "🚰",
  General: "📄",
};

export default function BillsPage() {
  const { dict } = useApp();
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch("/api/billing");
      const data = await res.json();
      if (res.ok) {
        setBills(data.bills);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load bills" });
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (bill: Bill) => {
    setPayingId(bill.id);
    setMessage(null);
    setReceipt(null);
    setProcessingStep(1);

    // Step 1: Verifying bill
    await new Promise((r) => setTimeout(r, 800));
    setProcessingStep(2);

    // Step 2: Processing payment
    await new Promise((r) => setTimeout(r, 1200));
    setProcessingStep(3);

    try {
      const res = await fetch("/api/billing/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billId: bill.id }),
      });
      const data = await res.json();

      // Step 3: Confirming
      await new Promise((r) => setTimeout(r, 600));

      if (res.ok) {
        setProcessingStep(4);
        setMessage({ type: "success", text: dict.common.paymentSuccess });
        setReceipt({
          id: data.payment.id,
          amount: data.payment.amount,
          billType: bill.billType,
          label: bill.label,
        });
        fetchBills();
      } else {
        setMessage({ type: "error", text: data.error || dict.common.paymentFailed });
      }
    } catch {
      setMessage({ type: "error", text: dict.common.paymentFailed });
    } finally {
      setPayingId(null);
      setProcessingStep(0);
    }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{dict.common.bills}</h1>
          <p className="text-gray-500 mt-1">{dict.common.viewBills}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          {dict.common.back}
        </Button>
      </div>

      {/* Payment Processing Overlay */}
      {payingId && processingStep > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4 animate-pulse">
              {processingStep === 1 ? "🔍" : processingStep === 2 ? "💳" : processingStep === 3 ? "✅" : "🎉"}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {processingStep === 1
                ? "Verifying Bill..."
                : processingStep === 2
                ? "Processing Payment..."
                : processingStep === 3
                ? "Confirming Transaction..."
                : "Payment Complete!"}
            </h3>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-12 rounded-full transition-colors ${
                    processingStep >= s ? "bg-blue-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt */}
      {receipt && (
        <div className="mb-6 bg-green-50 border-2 border-green-300 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🧾</span>
            <h3 className="text-xl font-bold text-green-800">Payment Receipt</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono font-medium text-gray-800">{receipt.id.slice(0, 12)}...</span>
            <span className="text-gray-600">Bill Type:</span>
            <span className="font-medium">{receipt.billType}</span>
            <span className="text-gray-600">Description:</span>
            <span className="font-medium">{receipt.label}</span>
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-bold text-green-700">₹{receipt.amount.toLocaleString()}</span>
            <span className="text-gray-600">Status:</span>
            <span className="font-bold text-green-700">✓ SUCCESS</span>
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{new Date().toLocaleString()}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setReceipt(null)}>
            {dict.common.close}
          </Button>
        </div>
      )}

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {message.text}
        </div>
      )}

      {bills.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-4xl mb-4" aria-hidden="true">📭</p>
          <p className="text-gray-500 text-lg">{dict.common.noData}</p>
          <p className="text-gray-400 text-sm mt-2">No bills found for your account.</p>
        </Card>
      ) : (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{bills.length}</p>
              <p className="text-xs text-gray-500">Total Bills</p>
            </div>
            <div className="bg-white rounded-xl border p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{bills.filter(b => b.status === "PENDING").length}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="bg-white rounded-xl border p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{bills.filter(b => b.status === "PAID").length}</p>
              <p className="text-xs text-gray-500">Paid</p>
            </div>
            <div className="bg-white rounded-xl border p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                ₹{bills.filter(b => b.status === "PENDING").reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Due Amount</p>
            </div>
          </div>

          <div className="space-y-4">
            {bills.map((bill) => {
              const icon = BILL_ICONS[bill.billType] || BILL_ICONS.General;
              const isOverdue = bill.status === "PENDING" && new Date(bill.dueDate) < new Date();
              return (
                <Card key={bill.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isOverdue ? "border-red-300 bg-red-50/30" : ""}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl" aria-hidden="true">{icon}</span>
                      <div>
                        <p className="font-bold text-lg text-gray-800">{bill.label}</p>
                        <p className="text-sm text-gray-500">
                          {bill.billType} • {dict.common.dueDate}: {new Date(bill.dueDate).toLocaleDateString()}
                          {isOverdue && <span className="text-red-600 font-semibold ml-2">⚠ Overdue</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-12">
                      <p className="text-xl font-bold text-gray-900">₹{bill.amount.toLocaleString()}</p>
                      <StatusBadge status={bill.status} />
                    </div>
                  </div>
                  {bill.status === "PENDING" && (
                    <div className="sm:self-center">
                      <Button
                        size="lg"
                        variant="success"
                        onClick={() => handlePay(bill)}
                        loading={payingId === bill.id}
                        aria-label={`${dict.common.pay} ₹${bill.amount}`}
                      >
                        {dict.common.pay} ₹{bill.amount.toLocaleString()}
                      </Button>
                    </div>
                  )}
                  {bill.status === "PAID" && bill.payments[0] && (
                    <div className="sm:self-center text-sm text-green-600 font-medium">
                      ✓ Paid on {new Date(bill.payments[0].createdAt).toLocaleDateString()}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
