# EXPLAINABILITY.md: VendorHub Multi-Vendor Intelligent E-Commerce Agent

> **Protocol:** OpenGAP Spec v0.1.0  
> **Domain Category:** Retail & e-commerce  
> **Agent Name:** `vendorhub-agent`  
> **Platform:** VendorHub Marketplace

---

## 1. Executive Summary & Purpose

VendorHub is an autonomous multi-vendor e-commerce agent platform that powers an intelligent, local-first retail marketplace. Traditional e-commerce architectures rely heavily on centralized, opaque cloud services for search, recommendation scoring, and dynamic repricing. VendorHub instead executes these algorithmic decision engines through transparent, deterministic client-side logic and structured protocol interfaces.

This document provides a comprehensive technical breakdown of:
1. **How the agent decides:** The mathematical models, heuristic algorithms, and decision pipelines governing search, pricing, recommendations, and transaction routing.
2. **The data it uses:** The data schemas, vector representations, session histories, and ledger states consumed across buyer, vendor, and admin interactions.
3. **Operational limitations & boundaries:** Algorithmic thresholds, edge-case failure modes, sandbox parameters, and human-in-the-loop escalation rules.

---

## 2. How the Agent Decides: Decision Pathways & Algorithms

### 2.1. Client-Side Semantic NLP Search & Intent Resolution
When a shopper inputs a search query, the agent executes a 3-stage decision pipeline to interpret user intent, tolerate spelling discrepancies, and rank relevant catalog items:

```
[User Input Query]
       │
       ▼
[Stage 1: Synonym Expansion Mapping]
       │ (Matches intent clusters e.g., 'notebook' -> 'laptop', 'macbook', 'pc')
       ▼
[Stage 2: Fuzzy Typo Tolerance via Levenshtein DP Matrix]
       │ (Calculates edit distances with threshold <= 2 against catalog tokens)
       ▼
[Stage 3: Relevance Scoring & Multi-Factor Boosting]
       │ (Direct match: +10 | Semantic match: +5 | Featured: +2 | Trending: +1)
       ▼
[Ranked Product Result Set]
```

#### Mathematical Formulation (Levenshtein Distance Matrix)
For user search term $s$ of length $m$ and catalog token $t$ of length $n$, the edit distance $D(i, j)$ is computed using dynamic programming:

$$D(i, 0) = i \quad \text{for } 0 \le i \le m$$
$$D(0, j) = j \quad \text{for } 0 \le j \le n$$

$$D(i, j) = \min \begin{cases}
D(i - 1, j) + 1 & \text{(Deletion)} \\
D(i, j - 1) + 1 & \text{(Insertion)} \\
D(i - 1, j - 1) + \text{cost} & \text{(Substitution, where cost = 0 if } s[i] = t[j] \text{ else } 1)
\end{cases}$$

A candidate word is accepted as a match if:
$$\min_{w \in \text{tokens}(p)} D(q, w) \le 2$$

#### Relevance Scoring Function
Each matching product $p$ is assigned a composite relevance score $S_{\text{rel}}(p, q)$:
$$S_{\text{rel}}(p, q) = 10 \cdot \mathbb{I}_{\text{nameContains}}(p, q) + 5 \cdot \mathbb{I}_{\text{metaContains}}(p, q) + 2 \cdot \mathbb{I}_{\text{featured}}(p) + 1 \cdot \mathbb{I}_{\text{trending}}(p)$$

Products are deterministically sorted by descending $S_{\text{rel}}$ before presenting to the buyer.

---

### 2.2. Statistical Vendor Price Intelligence
To empower sellers with real-time competitive positioning without predatory pricing, the agent computes empirical distribution statistics across category clusters:

1. **Cohort Clustering:** Identifies all active, in-stock products within the same primary `category` and secondary `subcategory`, excluding the seller's active product:
   $$\mathcal{C}(c, s) = \{ p \in \mathcal{P} \mid p.\text{category} = c \land p.\text{subcategory} = s \land p.\text{stock} > 0 \land p.\text{id} \ne p_{\text{current}} \}$$
2. **Distribution Metrics:**
   - Minimum: $P_{\min} = \min_{p \in \mathcal{C}} p.\text{price}$
   - Maximum: $P_{\max} = \max_{p \in \mathcal{C}} p.\text{price}$
   - Mean: $\mu = \frac{1}{|\mathcal{C}|} \sum_{p \in \mathcal{C}} p.\text{price}$
   - Median: $\tilde{P} = \text{median}(\{p.\text{price} \mid p \in \mathcal{C}\})$
3. **Strategic Price Recommendations:**
   - **Competitive Price Recommendation:** 
     $$P_{\text{competitive}} = \text{round}(0.95 \cdot \mu)$$
     *Rationale:* Priced 5% beneath market average to accelerate velocity and capture initial search impressions while maintaining sustainable margins.
   - **Premium Price Recommendation:**
     $$P_{\text{premium}} = \text{round}(1.10 \cdot \mu)$$
     *Rationale:* Priced 10% above average for products boasting superior ratings ($> 4.5$), higher warranties, or bundled accessories.

---

