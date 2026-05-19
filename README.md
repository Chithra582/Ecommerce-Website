# 🏪 VendorHub - Premium Multi-Vendor E-Commerce Platform

VendorHub is an advanced, high-fidelity local-first E-Commerce marketplace. It features dedicated operational dashboards for **Buyers, Sellers (Vendors), and Platform Admins**, supercharged by client-side intelligence and simulated payment sandbox architectures.

---

## ✨ Key Capabilities & Technical Innovations

### 🔍 1. Client-Side Semantic NLP Search
Usually, semantic search requires dedicated cloud backends. VendorHub implements this **entirely client-side**:
* **Fuzzy Typo-Tolerance:** Custom dynamic programming Levenshtein distance algorithm matching terms even with user typos (e.g., matching `"ipone"` to `"iPhone"`).
* **Synonym Expansion Mapping:** Automatically matches intent clusters (e.g., searching for `"notebook"` returns `"laptop"`, `"macbook"`, and `"computer"`).
* **Relevance Scoring:** Computes transactional relevance, boosting star ratings, featured, and trending products.

### 🛍️ 2. Real-Time Behavioral Recommendations
Provides high-fidelity product personalization directly on the client:
* **Affinity Vectors:** Analyzes buyer browsing sessions and explicit historic checkouts.
* **Weighted Cohorts:** Explicit purchase signals are weighted twice as high (`+2` value) as simple clicks (`+1` value) to generate user recommendation feeds instantly.

### 📈 3. Statistical Vendor Price Intelligence
Allows sellers to optimize listing prices with zero friction:
* Clusters existing competitor items by category and subcategory.
* Calculates minimum, maximum, average, and median pricing values.
* Suggests **Competitive Price** (95% of average to generate quick sales) and **Premium Price** (110% of average) options.

---

## 🔐 Demo Sandbox Credentials

You can log in as any of the three roles to test the full E-commerce transactional cycle:

| Role | Email Address | Password | Purpose & Capabilities |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@vendorhub.com` | `admin123` | Control global platform commission fees, verify/approve new vendors, handle refund approvals, review platform-wide analytics. |
| **Demo Seller** | `arjun@techzone.com` | `seller123` | Manage products, check dynamic sales statistics, complete order confirmation & delivery, view payout ledger history. |
| **Demo Buyer** | `buyer@gmail.com` | `buyer123` | Browse products with AI search, manage cart/wishlist, configure shipping address default cards, place orders, request refunds. |

---

## 🚀 How to Setup and Run Locally

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Install Dependencies
Navigate to the project root directory and install the required npm packages:
```bash
npm install
```

### 2. Start the Development Server
Launch the local Vite server:
```bash
npm run dev
```
The console will output the local network URL (typically `http://localhost:5173/` or `http://localhost:5174/`). Open this link in your browser to experience the platform.

### 3. Verify Code Standard compliance (ESLint)
To run static analysis checks:
```bash
npm run lint
```

### 4. Build for Production
To compile the production bundles and test optimizations:
```bash
npm run build
```

---

## 💳 Sandbox Mode (Stripe & Razorpay)
The checkout workflow operates in a fully simulated **Sandbox Mode**:
* **No API Keys Needed:** The transaction sequence uses an asynchronous network handshake simulator (`setTimeout`).
* **Mock Ledgers:** Successfully generates safe unique transaction hashes (`pay_mock_...`), handles split orders by vendor, automatically tracks platform commission cuts, and records mock payouts in the seller ledgers.
* **Refund Approvals:** Buyers can click "Refund" on any delivered orders, sending a request to the Admin Panel. The admin can approve/reject, instantly updating the order status and badges!
