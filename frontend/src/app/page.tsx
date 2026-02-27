"use client";

import { useState, useEffect } from "react";
import TopNav from "./components/TopNav";
import RestaurantCard from "./components/RestaurantCard";
import OrderStatusTracker from "./components/OrderStatusTracker";
import CookingProgress from "./components/CookingProgress";
import DispatchIntelligence from "./components/DispatchIntelligence";
import RiderTracking from "./components/RiderTracking";
import MapSection from "./components/MapSection";
import BottomSummary from "./components/BottomSummary";

function computeKCI(prepInflation: number, throughputRatio: number, varianceSpike: number): number {
  const kci = 0.4 * prepInflation + 0.4 * (1 - throughputRatio) + 0.2 * varianceSpike;
  return Math.min(Math.max(kci, 0), 1);
}

function computeMRS(driftScore: number, varianceInstability: number, forBiasScore: number): number {
  const bias = 0.4 * driftScore + 0.3 * varianceInstability + 0.3 * forBiasScore;
  return 1 - Math.min(Math.max(bias, 0), 1);
}

function dynamicDispatchThreshold(kci: number, mrs: number): number {
  const t = 70 - kci * 20 + (1 - mrs) * 10;
  return Math.min(Math.max(t, 50), 80);
}

function shouldAssignRider(
  progress: number,
  predictedTime: number,
  timeElapsed: number,
  riderTravelTime: number,
  kci: number,
  mrs: number
): { assign: boolean; threshold: number } {
  const remainingTime = predictedTime - timeElapsed;
  const threshold = dynamicDispatchThreshold(kci, mrs);

  if (progress < threshold) return { assign: false, threshold };

  const RIDER_COST_PER_MIN = 102 / 60;
  const DELAY_PENALTY = 12;

  const idleNow = Math.max(remainingTime - riderTravelTime, 0);
  const delayNow = Math.max(riderTravelTime - remainingTime, 0);
  const costNow = idleNow * RIDER_COST_PER_MIN + delayNow * DELAY_PENALTY;

  const futureRemaining = Math.max(remainingTime - 1, 0);
  const idleFuture = Math.max(futureRemaining - riderTravelTime, 0);
  const delayFuture = Math.max(riderTravelTime - futureRemaining, 0);
  const costFuture = idleFuture * RIDER_COST_PER_MIN + delayFuture * DELAY_PENALTY;

  return { assign: costNow <= costFuture, threshold };
}

