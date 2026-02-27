"use client";

import { useEffect, useState } from "react";

const steps = [
    {
        id: 1,
        label: "Confirmed",
        icon: "✓",
        description: "Order placed",
        time: "8:42 PM",
    },
    {
        id: 2,
        label: "Preparing",
        icon: "🍳",
        description: "Chef is cooking",
        time: "8:44 PM",
    },
    {
        id: 3,
        label: "Rider Assigned",
        icon: "🏍",
        description: "Ravi Kumar",
        time: null,
    },
    {
        id: 4,
        label: "Picked Up",
        icon: "📦",
        description: "En route to you",
        time: null,
    },
    {
        id: 5,
        label: "Delivered",
        icon: "🏠",
        description: "Enjoy your meal!",
        time: null,
    },
];

export default function OrderStatusTracker({ progress }: { progress: number }) {
    const [activeStep, setActiveStep] = useState(2);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (progress < 40) setActiveStep(2);
        else if (progress < 70) setActiveStep(2);
        else if (progress < 85) setActiveStep(3);
        else if (progress < 100) setActiveStep(4);
        else setActiveStep(5);
    }, [progress]);

    return (
        <div className="card animate-slide-in">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900">Order Status</h3>
                <span className="badge badge-red text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-active inline-block" />
                    Live Tracking
                </span>
            </div>

            <div className="relative">
                
                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-100" />
                <div
                    className="absolute top-6 left-6 h-0.5 transition-all duration-700"
                    style={{
                        background: "linear-gradient(90deg, #20b038, #E23744)",
                        width: `${Math.min(((activeStep - 1) / 4) * 100, 100)}%`,
                    }}
                />

                <div className="relative flex justify-between">
                    {steps.map((step) => {
                        const isCompleted = step.id < activeStep;
                        const isActive = step.id === activeStep;
                        const isPending = step.id > activeStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2" style={{ width: "20%" }}>
                                
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500 relative z-10 ${mounted ? "animate-bounce-in" : ""
                                        }`}
                                    style={{
                                        animationDelay: `${step.id * 100}ms`,
                                        background: isCompleted
                                            ? "#20b038"
                                            : isActive
                                                ? "#E23744"
                                                : "#f5f5f5",
                                        borderColor: isCompleted
                                            ? "#20b038"
                                            : isActive
                                                ? "#E23744"
                                                : "#e0e0e0",
                                        boxShadow: isActive
                                            ? "0 0 0 4px rgba(226,55,68,0.15)"
                                            : "none",
                                    }}
                                >
                                    {isCompleted ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                            <polyline points="20 6 9 17 4 12" strokeWidth="2.5" stroke="white" fill="none" />
                                        </svg>
                                    ) : (
                                        <span className={isPending ? "opacity-40 grayscale" : ""}>{step.icon}</span>
                                    )}
                                    {isActive && (
                                        <span
                                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                                            style={{ background: "#E23744", animation: "pulse-dot 1.5s infinite" }}
                                        />
                                    )}
                                </div>

                                <div className="text-center">
                                    <p
                                        className="text-xs font-semibold"
                                        style={{
                                            color: isCompleted ? "#20b038" : isActive ? "#E23744" : "#aaa",
                                        }}
                                    >
                                        {step.label}
                                    </p>
                                    <p className="text-xs text-gray-400 hidden sm:block mt-0.5">{step.description}</p>
                                    {step.time && (
                                        <p className="text-xs font-medium mt-0.5" style={{ color: "#20b038" }}>
                                            {step.time}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                        Preparing your food ({progress}%)
                    </span>
                    <span className="text-xs text-gray-400">~18 mins left</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                            width: `${progress}%`,
                            background: "linear-gradient(90deg, #E23744, #ff6b6b)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
