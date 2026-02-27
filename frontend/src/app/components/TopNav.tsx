"use client";

export default function TopNav() {
    return (
        <nav
            style={{ background: "linear-gradient(135deg, #E23744 0%, #c0303c 100%)" }}
            className="w-full sticky top-0 z-50 shadow-lg"
        >
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                    <div className="bg-white rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-md">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#E23744">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span style={{ color: "#E23744", fontWeight: 800, fontSize: "16px", letterSpacing: "-0.5px" }}>
                            zomato
                        </span>
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-white text-xs font-medium opacity-80">Order Tracking</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="1" />
                    </svg>
                    <span className="text-white text-sm font-semibold tracking-wide">
                        #ZOT-48273
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-white/15 hover:bg-white/25 transition-all border border-white/20 text-white rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span className="hidden sm:block">Help</span>
                    </button>
                    <button className="bg-white/15 hover:bg-white/25 transition-all border border-white/20 rounded-xl p-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
