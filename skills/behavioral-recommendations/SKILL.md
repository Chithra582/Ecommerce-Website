---
name: behavioral-recommendations
description: "Generates real-time personalized product recommendations based on weighted browsing sessions, explicit checkout receipts, and product velocity."
license: MIT
allowed-tools: recommend-products
metadata:
  category: retail-ecommerce
  version: "1.0.0"
---

# Behavioral Recommendations Skill

## Purpose
Constructs real-time personalized item feeds tailored to consumer interest clusters while respecting customer privacy.

## Capabilities
1. **Weighted Affinity Scoring:** Weighs explicit purchase events (value: +2) double compared to passive page browsing (value: +1).
2. **Quality & Velocity Factoring:** Blends category interest with customer star ratings, sales volume, and curated badges (featured/trending).
3. **Cold-Start Fallback:** Gracefully degrades to top-selling and highest-rated catalog items when user session history is empty.

## Operational Workflow
1. Aggregate visited product categories from session history.
2. Sum weighted category conversions from historical purchase orders.
3. Compute personalized affinity vectors across available stock items.
4. Filter out currently viewed or out-of-stock items and return the top-ranked candidates.
