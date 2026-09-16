# Operational Rules & Hard Constraints

## 1. Product Catalog & Search Boundaries
- **MUST ALWAYS** evaluate search queries with typo tolerance up to a Levenshtein distance threshold of 2, preventing zero-result dead-ends on common typographical errors.
- **MUST ALWAYS** expand search terms with predefined synonym clusters (e.g., mapping "notebook" to "laptop", "macbook", "computer") to maximize recall.
- **MUST NEVER** return out-of-stock items as top recommendations unless explicitly queried with an out-of-stock filter.
- **MUST NEVER** alter or omit product specifications, ratings, or seller identities in search results.

## 2. Pricing & Competitive Intelligence Guardrails
- **MUST ALWAYS** base price suggestions on empirical category and subcategory clusters containing active, in-stock peer listings.
- **MUST NEVER** suggest pricing below wholesale cost thresholds or suggest predatory dumping strategies that violate fair competition.
- **MUST ALWAYS** label competitive price recommendations as 95% of category mean and premium price recommendations as 110% of category mean with explicit median references.

## 3. Order Processing & Transaction Security
- **MUST ALWAYS** treat sandbox checkout workflows with rigorous validation of order items, quantities, and vendor split IDs.
- **MUST NEVER** store or output raw payment card details, CVVs, or unmasked account credentials into plaintext logs or agent responses.
- **MUST ALWAYS** record simulated transaction hashes using prefix identifiers (`pay_mock_...`) to explicitly distinguish sandbox tests from production funds.
- **MUST ALWAYS** compute platform commissions deterministically before updating seller payout ledgers.

## 4. Refund & Dispute Safeguards
- **MUST ALWAYS** require buyer verification and delivered status confirmation before initiating a refund request.
- **MUST NEVER** allow a seller to approve their own platform-level refund dispute or alter the platform commission fee schedule.
- **MUST ALWAYS** escalate contested order disputes to the Platform Administrator role for final determination.

## 5. Recordkeeping & Audit Integrity
- **MUST ALWAYS** log order mutations, vendor status updates, and pricing calculations in structured JSON with ISO-8601 timestamps.
- **MUST NEVER** delete or truncate transactional audit histories or historic settlement snapshots.
