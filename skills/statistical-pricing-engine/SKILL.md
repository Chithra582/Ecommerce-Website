---
name: statistical-pricing-engine
description: "Calculates statistical competitor pricing benchmarks and recommends competitive (95%) and premium (110%) price points for marketplace sellers."
license: MIT
allowed-tools: suggest-price
metadata:
  category: retail-ecommerce
  version: "1.0.0"
---

# Statistical Pricing Engine Skill

## Purpose
Enables marketplace sellers to optimize pricing strategies using empirical category distributions, avoiding both overpricing and margin-destructive races to the bottom.

## Capabilities
1. **Peer Cohort Clustering:** Isolates competing items within matching categories and subcategories.
2. **Distribution Metrics:** Determines minimum, maximum, mean, and median price distribution points.
3. **Strategic Thresholds:**
   - **Competitive Price:** 95% of category average, designed to maximize sales volume and initial conversion.
   - **Premium Price:** 110% of category average, suited for high-rating, high-warranty products.

## Operational Workflow
1. Filter catalog for competing products in the target category and subcategory.
2. If fewer than two competitor items exist, return null to prevent skewed advice.
3. Compute summary statistics (min, max, mean, median).
4. Output actionable competitive and premium pricing bands with context.
