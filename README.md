
# Omnigo Admin Portal

## 1️⃣ Project Overview
Omnigo Admin is an enterprise management dashboard enabling system operators to manage merchant onboarding, control commission structures, monitor dynamic platform revenue, and process real-time seller approvals for both commercial restaurants and local home chefs.

---

## 2️⃣ Features
* **Universal Merchant Management:** Dialog-driven CRUD operations supporting both standard Restaurants and Home Chefs (`belongsTo`).
* **Complex Category Builder:** Custom string parser allowing bulk category and subcategory creation (e.g., `Category: Sub1, Sub2 | Category2`).
* **Commission Control:** Configure merchant-specific platform commission rates, delivery minimums, and service fees.
* **Interactive Dialog Systems:** Form handling built on Radix UI and Shadcn UI primitives powered by Zod schema validations.
* **Status Workflows:** One-click approval pipelines transitioning vendors between `pending`, `approved`, and `blocked` states.

---

## 3️⃣ Tech Stack
* **React.js / Next.js:** Core web framework for dashboard rendering.
* **React Hook Form & Zod:** Type-safe form orchestration and schema-based input validations.
* **Shadcn UI & Tailwind CSS:** Accessible component architecture built on top of Radix UI primitives.
* **Lucide React:** Iconography system.

---

## 4️⃣ Architecture
┌──────────────────────────────────────────────────┐
│                   Omnigo Admin                   │
│  ┌──────────────────┐      ┌──────────────────┐  │
│  │ React Hook Form  │ ◄──► │  Zod Resolvers   │  │
│  └────────┬─────────┘      └──────────────────┘  │
└───────────┼──────────────────────────────────────┘
│ Validated HTTP Payload
▼
┌──────────────────────────────────────────────────┐
│                Omnigo Backend API                │
└──────────────────────────────────────────────────┘

---

## 5️⃣ Project Structure
```text
omnigo-admin/
├── src/
│   ├── components/
│   │   ├── ui/           # Radix/Shadcn primitives (Dialog, Button, Input)
│   │   └── dialogs/      # Complex forms (e.g., RestaurantFormDialog.jsx)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility classes and Tailwind merge configs
│   ├── pages/            # Next.js route handlers and dashboard layouts
│   └── services/         # Admin API service wrappers
├── public/               # Static dashboard assets
└── package.json
```

---

## 6️⃣ Installation & Setup
**Prerequisites**
Node.js >= 18.x

**Environment Variables**
Create a .env.local file:

**Code snippet**
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Commands
Bash

# Install dependencies
npm install

# Run dashboard in dev mode
npm run dev
Navigate to http://localhost:3000.

---

## 7️⃣ Usage
Open the Vendors section in the Admin Dashboard.

Click Add Restaurant or Add Home Chef.

Fill out profile data, operational hours, and set commission rates.

Enter categories in the fast-string format: Main Category: Sub1, Sub2 | Second Category: Sub3.

Submit form to update backend record state immediately.

---

## 8️⃣ Screenshots / Demo
(Include screenshots of Vendor Table, Restaurant Form Dialog, and Analytics Overview)

---

## 9️⃣ API Documentation Integration
Key Frontend Form Mappings
RestaurantFormDialog serializes dialog state into backend-ready JSON payloads:

**JSON**
{
  "name": "Spice Route",
  "belongsTo": "restaurant",
  "categories": [
    {
      "categoryName": "Pizza",
      "subCategories": ["BBQ", "Pepperoni"]
    }
  ],
  "commissionRate": 15
}

---

## 🔟 Engineering Decisions
**Pipe-Delimited Fast Category Parsing**: Instead of complex multi-step nested array forms, a simple custom string syntax parser converts text inputs straight into Mongoose-compatible subdocument schemas seamlessly.

**Controlled Form Sync**: Integrated useEffect reset cycles with React Hook Form to dynamically refresh form states when switching between edit targets or modal openings.

---

## 1️⃣1️⃣ Testing
**Tools**: Cypress (E2E) + React Testing Library.

**Command**:

**Bash**
npm run test

---

## 1️⃣2️⃣ Limitations & Future Improvements
**Current Limitation**: Bulk CSV upload operations for multi-item menus are currently in development.

**Planned Improvements**: Live financial chart dashboards analyzing platform commission earnings per region.
