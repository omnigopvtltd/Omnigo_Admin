// Deterministic mock data so the UI has something realistic to render
// before the real endpoints exist. Shapes mirror what the API is expected
// to return, so swapping to live data later shouldn't require UI changes.

import { getOrders } from "./orders";

const RESTAURANTS = [
  "Spice Route", "Burger Barn", "Green Bowl", "Noodle House",
  "Pizza Point", "Taco Fiesta", "Sushi Central", "The Grill Co.",
];

const CUSTOMERS = [
  "Ayesha Khan", "Bilal Ahmed", "Sara Malik", "Usman Tariq",
  "Hina Raza", "Omar Sheikh", "Zainab Ali", "Fahad Iqbal",
  "Mehak Noor", "Danish Aziz",
];

const RIDERS = [
  "Ali Hassan", "Junaid Baig", "Kamran Shah", "Waqas Anjum", "Sana Yousuf",
];

const STATUSES = [
  "pending", "accepted", "preparing", "ready",
  "picked_up", "on_the_way", "delivered", "cancelled",
];

// const orders = getOrders();
// console.log("Orders Length", orders.length());


function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rand = seededRandom(42);

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

// export const mockOrders = getOrders((order, i) => {
//   const id = order.orderNumber;
//   const status = order.status;
//   const total = order.totalAmount;
//   const daysAgo = order.updatedAt;
//   const date = new Date();
//   date.setDate(date.getDate() - daysAgo);
//   date.setHours(randomInt(8, 23), randomInt(0, 59));

//   return {
//     id,
//     customer: pick(CUSTOMERS),
//     restaurant: pick(RESTAURANTS),
//     rider: status === "pending" || status === "accepted" || status === "delivered" || status === "ongoing" || status === "preparing" ? "-" : pick(RIDERS),
//     status,
//     total,
//     items: randomInt(1, 6),
//     createdAt: date.toISOString(),
//   };
// }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// export const mockOrders = getOrders;

export const mockDashboardStats = {
  todaysRevenue: { value: 284650, change: 12.4 },
  todaysOrders: { value: 342, change: 8.1 },
  activeRiders: { value: 47, change: -2.3 },
  onlineRestaurants: { value: 118, change: 4.6 },
  pendingOrders: { value: 23, change: 0 },
  cancelledOrders: { value: 9, change: -18.2 },
  avgDeliveryTime: { value: 27, unit: "min", change: -5.1 },
  customerGrowth: { value: 6.8, unit: "%", change: 1.2 },
};

export const mockRevenueSeries = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const base = 38000 + Math.sin(i / 4) * 9000 + i * 900;
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Math.round(base + randomInt(-3000, 3000)),
    orders: Math.round(180 + Math.sin(i / 3) * 40 + randomInt(-15, 15)),
  };
});

// export const mockRecentOrders = mockOrders.slice(0, 6);
// export const mockRecentOrders = mockOrders;

////////////////////////////////////////////////////////////

// ---------------------------------------------------------------
// Restaurants & Products (Step 2)
// ---------------------------------------------------------------

const CUISINES = ["Fast Food", "Pizza", "Chinese", "BBQ", "Desi", "Desserts", "Healthy", "Japanese"];
const CITIES = ["Karachi", "Lahore", "Islamabad", "Faisalabad"];
const RESTAURANT_STATUSES = ["pending", "approved", "blocked"];

function fakeObjectId(seedStr) {
  // 24-char hex string, shaped like a real Mongo ObjectId so swapping to
  // live data later doesn't change how ids are handled anywhere in the UI.
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return (hash.toString(16).padStart(8, "0") + seedStr.length.toString(16).padStart(4, "0")).padEnd(24, "0").slice(0, 24);
}

