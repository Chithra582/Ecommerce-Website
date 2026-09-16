# EXPLAINABILITY — Ecommerce Website

> **Admissibility & Transparency Report for OpenGAP / Agent Passport**  
> *Agent Name:* Ecommerce Website (`ecommerce-website`)  
> *Specification:* OpenGAP v0.1.0  
> *Domain:* Retail & e-commerce / Multi-Vendor Marketplace  

---

## 1. Overview & Architectural Purpose

Ecommerce Website (VendorHub) is an autonomous, local-first multi-vendor e-commerce intelligent agent and marketplace orchestrator. Its purpose is to deliver client-side semantic product discovery, personalized behavioral recommendations, dynamic statistical vendor pricing intelligence, and split-order fulfillment without reliance on opaque, centralized cloud services.

The agent parses user search queries, computes typo-tolerant Levenshtein edit distance matrices against product catalogs, expands intent clusters through semantic synonym mappings, evaluates buyer browsing and purchasing affinities, performs statistical price modeling across competitor listings, and orchestrates simulated multi-vendor checkout and refund transactions with deterministic audit trails.

---

## 2. How the Agent Decides (Decision-Making Logic)

Ecommerce Website operates across a deterministic, multi-stage decision pipeline:

```
[User Query / Shopping Intent] ──> [Semantic NLP & Synonym Expansion] ──> [Fuzzy Typo-Tolerance DP]
                                                                                      │
                                                                                      ▼
[Multi-Vendor Split Fulfillment] <── [Statistical Pricing & Affinity] <── [Relevance Scoring & Ranking]
```

### 2.1 Semantic NLP Search & Typo-Tolerant Intent Resolution
- **Decision:** Determines matching catalog products based on shopper keywords, even in the presence of spelling mistakes, slang, or synonym variants.
- **Model:** Executes client-side dynamic programming Levenshtein distance calculation combined with bidirectional synonym expansion clusters (e.g., mapping `notebook` to `laptop`, `macbook`, `pc`).
- **Rules:**
  - Dynamic programming matrix: $D(i, j) = \min(D(i-1, j)+1, D(i, j-1)+1, D(i-1, j-1) + \text{cost})$.
  - Accepts tokens within an edit distance threshold $\le 2$.
  - Assigns multi-factor relevance scores: $+10$ for title substring match, $+5$ for tag match, $+2$ for featured status, and $+1$ for trending velocity.

### 2.2 Behavioral Personalization & Recommendation Engine
- **Decision:** Determines personalized item rankings for shoppers based on explicit and implicit behavioral telemetry.
- **Rationale:** Prioritizes verified user intent over passive interactions. Purchases contribute double $(+2)$ compared to passive browsing clicks $(+1)$ to generate real-time affinity vectors.
- **Rules:**
  - Affinity scoring: $R(p) = 3 \cdot \mathcal{A}(\text{category}(p)) + 5 \cdot \mathbb{I}_{\text{featured}} + 4 \cdot \mathbb{I}_{\text{trending}} + 2 \cdot \text{rating} + \min(\text{sold}/100, 10)$.
  - Filters out out-of-stock items and currently viewed product IDs before outputting the top $k$ recommended listings.

### 2.3 Statistical Competitor Pricing Intelligence
- **Decision:** Recommends optimal pricing points (Competitive vs. Premium) to marketplace vendors based on peer distribution statistics.
- **Rules:**
  - Clusters competitor products by matching `category` and `subcategory` with positive stock.
  - Computes distribution metrics: minimum ($P_{\min}$), maximum ($P_{\max}$), mean ($\mu$), and median ($\tilde{P}$).
  - Recommends **Competitive Price** at $95\%$ of cluster mean ($\text{round}(0.95 \cdot \mu)$) to optimize sales velocity.
  - Recommends **Premium Price** at $110\%$ of cluster mean ($\text{round}(1.10 \cdot \mu)$) for items with superior ratings ($> 4.5$).

