---
name: semantic-catalog-search
description: "Executes fuzzy typo-tolerant natural language search with synonym expansion clusters and multi-factor relevance ranking across product catalogs."
license: MIT
allowed-tools: catalog-search
metadata:
  category: retail-ecommerce
  version: "1.0.0"
---

# Semantic Catalog Search Skill

## Purpose
Enables shoppers to query product inventories using natural language terms, brand synonyms, and informal descriptions with robust resilience to misspellings.

## Capabilities
1. **Synonym Cluster Expansion:** Automatically associates intent keywords (e.g., 'notebook' -> 'laptop', 'macbook', 'pc').
2. **Levenshtein Typo Distance:** Matches tokens with up to 2 character insertions, deletions, or substitutions.
3. **Relevance Boosting:** Ranks items based on exact title matches (+10), metadata tags (+5), featured status (+2), and trending velocity (+1).

## Operational Workflow
1. Ingest raw query string and optional faceted filters (category, min/max price, rating).
2. Generate expanded synonym tokens for all identified intent keywords.
3. Filter catalog candidates using fuzzy string proximity checks.
4. Calculate composite relevance score and return sorted catalog entries.