function simulateOrder(params: {
  itemCount: number;
  complexity: number;
  activeOrders: number;
  hourOfDay: number;
  timeElapsed: number;
  riderTravelTime: number;
}) {
  const { itemCount, complexity, activeOrders, hourOfDay, timeElapsed, riderTravelTime } = params;

  const predictedTime = 12 + itemCount * 2.2 + complexity * 1.5 + activeOrders * 0.6 + (hourOfDay >= 18 ? 4 : 0);
  const progress = Math.min(Math.round((timeElapsed / predictedTime) * 100), 95);
  const remainingPrepTime = Math.max(predictedTime - timeElapsed, 0);

  const historicalAvg = 30;
  const prepInflation = Math.min(predictedTime / historicalAvg, 1);
  const throughputRatio = Math.max(0.5, 1 - activeOrders / 20);
  const varianceSpike = Math.min(activeOrders / 15, 1);
  const kci = computeKCI(prepInflation, throughputRatio, varianceSpike);

  const driftScore = Math.min(Math.abs(predictedTime - historicalAvg) / 20, 1);
  const varianceInstability = Math.min(activeOrders / 20, 1);
  const forBiasScore = Math.min(activeOrders / 25, 1);
  const mrs = computeMRS(driftScore, varianceInstability, forBiasScore);

  const { assign: dynamicAssign, threshold: dynamicThreshold } = shouldAssignRider(
    progress, predictedTime, timeElapsed, riderTravelTime, kci, mrs
  );
  const staticAssign = progress >= 70 && riderTravelTime <= remainingPrepTime;

  const RIDER_COST_PER_MIN = 102 / 60;
  const DELAY_PENALTY = 12;

  const staticDispatchAt = 0.70 * predictedTime;
  const staticRiderArrival = staticDispatchAt + riderTravelTime;
  const staticIdleTime = Math.max(predictedTime - staticRiderArrival, 0);
  const staticDelayTime = Math.max(staticRiderArrival - predictedTime, 0);
  const staticIdleCost = round2(staticIdleTime * RIDER_COST_PER_MIN);
  const staticDelayCost = round2(staticDelayTime * DELAY_PENALTY);
  const staticTotalCost = round2(staticIdleCost + staticDelayCost);

  const dynamicDispatchAt = (dynamicThreshold / 100) * predictedTime;
  const dynamicRiderArrival = dynamicDispatchAt + riderTravelTime;
  const dynamicIdleTime = Math.max(predictedTime - dynamicRiderArrival, 0);
  const dynamicDelayTime = Math.max(dynamicRiderArrival - predictedTime, 0);
  const dynamicIdleCost = round2(dynamicIdleTime * RIDER_COST_PER_MIN);
  const dynamicDelayCost = round2(dynamicDelayTime * DELAY_PENALTY);
  const dynamicTotalCost = round2(dynamicIdleCost + dynamicDelayCost);

  const netAdvantage = round2(staticTotalCost - dynamicTotalCost);

  const eta = remainingPrepTime + riderTravelTime;

  return {
    predictedPrepTime: predictedTime,
    progress,
    remainingPrepTime,
    kci,
    mrs,
    dynamicThreshold,
    dynamicAssign,
    staticAssign,
    staticDispatchAt,
    dynamicDispatchAt,
    dynamicIdleCost,
    staticIdleCost,
    dynamicDelayCost,
    staticDelayCost,
    dynamicTotalCost,
    staticTotalCost,
    netAdvantage,
    eta,
  };
}

function round2(v: number) { return Math.round(v * 100) / 100; }

