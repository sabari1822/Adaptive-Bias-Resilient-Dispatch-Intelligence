"use client";

export default function MapSection() {
    return (
        <div className="card animate-slide-in" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">📍 Live Map</h3>
                <span className="badge badge-green text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" style={{ animation: "pulse-dot 1.2s infinite" }} />
                    GPS Active
                </span>
            </div>

            <div className="map-container w-full" style={{ height: "280px" }}>
                
                {[...Array(6)].map((_, i) => (
                    <div
                        key={`h${i}`}
                        className="map-road"
                        style={{
                            top: `${15 + i * 14}%`,
                            left: "0",
                            right: "0",
                            height: "2px",
                            opacity: 0.4,
                        }}
                    />
                ))}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={`v${i}`}
                        className="map-road"
                        style={{
                            left: `${10 + i * 16}%`,
                            top: "0",
                            bottom: "0",
                            width: "2px",
                            opacity: 0.4,
                        }}
                    />
                ))}

                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 280"
                    preserveAspectRatio="none"
                    style={{ zIndex: 2 }}
                >
                    <defs>
                        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                            <polygon points="0 0, 6 2, 0 4" fill="#E23744" />
                        </marker>
                    </defs>
                    
                    <path
                        d="M 80 200 Q 120 170 160 150 Q 200 110 240 120 Q 280 130 310 90"
                        fill="none"
                        stroke="#E23744"
                        strokeWidth="3"
                        strokeDasharray="6 3"
                        markerEnd="url(#arrowhead)"
                        opacity="0.85"
                    />
                </svg>

                <div
                    className="absolute flex flex-col items-center"
                    style={{ left: "17%", top: "62%", zIndex: 10, transform: "translate(-50%, -100%)" }}
                >
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white"
                        style={{ background: "#20b038" }}
                    >
                        🍛
                    </div>
                    <div
                        className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#20b038", whiteSpace: "nowrap" }}
                    >
                        Restaurant
                    </div>
                    <div
                        className="w-0 h-0"
                        style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #20b038" }}
                    />
                </div>

                <div
                    className="absolute flex flex-col items-center animate-rider"
                    style={{ left: "53%", top: "48%", zIndex: 10, transform: "translate(-50%, -100%)" }}
                >
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white"
                        style={{ background: "#E23744" }}
                    >
                        🏍
                    </div>
                    <div
                        className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#E23744", whiteSpace: "nowrap" }}
                    >
                        Ravi (Rider)
                    </div>
                    <div
                        className="w-0 h-0"
                        style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #E23744" }}
                    />
                </div>

                <div
                    className="absolute flex flex-col items-center"
                    style={{ left: "80%", top: "28%", zIndex: 10, transform: "translate(-50%, -100%)" }}
                >
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white"
                        style={{ background: "#6366f1" }}
                    >
                        🏠
                    </div>
                    <div
                        className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full text-white"
                        style={{ background: "#6366f1", whiteSpace: "nowrap" }}
                    >
                        You
                    </div>
                    <div
                        className="w-0 h-0"
                        style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #6366f1" }}
                    />
                </div>

                <div
                    className="absolute bottom-3 right-3 text-xs font-medium"
                    style={{ color: "rgba(0,0,0,0.3)", zIndex: 5 }}
                >
                    © Zomato Maps
                </div>

                <div
                    className="absolute right-3 top-3 flex flex-col gap-1"
                    style={{ zIndex: 5 }}
                >
                    {["+", "−"].map((btn) => (
                        <button
                            key={btn}
                            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-gray-700 shadow-md hover:bg-gray-50"
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-5 mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#20b038" }} /> Restaurant
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#E23744" }} /> Rider
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#6366f1" }} /> Your Location
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-0.5 w-6" style={{ background: "#E23744", borderTop: "2px dashed #E23744" }} /> Route
                </div>
            </div>
        </div>
    );
}