export const mockRestaurants = RESTAURANTS.map((name, i) => {
  const id = fakeObjectId(`restaurant-${name}`);
  const status = i < 6 ? "approved" : RESTAURANT_STATUSES[randomInt(0, 2)];

  return {
    _id: id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: `${name} — a popular spot known for fast, reliable delivery and consistent quality.`,
    logo: `https://picsum.photos/seed/${encodeURIComponent(name)}-logo/120/120`,
    coverImage: `https://picsum.photos/seed/${encodeURIComponent(name)}-cover/480/240`,
    cuisines: [pick(CUISINES), pick(CUISINES)].filter((v, idx, arr) => arr.indexOf(v) === idx),
    contact: {
      phone: `+92 3${randomInt(10, 99)} ${randomInt(1000000, 9999999)}`,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@partner.example`,
    },
    address: {
      street: `${randomInt(1, 200)} Main Boulevard`,
      area: "Block " + String.fromCharCode(65 + randomInt(0, 8)),
      city: pick(CITIES),
      zipCode: String(randomInt(10000, 99999)),
      country: "Pakistan",
    },
    openingHours: { open: "09:00", close: "23:30", is24Hours: false },
    isOpen: rand() > 0.15,
    deliveryTime: { min: randomInt(15, 25), max: randomInt(30, 55) },
    minimumOrder: randomInt(0, 3) * 5,
    deliveryFee: randomInt(1, 6),
    commissionRate: randomInt(10, 22),
    rating: { average: Number((3.6 + rand() * 1.3).toFixed(1)), count: randomInt(20, 900) },
    documents: [{ name: "Business License", url: "#", verified: rand() > 0.3 }],
    status,
    isFeatured: i < 3,
    createdAt: new Date(Date.now() - randomInt(5, 400) * 86400000).toISOString(),
  };
});

const PRODUCT_CATALOG = [
  ["Classic Cheeseburger", "Fast Food", 6.5],
  ["Chicken Zinger Burger", "Fast Food", 7.0],
  ["Margherita Pizza", "Pizza", 9.5],
  ["Pepperoni Pizza", "Pizza", 11.0],
  ["Kung Pao Chicken", "Chinese", 8.75],
  ["Vegetable Chow Mein", "Chinese", 6.25],
  ["BBQ Beef Platter", "BBQ", 13.0],
  ["Chicken Seekh Kebab", "BBQ", 7.5],
  ["Chicken Biryani", "Desi", 5.5],
  ["Beef Nihari", "Desi", 7.25],
  ["Chocolate Lava Cake", "Desserts", 4.5],
  ["New York Cheesecake", "Desserts", 5.0],
  ["Grilled Salmon Bowl", "Healthy", 10.5],
  ["Quinoa Salad", "Healthy", 6.75],
  ["Salmon Nigiri Set", "Japanese", 12.0],
  ["Vegetable Sushi Roll", "Japanese", 8.0],
];

export const mockProducts = Array.from({ length: 48 }, (_, i) => {
  const [baseName, category, basePrice] = PRODUCT_CATALOG[i % PRODUCT_CATALOG.length];
  const restaurant = pick(mockRestaurants);
  const hasDiscount = rand() > 0.65;
  const price = Number((basePrice + randomInt(-1, 3)).toFixed(2));
  const name = i >= PRODUCT_CATALOG.length ? `${baseName} (${restaurant.name})` : baseName;

  return {
    _id: fakeObjectId(`product-${i}-${baseName}`),
    name,
    description: `${baseName} made fresh to order, served hot with our signature sides.`,
    images: [`https://picsum.photos/seed/${encodeURIComponent(baseName)}-${i}/300/300`],
    restaurantId: { _id: restaurant._id, name: restaurant.name, logo: restaurant.logo, status: restaurant.status },
    category,
    subcategory: "",
    price,
    discountPrice: hasDiscount ? Number((price * 0.85).toFixed(2)) : null,
    addOns: [],
    isVeg: category === "Healthy" || rand() > 0.7,
    tags: [rand() > 0.7 ? "Bestseller" : null, rand() > 0.85 ? "New" : null].filter(Boolean),
    isAvailable: rand() > 0.1,
    preparationTime: randomInt(10, 35),
    rating: { average: Number((3.5 + rand() * 1.4).toFixed(1)), count: randomInt(5, 400) },
    status: rand() > 0.08 ? "active" : "inactive",
    createdAt: new Date(Date.now() - randomInt(1, 300) * 86400000).toISOString(),
  };
});

// ---------------------------------------------------------------
// Finance, Live Tracking & Promotions (Step 3)
// ---------------------------------------------------------------

export const mockRestaurantEarnings = mockRestaurants.map((r) => {
  const grossSales = randomInt(800, 12000);
  const commissionAmount = Number(((grossSales * r.commissionRate) / 100).toFixed(2));
  return {
    restaurantId: r._id,
    name: r.name,
    logo: r.logo,
    commissionRate: r.commissionRate,
    ordersCount: randomInt(15, 220),
    itemsSold: randomInt(30, 500),
    grossSales,
    commissionAmount,
    netPayout: Number((grossSales - commissionAmount).toFixed(2)),
    walletBalance: randomInt(0, 2000),
  };
});

export const mockRiderEarnings = RIDERS.map((name, i) => ({
  riderId: fakeObjectId(`rider-${name}`),
  name,
  phone: `+92 3${randomInt(10, 99)} ${randomInt(1000000, 9999999)}`,
  deliveredCount: randomInt(20, 300),
  totalEarned: randomInt(200, 3000),
  walletBalance: randomInt(0, 500),
}));

const WITHDRAW_STATUSES = ["pending", "approved", "rejected"];

export const mockWithdrawRequests = Array.from({ length: 22 }, (_, i) => {
  const isRider = i % 2 === 0;
  const source = isRider ? pick(mockRiderEarnings) : pick(mockRestaurantEarnings);
  const status = i < 6 ? "pending" : WITHDRAW_STATUSES[randomInt(0, 2)];
  const daysAgo = randomInt(0, 20);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return {
    _id: fakeObjectId(`withdraw-${i}`),
    riderId: isRider ? { _id: source.riderId, name: source.name, phone: source.phone } : null,
    restaurantId: !isRider ? { _id: source.restaurantId, name: source.name, logo: source.logo } : null,
    amount: randomInt(50, 800),
    method: pick(["bank_transfer", "cash", "mobile_wallet"]),
    accountDetails: isRider ? "Meezan Bank •••• 4821" : "HBL Business •••• 7710",
    status,
    adminNote: status !== "pending" ? (status === "approved" ? "Processed" : "Details could not be verified") : "",
    createdAt: date.toISOString(),
    processedAt: status !== "pending" ? date.toISOString() : null,
  };
});

const TX_SOURCES = ["manual", "withdrawal", "order_earning", "refund", "commission"];

export const mockTransactions = Array.from({ length: 60 }, (_, i) => {
  const isRider = i % 2 === 0;
  const source = isRider ? pick(mockRiderEarnings) : pick(mockRestaurantEarnings);
  const type = rand() > 0.45 ? "credit" : "debit";
  const daysAgo = randomInt(0, 25);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return {
    _id: fakeObjectId(`tx-${i}`),
    userId: isRider ? { _id: source.riderId, name: source.name } : null,
    restaurantId: !isRider ? { _id: source.restaurantId, name: source.name } : null,
    type,
    amount: randomInt(20, 600),
    reason: type === "credit" ? "Order earning" : "Withdrawal processed",
    balanceAfter: randomInt(0, 2000),
    source: pick(TX_SOURCES),
    createdAt: date.toISOString(),
  };
});

// Live Tracking — simulated positions on a stylized (non-geographic) grid,
// since real map tiles need a Maps API key. See LiveTrackingPage for notes.
export const mockLiveRiders = RIDERS.map((name, i) => ({
  riderId: fakeObjectId(`rider-${name}`),
  name,
  phone: `+92 3${randomInt(10, 99)} ${randomInt(1000000, 9999999)}`,
  vehicleType: pick(["bike", "car"]),
  x: randomInt(10, 90), // percentage position on the simulated map
  y: randomInt(10, 90),
  activeOrder: i < 4 ? {
    orderId: fakeObjectId(`live-order-${i}`),
    orderNumber: `ORD${30000 + i}`,
    customerName: pick(CUSTOMERS),
    restaurantName: pick(RESTAURANTS),
    destinationX: randomInt(10, 90),
    destinationY: randomInt(10, 90),
    etaMinutes: randomInt(4, 25),
  } : null,
}));

// Promotions — Coupons
const COUPON_TYPES = ["percentage", "fixed", "free_delivery", "cashback"];

export const mockCoupons = [
  { code: "WELCOME50", type: "percentage", value: 50, maxDiscount: 10, minOrderAmount: 15 },
  { code: "FLAT5", type: "fixed", value: 5, maxDiscount: null, minOrderAmount: 20 },
  { code: "FREESHIP", type: "free_delivery", value: 0, maxDiscount: null, minOrderAmount: 10 },
  { code: "CASHBACK10", type: "cashback", value: 10, maxDiscount: 5, minOrderAmount: 25 },
  { code: "WEEKEND20", type: "percentage", value: 20, maxDiscount: 8, minOrderAmount: 15 },
  { code: "NEWUSER", type: "fixed", value: 3, maxDiscount: null, minOrderAmount: 0 },
].map((c, i) => {
  const start = new Date();
  start.setDate(start.getDate() - randomInt(0, 10));
  const end = new Date();
  end.setDate(end.getDate() + randomInt(5, 30));

  return {
    _id: fakeObjectId(`coupon-${c.code}`),
    ...c,
    description: `${c.code} — ${c.type === "free_delivery" ? "free delivery" : c.type + " discount"} promo`,
    usageLimit: i % 2 === 0 ? randomInt(100, 500) : null,
    usedCount: randomInt(5, 90),
    perUserLimit: 1,
    applicableRestaurants: [],
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    isActive: rand() > 0.15,
    createdAt: start.toISOString(),
  };
});

// Promotions — Campaigns
export const mockCampaigns = [
  { title: "Ramadan Feast Specials", type: "banner" },
  { title: "New Restaurant: Sushi Central", type: "push_notification" },
  { title: "Weekend Free Delivery", type: "banner" },
  { title: "Win Back Inactive Users", type: "email" },
].map((c, i) => {
  const start = new Date();
  start.setDate(start.getDate() - randomInt(0, 15));
  const end = new Date();
  end.setDate(end.getDate() + randomInt(3, 25));

  return {
    _id: fakeObjectId(`campaign-${c.title}`),
    ...c,
    description: `${c.title} — targeted promotional push`,
    bannerImage: `https://picsum.photos/seed/${encodeURIComponent(c.title)}/480/200`,
    linkedCoupon: i < mockCoupons.length ? { _id: mockCoupons[i].code, code: mockCoupons[i].code } : null,
    targetAudience: pick(["all", "new_users", "inactive_users"]),
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    isActive: rand() > 0.2,
    createdAt: start.toISOString(),
  };
});

// ---------------------------------------------------------------
// Rider Module — CRUD, wallet, verification, sessions (Step 4)
// ---------------------------------------------------------------

const CNIC_STATUSES = ["not_submitted", "pending", "verified", "rejected"];
const VEHICLE_TYPES = ["bike", "bike", "bike", "car"];

export const mockRidersFull = RIDERS.map((name, i) => {
  const cnicStatus = i === 0 ? "not_submitted" : i === 1 ? "pending" : i === 4 ? "rejected" : "verified";
  const faceStatus = i === 0 ? "not_submitted" : i === 1 ? "verified" : i === 4 ? "rejected" : "verified";
  const joinDate = new Date();
  joinDate.setDate(joinDate.getDate() - randomInt(10, 300));

  return {
    _id: fakeObjectId(`rider-${name}`),
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@rider.example`,
    phone: `+92 3${randomInt(10, 99)} ${randomInt(1000000, 9999999)}`,
    role: "rider",
    isBlocked: i === 4,
    wallet: { balance: randomInt(0, 60) },
    riderProfile: {
      vehicleType: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
      vehiclePlate: `LEA-${randomInt(1000, 9999)}`,
      vehicleModel: pick(["Honda CD70", "Yamaha YBR", "Suzuki Alto", "Toyota Vitz"]),
      isOnline: rand() > 0.4,
      rating: { average: Number((3.8 + rand() * 1.2).toFixed(1)), count: randomInt(20, 400) },
      cnicVerification: {
        cnicNumber: cnicStatus === "not_submitted" ? "" : "35202-1234567-1",
        frontImage: cnicStatus === "not_submitted" ? "" : `https://picsum.photos/seed/cnic-front-${i}/300/190`,
        backImage: cnicStatus === "not_submitted" ? "" : `https://picsum.photos/seed/cnic-back-${i}/300/190`,
        status: cnicStatus,
        submittedAt: cnicStatus !== "not_submitted" ? joinDate.toISOString() : null,
        rejectionReason: cnicStatus === "rejected" ? "CNIC image was blurry — please resubmit" : "",
      },
      faceVerification: {
        image: faceStatus === "not_submitted" ? "" : `https://picsum.photos/seed/face-${i}/240/240`,
        status: faceStatus,
        submittedAt: faceStatus !== "not_submitted" ? joinDate.toISOString() : null,
        rejectionReason: faceStatus === "rejected" ? "Face not clearly visible in photo" : "",
      },
    },
    activeOrders: i < 3 ? randomInt(0, 2) : 0,
    deliveredCount: randomInt(15, 260),
    createdAt: joinDate.toISOString(),
  };
});

