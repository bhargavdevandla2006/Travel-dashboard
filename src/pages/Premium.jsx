import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { createLocalNotification } from "../services/api";

const premiumOptions = [
  { id: "low", label: "Low Cost", price: "$99/mo", description: "Smart budget escapes" },
  { id: "high", label: "High Cost", price: "$199/mo", description: "Balanced luxury stays" },
  { id: "premium", label: "Premium", price: "$299/mo", description: "Ultimate VIP access" },
];

export default function PremiumPage() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(() => {
    if (typeof window === "undefined") return "low";
    return localStorage.getItem("travelhub-premium-tier") || "low";
  });

  useEffect(() => {
    localStorage.setItem("travelhub-premium-tier", selectedTier);
    localStorage.setItem("travelhub-premium", "true");
    window.dispatchEvent(new CustomEvent("travelhub-premium-change", { detail: { isPremium: true } }));
  }, [selectedTier]);

  const handleSelectPlan = (tierId) => {
    const nextTier = tierId || selectedTier;
    setSelectedTier(nextTier);
    createLocalNotification({
      type: "premium",
      title: "Premium plan selected",
      message: `You selected the ${premiumOptions.find((option) => option.id === nextTier)?.label || "Premium"} plan.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#020b1f] p-6 text-white">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[36px] border border-white/10 bg-[#020b1f] shadow-[0_40px_90px_rgba(2,12,31,0.8)]">
        <div className="flex min-h-[calc(100vh-3rem)] flex-col xl:flex-row">
          <Sidebar />

          <main className="flex-1 bg-[#020b1f] p-6 lg:p-8">
            <Navbar />

            <div className="mt-8 rounded-[30px] border border-white/10 bg-[#03162d] p-4 shadow-[0_30px_80px_rgba(14,36,56,0.5)]">
              <div className="relative h-[340px] overflow-hidden rounded-[26px] bg-[#f2efe9]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.12)_1px,transparent_1px)] bg-[size:64px_64px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.2),transparent_24%),radial-gradient(circle_at_80%_12%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_65%_72%,rgba(168,85,247,0.12),transparent_30%)]" />
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white/75 text-lg font-bold text-slate-600 shadow-sm">+</button>
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white/75 text-lg font-bold text-slate-600 shadow-sm">−</button>
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] font-bold tracking-[0.22em] text-slate-500">Leaflet © OpenStreetMap</div>
                <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-cyan-500 bg-white shadow-[0_0_0_6px_rgba(34,211,238,0.25)]" />
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-full max-w-[440px] rounded-[26px] border border-cyan-400/40 bg-[#061c30]/95 p-4 shadow-[0_28px_50px_rgba(6,27,45,0.6)] backdrop-blur-md">
                  <div className="space-y-3">
                    {premiumOptions.map((option) => {
                      const isSelected = selectedTier === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleSelectPlan(option.id)}
                          className={`flex w-full items-center justify-between gap-3 rounded-[18px] border px-4 py-3 text-left transition ${isSelected ? "border-cyan-400 bg-cyan-500/15 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.6)]" : "border-white/10 bg-[#091b2f]/90 hover:border-cyan-400/50 hover:bg-[#0d2340]"}`}
                        >
                          <div>
                            <p className="text-[15px] font-bold text-white">{option.label}</p>
                            <p className="mt-1 text-[12px] text-slate-300">{option.description}</p>
                          </div>
                          <span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-[11px] font-bold text-cyan-300">{option.price}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-5 w-full rounded-[16px] bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-base font-black text-white shadow-[0_14px_26px_rgba(34,211,238,0.35)] transition hover:brightness-110"
                  >
                    Premium Active →
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
