"use client";

interface MetricProps {
    label: string;
    value: string;
    status: "good" | "warning" | "risk";
    icon: string;
    description: string;
}

function Metric({ label, value, status, icon, description }: MetricProps) {
    const colors = {
        good: { text: "#20b038", bg: "#e6f9ee", border: "#20b03820" },
        warning: { text: "#f97316", bg: "#fff3e8", border: "#f9731620" },
        risk: { text: "#E23744", bg: "#ffeaec", border: "#E2374420" },
    };
    const c = colors[status];

    return (
        <div className="rounded-2xl p-4 border flex flex-col gap-2"
            style={{ background: c.bg, borderColor: c.border }}>
            <div className="flex items-center justify-between">
                <span className="text-lg">{icon}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${c.text}20`, color: c.text }}>
                    {status === "good" ? "Good" : status === "warning" ? "Warning" : "Risk"}
                </span>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-xl font-black" style={{ color: c.text }}>{value}</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}

export default function BottomSummary({
    eta,
    dynamicTotalCost,
    kci,
    mrs,
    dynamicAssign,
    remainingPrepTime,
    riderTravel,
    netAdvantage,
}: {
    eta: number;
    dynamicTotalCost: number;
    kci: number;
    mrs: number;
    dynamicAssign: boolean;
    remainingPrepTime: number;
    riderTravel: number;
    netAdvantage: number;
}) {
    const idleRisk = dynamicAssign && riderTravel < remainingPrepTime ? "High"
        : dynamicAssign ? "Low"
            : "Moderate";
    const delayRisk = riderTravel > remainingPrepTime ? "High" : "Low";
    const etaConf = kci < 0.4 && mrs > 0.6 ? "High (92%)" : kci < 0.7 ? "Moderate (74%)" : "Low (55%)";

    const savingsStatus: "good" | "warning" | "risk" =
        netAdvantage > 5 ? "good" :
            netAdvantage >= 0 ? "warning" : "risk";

    return (
        <div className="card animate-slide-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900">📊 Delivery Summary</h3>
                <span className="badge badge-gray text-xs">Dashboard</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <Metric icon="⏱️" label="Est. Delivery Time" value={`${eta.toFixed(0)} min`}
                    status="good"
                    description="Remaining cook time + rider travel to your door" />
                <Metric icon="🎯" label="ETA Confidence" value={etaConf}
                    status={etaConf.includes("High") ? "good" : etaConf.includes("Moderate") ? "warning" : "risk"}
                    description="Based on KCI + MRS — how reliable is this ETA?" />
                <Metric icon="😴" label="Rider Idle Risk" value={idleRisk}
                    status={idleRisk === "High" ? "warning" : idleRisk === "Moderate" ? "warning" : "good"}
                    description="Will the rider arrive before food is ready and have to wait?" />
                <Metric icon="⚠️" label="Order Delay Risk" value={delayRisk}
                    status={delayRisk === "High" ? "risk" : "good"}
                    description="Risk that rider arrives after food is ready, causing a cold-food delay" />
                <Metric icon="💸" label="Adaptive System Cost" value={`₹${dynamicTotalCost.toFixed(2)}`}
                    status={dynamicTotalCost < 10 ? "good" : dynamicTotalCost < 30 ? "warning" : "risk"}
                    description="Projected idle + delay cost for this order with adaptive dispatch" />
                <Metric
                    icon={netAdvantage >= 0 ? "💰" : "📉"}
                    label="Adaptive Savings vs Static"
                    value={`${netAdvantage >= 0 ? "+" : ""}₹${netAdvantage.toFixed(2)}`}
                    status={savingsStatus}
                    description="Positive = adaptive model saves money. Negative = static is cheaper for this scenario." />
            </div>

            <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}>
                <span className="text-xl">{kci < 0.4 ? "✅" : kci < 0.7 ? "⚡" : "🔴"}</span>
                <div className="flex-1">
                    <p className="font-semibold text-gray-700 text-sm">
                        Kitchen: {kci < 0.4 ? "Normal" : kci < 0.7 ? "Busy" : "Overloaded"} &nbsp;·&nbsp;
                        Merchant: {mrs > 0.6 ? "Reliable" : mrs > 0.3 ? "Moderate" : "Unreliable"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        KCI {kci.toFixed(2)} · MRS {mrs.toFixed(2)} · Adaptive Bias-Resilient Dispatch Intelligence Active
                    </p>
                </div>
            </div>
        </div>
    );
}
