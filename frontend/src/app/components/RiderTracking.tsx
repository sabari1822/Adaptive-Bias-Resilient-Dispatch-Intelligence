"use client";

interface RiderProps {
    riderName: string;
    riderPhone: string;
    riderTravel: number;
    remainingPrepTime: number;
    predictedPrepTime: number;
    dynamicThreshold: number;
}

export default function RiderTracking({
    riderName,
    riderPhone,
    riderTravel,
    remainingPrepTime,
    predictedPrepTime,
    dynamicThreshold,
}: RiderProps) {
    const dispatchTime = (dynamicThreshold / 100) * predictedPrepTime;
    const totalCookTime = predictedPrepTime;
    const arrivalTime = dispatchTime + riderTravel;
    const maxTime = Math.max(totalCookTime, arrivalTime) + 4;

    const toPercent = (val: number) => `${(val / maxTime) * 100}%`;

    const hasIdleZone = arrivalTime < totalCookTime;
    const hasDelayZone = arrivalTime > totalCookTime;

    return (
        <div className="card animate-slide-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900">🏍️ Rider Tracking</h3>
                <span className="badge badge-green text-xs">En Route</span>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl mb-5" style={{ background: "#f8f8f8" }}>
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner"
                    style={{ background: "linear-gradient(135deg, #E23744, #c0303c)", color: "white" }}
                >
                    {riderName.charAt(0)}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{riderName}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.73c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                        </svg>
                        {riderPhone}
                    </div>
                </div>

                <div className="text-3xl animate-rider">🏍</div>

                <div className="text-right">
                    <p className="text-xs text-gray-400">ETA</p>
                    <p className="text-2xl font-black" style={{ color: "#E23744" }}>
                        {riderTravel}
                        <span className="text-sm font-medium text-gray-400"> min</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Travel Time</p>
                    <p className="text-lg font-bold text-gray-800">
                        {riderTravel} <span className="text-xs text-gray-400">min</span>
                    </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Dispatch At</p>
                    <p className="text-lg font-bold" style={{ color: "#E23744" }}>
                        {dispatchTime.toFixed(1)} <span className="text-xs text-gray-400">min</span>
                    </p>
                </div>
            </div>

            <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                    Order Timeline
                </p>

                <div className="relative h-10 rounded-xl overflow-hidden bg-gray-100">
                    
                    <div
                        className="absolute top-0 h-full rounded-l-xl flex items-center justify-center"
                        style={{
                            left: 0,
                            width: toPercent(totalCookTime),
                            background: "linear-gradient(90deg, rgba(226,55,68,0.15), rgba(226,55,68,0.3))",
                            borderRight: "2px dashed #E23744",
                        }}
                    >
                        <span className="text-xs font-semibold" style={{ color: "#E23744" }}>
                            👨‍🍳 Cooking
                        </span>
                    </div>

                    {hasIdleZone && (
                        <div
                            className="absolute top-0 h-full timeline-zone-idle flex items-center justify-center"
                            style={{
                                left: toPercent(arrivalTime),
                                width: toPercent(totalCookTime - arrivalTime),
                            }}
                        >
                            <span className="text-xs font-semibold text-red-500">😴 Idle</span>
                        </div>
                    )}

                    {hasDelayZone && (
                        <div
                            className="absolute top-0 h-full timeline-zone-delay flex items-center justify-center"
                            style={{
                                left: toPercent(totalCookTime),
                                width: toPercent(arrivalTime - totalCookTime),
                            }}
                        >
                            <span className="text-xs font-semibold text-orange-500">⏰ Delay</span>
                        </div>
                    )}

                    <div
                        className="absolute top-0 h-full flex flex-col items-center"
                        style={{ left: toPercent(dispatchTime) }}
                    >
                        <div
                            className="w-0.5 h-full"
                            style={{ background: "#20b038" }}
                        />
                    </div>

                    <div
                        className="absolute top-0 h-full"
                        style={{ left: toPercent(arrivalTime) }}
                    >
                        <div
                            className="w-0.5 h-full"
                            style={{ background: "#f97316" }}
                        />
                    </div>
                </div>

                <div className="relative mt-2" style={{ height: "28px" }}>
                    <span className="absolute text-xs text-gray-400" style={{ left: "0" }}>0 min</span>
                    <span
                        className="absolute text-xs font-semibold"
                        style={{ left: toPercent(dispatchTime), transform: "translateX(-50%)", color: "#20b038" }}
                    >
                        🟢 Dispatch
                    </span>
                    <span
                        className="absolute text-xs font-semibold"
                        style={{ left: toPercent(arrivalTime), transform: "translateX(-50%)", color: "#f97316" }}
                    >
                        🟠 Arrive
                    </span>
                </div>
            </div>
        </div>
    );
}