export const mockRiderTransactions = Array.from({ length: 40 }, (_, i) => {
  const rider = pick(mockRidersFull);
  const sourceOptions = ["topup", "order_float", "order_earning", "session_bonus", "manual", "withdrawal"];
  const source = pick(sourceOptions);
  const type = ["order_earning", "session_bonus", "topup"].includes(source) ? "credit" : (rand() > 0.5 ? "credit" : "debit");
  const daysAgo = randomInt(0, 20);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const reasonMap = {
    topup: "Wallet top-up",
    order_float: "Order float held",
    order_earning: "Payment collected + delivery fee",
    session_bonus: "Session bonus — completed 6 orders",
    manual: type === "credit" ? "Manual credit" : "Manual debit",
    withdrawal: "Withdrawal processed",
  };

  return {
    _id: fakeObjectId(`rtx-${i}`),
    userId: rider._id,
    riderName: rider.name,
    type,
    amount: randomInt(3, 45),
    reason: reasonMap[source],
    balanceAfter: randomInt(0, 80),
    source,
    createdAt: date.toISOString(),
  };
});

export const mockRiderSessions = [
  { title: "Weekend Rush Bonus", requiredOrders: 6, bonusAmount: 25, minWalletBalance: 20, timeLimitHours: 8 },
  { title: "Lunch Hour Sprint", requiredOrders: 6, bonusAmount: 18, minWalletBalance: 15, timeLimitHours: 4 },
  { title: "Late Night Delivery Push", requiredOrders: 6, bonusAmount: 30, minWalletBalance: 25, timeLimitHours: 6 },
].map((s, i) => {
  const start = new Date();
  start.setDate(start.getDate() - randomInt(0, 5));
  const end = new Date();
  end.setDate(end.getDate() + randomInt(3, 20));

  return {
    _id: fakeObjectId(`session-${s.title}`),
    ...s,
    description: `Complete ${s.requiredOrders} deliveries within the session window to earn a $${s.bonusAmount} bonus.`,
    isActive: i !== 2,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    createdAt: start.toISOString(),
  };
});