### 2.3. Real-Time Behavioral Recommendations Engine
Rather than relying on intrusive tracking pixels, the agent computes affinity vectors locally within the client session by combining implicit and explicit behavioral signals:

#### Weighting Model
- **Implicit Browsing Signal:** Browsing or viewing a product in category $c$ contributes $+1$ affinity point.
- **Explicit Conversion Signal:** Purchasing a product in category $c$ contributes $+2$ affinity points (reflecting twice the intent confidence of a passive click).

#### Composite Recommendation Score
For each prospective candidate product $p$, the recommendation score $R(p)$ is computed as:
$$R(p) = 3 \cdot \mathcal{A}(\text{category}(p)) + 5 \cdot \mathbb{I}_{\text{featured}}(p) + 4 \cdot \mathbb{I}_{\text{trending}}(p) + 2 \cdot \text{rating}(p) + \min\left(\frac{\text{sold}(p)}{100}, 10\right)$$

Where $\mathcal{A}(c)$ represents the accumulated session affinity for category $c$. The top $k$ items ($k=6$ default) with positive inventory are presented in the buyer's personalized feed.

---

### 2.4. Multi-Vendor Order Settlement & Split Routing
When an order containing items from multiple distinct sellers is confirmed:
1. **Cart Splitting:** Items are segregated by `vendorId`.
2. **Platform Commission Calculation:**
   $$\text{Fee}_{\text{platform}} = \text{Total} \times r_{\text{commission}} \quad (\text{default: } 10\%)$$
   $$\text{Payout}_{\text{vendor}} = \text{Total} - \text{Fee}_{\text{platform}}$$
3. **State Transition Engine:**
   $$\text{Pending} \xrightarrow{\text{Vendor Confirm}} \text{Processing} \xrightarrow{\text{Fulfillment}} \text{Shipped} \xrightarrow{\text{Carrier Arrival}} \text{Delivered}$$
4. **Refund Arbitration:** If a buyer requests a refund on a delivered item, the request is routed to the Platform Administrator. The administrator evaluates the reason, and upon approval, reverses the vendor credit and logs the transaction.

---

## 3. Data Architecture & Data Usage

The agent interacts strictly with well-defined, structured data schemas:

| Data Entity | Fields Used by Agent | Purpose in Decision Making |
| :--- | :--- | :--- |
| **Product Record** | `id`, `name`, `category`, `subcategory`, `price`, `rating`, `stock`, `sold`, `vendorId`, `tags`, `synonyms` | Search token indexing, price distribution analysis, stock validation |
| **Buyer Session** | `browsingHistory` (product IDs), `cart` (items, quantities), `wishlist` | Real-time category affinity computation, basket totals |
| **Order Ledger** | `orderId`, `buyerId`, `items`, `vendorSplits`, `totalAmount`, `status`, `paymentHash`, `createdAt` | Fulfillment tracking, historical affinity scoring, split vendor accounting |
| **Vendor Record** | `vendorId`, `businessName`, `status` (`verified`/`pending`), `payoutLedger` | Listing authorization, payout calculation, ledger balancing |
| **Platform Config**| `commissionRate`, `minimumPayoutThreshold`, `sandboxMode` | Platform fee deductions, transaction simulation rules |

### Data Protection & PII Governance
- **Redaction:** Credit card numbers and CVVs are never ingested into decision models or persisted.
- **Local Persistence:** Session data is stored in client memory/local state, preventing unsolicited cloud data exfiltration.
- **Mock Tokenization:** All payment sequences utilize simulated cryptographic hashes (e.g. `pay_mock_...`) to isolate sandbox testing from real financial networks.

---

## 4. Operational Limitations & Boundaries

To ensure safe, compliant operation, the agent operates within defined boundaries:

1. **Typo Tolerance Boundary:**
   - Levenshtein distance matching is bounded at $threshold = 2$.
   - *Limitation:* Queries with more than 2 character typos or severely garbled acronyms will not match and require manual user query refinement.
2. **Cold-Start Recommendations:**
   - In new sessions without prior browsing history or orders ($\mathcal{A}(c) = 0$), the agent falls back to global popularity indicators (featured status, trending badges, and verified buyer ratings).
3. **Statistical Sample Size in Pricing:**
   - If a category cluster contains fewer than 2 active competing products, the pricing advisor returns `null` rather than generating potentially skewed pricing benchmarks.
4. **Sandbox Payment vs Real Settlement:**
   - The payment gateway simulates asynchronous network handshakes via mock timeouts (`setTimeout`). It does not communicate with live banking rails or credit clearing houses.
5. **Human-in-the-Loop Refund Escalation:**
   - The agent cannot autonomously deduct funds from vendor bank accounts for refunds. All contested chargebacks and return requests require human administrative sign-off (`admin-auditor` role) in compliance with marketplace segregation of duties.

---

## 5. Audit & Compliance Statement
VendorHub Agent operates under **OpenGAP Spec v0.1.0** compliance guidelines:
- Adheres to **FINRA 2210** communications fairness (no misleading price representations).
- Enforces strict role isolation between sellers, buyers, and administrators via [`DUTIES.md`](DUTIES.md).
- Maintains immutable structured audit logs for all order lifecycle mutations.
