"use client";

interface DispatchProps {
    staticThreshold: number;
    dynamicThreshold: number;
    staticAssign: boolean;
    dynamicAssign: boolean;
    staticTotalCost: number;
    dynamicTotalCost: number;
    staticIdleCost: number;
    dynamicIdleCost: number;
    staticDelayCost: number;
    dynamicDelayCost: number;
    netAdvantage: number;
    kci: number;
    mrs: number;
}

export default function DispatchIntelligence({
    staticThreshold,
    dynamicThreshold,
    staticAssign,
    dynamicAssign,
    staticTotalCost,
    dynamicTotalCost,
    staticIdleCost,
    dynamicIdleCost,
    staticDelayCost,
    dynamicDelayCost,
    netAdvantage,
    kci,
    mrs,
}: DispatchProps) {
    const adaptiveSaves = netAdvantage > 0;

    return (
        <div className="card animate-slide-in" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">⚡ Smart Dispatch Optimization</h3>
                <span className="badge badge-green text-xs">AI Powered</span>
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Costs are <strong>projected forward</strong> based on when each model will dispatch the rider.
                Static always dispatches at <strong>70%</strong>. Adaptive uses KCI + MRS to find the optimal moment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                <div className="rounded-2xl p-4 border-2" style={{ borderColor: "#e0e0e0", background: "#fafafa" }}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-gray-700">📊 Static Model</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: staticAssign ? "#e6f9ee" : "#f0f0f0", color: staticAssign ? "#20b038" : "#888" }}>
                            {staticAssign ? "Dispatched" : "Waiting"}
                        </span>
                    </div>

                    <div className="flex items-end gap-2 mb-1">
                        <div className="text-3xl font-black text-gray-800">{staticThreshold}%</div>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">Fixed threshold — no KCI/MRS awareness</p>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="h-2 rounded-full bg-gray-400" style={{ width: `${staticThreshold}%` }} />
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Projected Idle Cost</span>
                            <span className="font-semibold text-gray-700">₹{staticIdleCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Projected Delay Cost</span>
                            <span className="font-semibold" style={{ color: staticDelayCost > 0 ? "#E23744" : "#888" }}>
                                ₹{staticDelayCost.toFixed(2)}
                            </span>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-700">Total Cost</span>
                            <span className="font-black text-gray-900">₹{staticTotalCost.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-3 rounded-lg p-2 text-xs" style={{ background: "#fff3e8", color: "#f97316" }}>
                        ⚠️ Blind dispatch — ignores kitchen congestion and merchant reliability.
                    </div>
                </div>

                <div className="rounded-2xl p-4 border-2"
                    style={{
                        borderColor: adaptiveSaves ? "#20b03830" : "#E2374430",
                        background: adaptiveSaves ? "#f8fff9" : "#fff8f8"
                    }}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold" style={{ color: "#E23744" }}>🧠 Adaptive Model</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{
                                background: dynamicAssign ? "#e6f9ee" : "#ffeaec",
                                color: dynamicAssign ? "#20b038" : "#E23744"
                            }}>
                            {dynamicAssign ? "Smart Dispatch" : "Optimizing…"}
                        </span>
                    </div>

                    <div className="flex items-end gap-2 mb-1">
                        <div className="text-3xl font-black" style={{ color: "#E23744" }}>
                            {dynamicThreshold.toFixed(0)}%
                        </div>
                        <span className="text-xs text-gray-400 mb-1">dynamic threshold</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">KCI: {kci.toFixed(2)} · MRS: {mrs.toFixed(2)} · cost_now vs cost_future</p>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="h-2 rounded-full"
                            style={{
                                width: `${dynamicThreshold}%`,
                                background: "linear-gradient(90deg, #E23744, #ff8c42)"
                            }} />
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Projected Idle Cost</span>
                            <span className="font-semibold text-gray-700">₹{dynamicIdleCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Projected Delay Cost</span>
                            <span className="font-semibold" style={{ color: dynamicDelayCost > 0 ? "#E23744" : "#20b038" }}>
                                ₹{dynamicDelayCost.toFixed(2)}
                            </span>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-700">Total Cost</span>
                            <span className="font-black" style={{ color: "#E23744" }}>₹{dynamicTotalCost.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-3 rounded-lg p-2 text-xs" style={{ background: "#e6f9ee", color: "#166534" }}>
                        ✅ Dispatches only when cost_now ≤ cost_if_we_wait_1_more_min.
                    </div>
                </div>
            </div>

            <div className="rounded-2xl p-4 flex items-center justify-between"
                style={{
                    background: adaptiveSaves
                        ? "linear-gradient(135deg, #e6f9ee, #c8f0d4)"
                        : "linear-gradient(135deg, #ffeaec, #ffd0d4)",
                }}>
                <div>
                    <p className="text-sm font-bold" style={{ color: adaptiveSaves ? "#166534" : "#991b1b" }}>
                        {adaptiveSaves ? "💰 Net Savings per Order" : "⚠️ Adaptive Costlier by"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: adaptiveSaves ? "#166534" : "#991b1b", opacity: 0.7 }}>
                        {adaptiveSaves
                            ? "Adaptive dispatch saves over static baseline"
                            : "Static cheaper here — try higher Active Orders or lower Complexity"}
                    </p>
                </div>
                <div className="text-3xl font-black" style={{ color: adaptiveSaves ? "#20b038" : "#E23744" }}>
                    {adaptiveSaves ? "+" : "−"}₹{Math.abs(netAdvantage).toFixed(2)}
                </div>
            </div>

            {!adaptiveSaves && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                    💡 Adaptive wins when KCI is high (busy kitchen) + rider travel time is short.
                    Try: Active Orders → 18, Rider Travel → 3 min.
                </p>
            )}
        </div>
    );
}
