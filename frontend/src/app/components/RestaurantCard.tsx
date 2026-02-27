"use client";

export default function RestaurantCard() {
    const order = {
        restaurant: "Paradise Biryani House",
        cuisine: "Biryani • Mughlai • North Indian",
        location: "Banjara Hills, Hyderabad",
        items: [
            { name: "Chicken Dum Biryani", qty: 2, price: 349 },
            { name: "Chicken 65", qty: 1, price: 249 },
            { name: "Raita", qty: 2, price: 49 },
        ],
        total: 1045,
        eta: "30–35 min",
        rating: 4.5,
        reviews: "12.4K",
    };

    const subtotal = order.items.reduce((a, i) => a + i.price * i.qty, 0);
    const taxes = Math.round(subtotal * 0.05);

    return (
        <div className="card animate-slide-in">
            
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #fff5f5, #ffeaec)" }}
                    >
                        🍛
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{order.restaurant}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{order.cuisine}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-1 badge badge-green text-xs">
                                <span>★</span>
                                <span>{order.rating}</span>
                                <span className="opacity-60">({order.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                {order.location}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-right flex-shrink-0">
                    <div
                        className="text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{ color: "#E23744" }}
                    >
                        ETA
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{order.eta}</div>
                    <div className="text-xs text-gray-400 mt-0.5">mins away</div>
                </div>
            </div>

            <div className="h-px bg-gray-100 my-4" />

            <div className="space-y-2.5 mb-4">
                {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-2 h-2 rounded-sm border-2 flex-shrink-0"
                                style={{ borderColor: "#20b038" }}
                            />
                            <span className="text-sm text-gray-700 font-medium">
                                {item.qty}× {item.name}
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery fee</span>
                    <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>GST & charges</span>
                    <span>₹{taxes}</span>
                </div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between font-bold text-gray-900">
                    <span>Total Paid</span>
                    <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
            </div>
        </div>
    );
}