### 2.4 Multi-Vendor Split Fulfillment & Sandbox Settlement
- **Decision:** Evaluates multi-vendor cart payloads, decomposes line items by vendor identifier, computes platform commission fees, and simulates cryptographic payment handshakes.
- **Rules:**
  - Segregates cart items into discrete vendor fulfillment orders.
  - Deducts standard platform commission ($10\%$) from vendor gross amounts.
  - Generates immutable simulated payment receipts prefixed with `pay_mock_...`.
  - Enforces order status progression (`Pending` $\rightarrow$ `Processing` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered`).

---

## 3. Data Sources & Inputs Used

| Data Input | Source | Purpose | Data Handling & Privacy |
|---|---|---|---|
| **Product Catalog** | Git-native mock data (`src/data/products.js`, `agent.yaml`) | Provides product titles, categories, pricing, stock levels, ratings, and tags | Public catalog data; version-controlled in git repository; zero sensitive info |
| **Search Queries & Filters** | Shopper input from browser UI controls | Drives semantic keyword expansion, price range filtering, and relevance ranking | Ephemeral memory processing; zero remote telemetry logging or query tracking |
| **Buyer Browsing & Orders** | Local session storage & in-memory state (`contexts/`) | Constructs personalized affinity vectors and category recommendation scoring | Stored purely client-side; zero external tracking pixels or data exfiltration |
| **Vendor Listings & Payouts** | Vendor portal state & transaction ledgers | Calculates statistical price bands, commissions, and seller revenue distributions | Processed in local sandbox memory; mock payouts isolated from banking networks |

Ecommerce Website complies with privacy-by-design standards:
- **No PII collection:** No raw credit card numbers, CVVs, passwords, or government identifiers are ever stored, transmitted, or logged.
- **Stateless execution:** Catalog filtering, NLP matching, and recommendation generation occur entirely client-side within the browser runtime.

---

## 4. Known Limitations & Failure Modes

Reviewers and engineers should be aware of the following system boundaries:

1. **Typo Distance Bound:**
   - *Limitation:* Search terms exceeding a Levenshtein edit distance of 2 (e.g., severely garbled queries) fail to trigger fuzzy matching.
   - *Mitigation:* The agent falls back to category and tag matching, prompting the user with suggested synonym keywords to refine their query.

2. **Cold-Start Recommendation Scenarios:**
   - *Limitation:* First-time visitors without browsing history or order receipts possess zero category affinity vectors ($\mathcal{A}(c) = 0$).
   - *Mitigation:* The agent gracefully falls back to global catalog heuristics, prioritizing trending products, featured badges, and top-rated items.

3. **Small Sample Size in Pricing Clusters:**
   - *Limitation:* Niche categories with fewer than 2 active competing listings lack statistical validity for price benchmarking.
   - *Mitigation:* The pricing engine returns `null` for clusters with insufficient sample size, preventing skewed or inaccurate pricing recommendations.

4. **Sandbox Gateway Settlement:**
   - *Limitation:* Payment transactions operate in a local simulation sandbox and do not settle real fiat currency or interact with automated clearing houses (ACH).
   - *Mitigation:* All transaction tokens are deterministically prefixed with `pay_mock_...` and state updates are recorded in transparent, local audit ledgers.

---

## 5. Verification, Safety & Human Oversight

- **Real-Time Operational Dashboards:** The platform provides dedicated operational views for Buyers, Vendors, and Platform Admins, allowing continuous verification of order statuses, stock counts, and fee distributions.
- **Segregation of Duties (SOD):** Critical operations strictly adhere to `DUTIES.md` role boundaries (`buyer_assistant`, `vendor_advisor`, `order_executor`, `admin_auditor`), preventing vendors from self-approving refund disputes or manipulating platform fees.
- **Git-Native Auditability:** Every configuration manifest, schema definition, skill module, and pricing rule is tracked through git commits, ensuring complete reproducibility and auditable provenance.
