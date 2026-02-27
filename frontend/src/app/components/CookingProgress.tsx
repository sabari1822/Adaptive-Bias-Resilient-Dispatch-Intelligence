"use client";

import { useState } from "react";

function InfoBadge({ label, value, color, tooltip }: { label: string; value: string | number; color: string; tooltip: string }) {
    return (
        <div className="tooltip-container">
            <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-help"
                style={{ borderColor: `${color}30`, background: `${color}10` }}
            >
                <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-base font-bold" style={{ color }}>
                        {value}
                    </p>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={color} opacity="0.6">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <span className="tooltip-text">{tooltip}</span>
        </div>
    );
}

export default function CookingProgress({
    progress,
    kci,
    mrs,
    predictedPrepTime,
    remainingPrepTime,
}: {
    progress: number;
    kci: number;
    mrs: number;
    predictedPrepTime: number;
    remainingPrepTime: number;
}) {
    const kciColor =
        kci > 0.7 ? "#E23744" : kci > 0.4 ? "#f97316" : "#20b038";
    const mrsColor =
        mrs > 0.7 ? "#E23744" : mrs > 0.4 ? "#f97316" : "#20b038";

    const kciLabel = kci > 0.7 ? "High" : kci > 0.4 ? "Moderate" : "Low";
    const mrsLabel = mrs > 0.7 ? "High Risk" : mrs > 0.4 ? "Moderate" : "Reliable";

    return (
        <div className="card animate-slide-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">🍽️ Kitchen Status</h3>
                <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "#ffeaec", color: "#E23744" }}
                >
                    Live
                </span>
            </div>

            <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Cooking Progress</span>
                    <span className="text-sm font-bold" style={{ color: "#E23744" }}>{progress}%</span>
                </div>
                <div className="relative w-full bg-gray-100 rounded-full h-5 overflow-hidden shadow-inner">
                    <div
                        className="h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-1000"
                        style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, #E23744, #ff8c42)`,
                        }}
                    >
                        {progress > 10 && (
                            <span className="text-white text-xs font-bold">{progress}%</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Predicted Prep</p>
                    <p className="text-xl font-bold text-gray-800">{predictedPrepTime.toFixed(0)}<span className="text-sm font-medium text-gray-400"> min</span></p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Remaining</p>
                    <p className="text-xl font-bold" style={{ color: "#E23744" }}>
                        {remainingPrepTime.toFixed(0)}<span className="text-sm font-medium" style={{ color: "#aaa" }}> min</span>
                    </p>
                </div>
            </div>

            <div className="h-px bg-gray-100 mb-4" />
            <div className="grid grid-cols-2 gap-3">
                <InfoBadge
                    label="Kitchen Congestion Index"
                    value={`${kciLabel} (${kci.toFixed(2)})`}
                    color={kciColor}
                    tooltip="KCI measures real-time kitchen load using prep inflation (how long orders are taking compared to the average), throughput ratio (orders being handled vs. kitchen capacity), and variance spike (how erratic the kitchen timing is). A high KCI means the kitchen is under heavy stress."
                />
                <InfoBadge
                    label="Merchant Reliability Score"
                    value={`${mrsLabel} (${mrs.toFixed(2)})`}
                    color={mrsColor}
                    tooltip="MRS reflects how consistent and predictable the merchant's kitchen performance is over time. It accounts for drift (how far actual times deviate from the predicted), variance instability (erratic order completion patterns), and estimation bias. A low MRS means the merchant is highly reliable."
                />
            </div>
        </div>
    );
}