export default function Home() {
  const [showPanel, setShowPanel] = useState(false);
  const [params, setParams] = useState({
    itemCount: 3,
    complexity: 5,
    activeOrders: 8,
    hourOfDay: 20,
    timeElapsed: 15,
    riderTravelTime: 6,
  });

  const result = simulateOrder(params);

  useEffect(() => {
    const interval = setInterval(() => {
      setParams((p) => ({
        ...p,
        timeElapsed: parseFloat(Math.min(p.timeElapsed + 0.5, result.predictedPrepTime).toFixed(1)),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, [result.predictedPrepTime]);

  const sliders: { key: keyof typeof params; label: string; min: number; max: number; step?: number }[] = [
    { key: "itemCount", label: "Item Count", min: 1, max: 10 },
    { key: "complexity", label: "Complexity", min: 1, max: 10 },
    { key: "activeOrders", label: "Active Orders", min: 1, max: 20 },
    { key: "hourOfDay", label: "Hour of Day", min: 0, max: 23 },
    { key: "timeElapsed", label: "Time Elapsed (min)", min: 1, max: 40, step: 0.5 },
    { key: "riderTravelTime", label: "Rider Travel (min)", min: 1, max: 15 },
  ];

  const kciColor = result.kci > 0.6 ? "#E23744" : result.kci > 0.3 ? "#f97316" : "#20b038";
  const mrsColor = result.mrs > 0.6 ? "#20b038" : result.mrs > 0.3 ? "#f97316" : "#E23744";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4" }}>
      <TopNav />

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-4">

        <div
          className="rounded-2xl p-4 flex items-center justify-between cursor-pointer select-none"
          style={{ background: "linear-gradient(135deg, #1c1c1c, #2d2d2d)" }}
          onClick={() => setShowPanel(!showPanel)}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎛️</span>
            <div>
              <p className="text-white font-bold text-sm">Simulation Control Panel</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Adjust order parameters to see live AI dispatch decisions
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#E23744", color: "white" }}>
            {showPanel ? "▲ Hide" : "▼ Show"}
          </span>
        </div>

        {showPanel && (
          <div className="card">
            <h4 className="text-sm font-bold text-gray-800 mb-4">⚙️ Order Simulation Parameters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sliders.map(({ key, label, min, max, step }) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">{label}</label>
                    <span className="text-xs font-bold" style={{ color: "#E23744" }}>
                      {params[key].toFixed(key === "timeElapsed" ? 1 : 0)}
                    </span>
                  </div>
                  <input
                    type="range" min={min} max={max} step={step ?? 1} value={params[key]}
                    onChange={(e) => setParams((p) => ({ ...p, [key]: parseFloat(e.target.value) }))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: "#E23744" }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Predicted Prep", value: `${result.predictedPrepTime.toFixed(1)} min`, color: "#1c1c1c" },
                { label: "KCI", value: result.kci.toFixed(2), color: kciColor },
                { label: "MRS", value: result.mrs.toFixed(2), color: mrsColor },
                { label: "Net Savings", value: `₹${result.netAdvantage.toFixed(2)}`, color: result.netAdvantage >= 0 ? "#20b038" : "#E23744" },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-gray-400">{m.label}</p>
                  <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl p-3 text-xs" style={{ background: "#f8f8f8" }}>
              <p className="font-bold text-gray-700 mb-1">🧠 How Adaptive Decides:</p>
              <p className="text-gray-500">
                Dynamic threshold = <strong>{result.dynamicThreshold.toFixed(1)}%</strong> (Static = 70%) &nbsp;·&nbsp;
                Static dispatches at <strong>{result.staticDispatchAt.toFixed(1)} min</strong> elapsed &nbsp;·&nbsp;
                Adaptive dispatches at <strong>{result.dynamicDispatchAt.toFixed(1)} min</strong> elapsed &nbsp;·&nbsp;
                Rider travel = <strong>{params.riderTravelTime} min</strong> &nbsp;·&nbsp;
                Cost-aware: compares cost_now vs cost_wait_1min, dispatches only if cheaper now.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RestaurantCard />
          <OrderStatusTracker progress={result.progress} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CookingProgress
            progress={result.progress}
            kci={result.kci}
            mrs={result.mrs}
            predictedPrepTime={result.predictedPrepTime}
            remainingPrepTime={result.remainingPrepTime}
          />
          <DispatchIntelligence
            staticThreshold={70}
            dynamicThreshold={result.dynamicThreshold}
            staticAssign={result.staticAssign}
            dynamicAssign={result.dynamicAssign}
            staticTotalCost={result.staticTotalCost}
            dynamicTotalCost={result.dynamicTotalCost}
            staticIdleCost={result.staticIdleCost}
            dynamicIdleCost={result.dynamicIdleCost}
            staticDelayCost={result.staticDelayCost}
            dynamicDelayCost={result.dynamicDelayCost}
            netAdvantage={result.netAdvantage}
            kci={result.kci}
            mrs={result.mrs}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RiderTracking
            riderName="Ravi Kumar"
            riderPhone="+91 98765 43210"
            riderTravel={params.riderTravelTime}
            remainingPrepTime={result.remainingPrepTime}
            predictedPrepTime={result.predictedPrepTime}
            dynamicThreshold={result.dynamicThreshold}
          />
          <MapSection />
        </div>

        <BottomSummary
          eta={result.eta}
          dynamicTotalCost={result.dynamicTotalCost}
          kci={result.kci}
          mrs={result.mrs}
          dynamicAssign={result.dynamicAssign}
          remainingPrepTime={result.remainingPrepTime}
          riderTravel={params.riderTravelTime}
          netAdvantage={result.netAdvantage}
        />

        <div className="text-center py-4 text-xs text-gray-400">
          Built with ❤️ for Hackathon 2026 · Adaptive Bias-Resilient Dispatch Intelligence
        </div>
      </div>
    </div>
  );
}