export const mockSessionParticipations = mockRiderSessions.flatMap((session, sIdx) =>
  mockRidersFull.slice(0, 3).map((rider, rIdx) => {
    const ordersCompleted = sIdx === 0 ? [6, 3, 0][rIdx] : randomInt(0, session.requiredOrders);
    const status = ordersCompleted >= session.requiredOrders ? "completed" : (rIdx === 2 ? "abandoned" : "in_progress");
    const joined = new Date();
    joined.setHours(joined.getHours() - randomInt(1, 40));

    return {
      _id: fakeObjectId(`participation-${sIdx}-${rIdx}`),
      sessionId: { _id: session._id, title: session.title, requiredOrders: session.requiredOrders, bonusAmount: session.bonusAmount },
      riderId: { _id: rider._id, name: rider.name, phone: rider.phone },
      status,
      ordersCompleted: Math.min(ordersCompleted, session.requiredOrders),
      requiredOrders: session.requiredOrders,
      bonusAmount: session.bonusAmount,
      bonusPaid: status === "completed",
      joinedAt: joined.toISOString(),
      completedAt: status === "completed" ? new Date().toISOString() : null,
      abandonedAt: status === "abandoned" ? new Date().toISOString() : null,
      abandonReason: status === "abandoned" ? "Left by rider" : "",
    };
  })
);

// ---------------------------------------------------------------
// Chat & Call Module
// ---------------------------------------------------------------

const CONVO_TYPES = ["customer_rider", "customer_admin", "rider_admin"];

const SAMPLE_LINES = {
  customer_rider: [
    "Hi, I'm at the gate, which building?",
    "I'm outside the blue gate on the left",
    "Perfect, on my way up",
    "Please leave it with the security guard if I don't answer",
    "Thank you so much!",
  ],
  customer_admin: [
    "My order hasn't moved in 20 minutes, can you check?",
    "Looking into it now, one moment please",
    "The restaurant confirmed it's out for delivery",
    "Okay thank you, I'll wait",
    "It just arrived, thanks for the help!",
  ],
  rider_admin: [
    "The customer's address doesn't exist, can you confirm?",
    "Let me check with the customer and get back to you",
    "Customer confirmed — it's actually Block C not Block B",
    "Got it, heading there now",
    "Delivered successfully",
  ],
};

export const mockConversations = Array.from({ length: 18 }, (_, i) => {
  const type = CONVO_TYPES[i % CONVO_TYPES.length];
  const customer = pick(CUSTOMERS);
  const rider = pick(RIDERS);
  const lines = SAMPLE_LINES[type];
  const lastLine = pick(lines);
  const lastSenderRole = type === "customer_rider" ? pick(["customer", "rider"]) : type === "customer_admin" ? pick(["customer", "admin"]) : pick(["rider", "admin"]);
  const minutesAgo = randomInt(1, 600);
  const sentAt = new Date(Date.now() - minutesAgo * 60000);

  return {
    _id: fakeObjectId(`convo-${i}`),
    type,
    customerId: type !== "rider_admin" ? { _id: fakeObjectId(`cust-${customer}`), name: customer, phone: `+92 3${randomInt(10, 99)} ${randomInt(1000000, 9999999)}` } : null,
    riderId: type !== "customer_admin" ? { _id: fakeObjectId(`rider-${rider}`), name: rider, phone: `+92 3${randomInt(10, 99)} ${randomInt(1000000, 9999999)}` } : null,
    adminId: type !== "customer_rider" && rand() > 0.4 ? { _id: "admin-001", name: "Admin User" } : null,
    orderId: rand() > 0.3 ? { _id: fakeObjectId(`ord-ref-${i}`), orderNumber: `ORD${31000 + i}` } : null,
    lastMessage: { text: lastLine, senderRole: lastSenderRole, sentAt: sentAt.toISOString() },
    unreadCount: { customer: randomInt(0, 1) * randomInt(1, 3), rider: randomInt(0, 1) * randomInt(1, 3), admin: i < 4 ? randomInt(1, 3) : 0 },
    status: "active",
    updatedAt: sentAt.toISOString(),
  };
}).sort((a, b) => new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt));

export const mockMessages = {};
mockConversations.forEach((convo) => {
  const lines = SAMPLE_LINES[convo.type];
  const roles = convo.type === "customer_rider" ? ["customer", "rider"] : convo.type === "customer_admin" ? ["customer", "admin"] : ["rider", "admin"];
  const baseTime = Date.now() - randomInt(60, 700) * 60000;

  mockMessages[convo._id] = lines.map((text, i) => ({
    _id: fakeObjectId(`msg-${convo._id}-${i}`),
    conversationId: convo._id,
    senderRole: roles[i % 2],
    senderId: roles[i % 2] === "customer" ? convo.customerId?._id : roles[i % 2] === "rider" ? convo.riderId?._id : "admin-001",
    text,
    attachments: [],
    createdAt: new Date(baseTime + i * randomInt(60000, 300000)).toISOString(),
  }));
});

const CALL_STATUSES = ["completed", "completed", "missed", "rejected"];

export const mockCallLogs = Array.from({ length: 24 }, (_, i) => {
  const convo = pick(mockConversations);
  const status = CALL_STATUSES[i % CALL_STATUSES.length];
  const minutesAgo = randomInt(5, 4000);
  const startedAt = new Date(Date.now() - minutesAgo * 60000);
  const duration = status === "completed" ? randomInt(15, 420) : 0;

  const callerIsFirst = rand() > 0.5;
  const partyA = convo.type === "customer_rider" ? convo.customerId : convo.type === "customer_admin" ? convo.customerId : convo.riderId;
  const partyB = convo.type === "customer_rider" ? convo.riderId : { _id: "admin-001", name: "Admin User", phone: "" };

  return {
    _id: fakeObjectId(`call-${i}`),
    conversationId: convo._id,
    conversationType: convo.type,
    callerId: callerIsFirst ? partyA : partyB,
    callerRole: convo.type === "customer_rider" ? (callerIsFirst ? "customer" : "rider") : convo.type === "customer_admin" ? (callerIsFirst ? "customer" : "admin") : (callerIsFirst ? "rider" : "admin"),
    receiverId: callerIsFirst ? partyB : partyA,
    status,
    startedAt: startedAt.toISOString(),
    durationSeconds: duration,
  };
}).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
