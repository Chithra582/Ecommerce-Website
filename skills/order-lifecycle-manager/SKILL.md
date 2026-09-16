---
name: order-lifecycle-manager
description: "Orchestrates multi-vendor split-order routing, platform commission deductions, simulated escrow settlement, and refund escalation workflows."
license: MIT
allowed-tools: order-router
metadata:
  category: retail-ecommerce
  version: "1.0.0"
---

# Order Lifecycle Manager Skill

## Purpose
Manages transactional state transitions for multi-vendor carts, ensuring precise split fulfillment, transparent fee accounting, and regulatory compliance.

## Capabilities
1. **Multi-Vendor Cart Splitting:** Segregates consolidated checkout carts into vendor-specific line item fulfillments.
2. **Platform Commission Deductions:** Automatically calculates marketplace fees (default 10%) before crediting vendor balances.
3. **Sandbox Payment Handshakes:** Generates unique cryptographic test identifiers (`pay_mock_...`) and tracks simulated gateway status.
4. **Refund Arbitration:** Governs refund request lifecycles from buyer submission through administrative review and balance reversal.

## Operational Workflow
1. Validate item availability and pricing integrity during checkout initiation.
2. Execute simulated payment verification and generate mock transaction receipts.
3. Split order by vendor identifier and notify corresponding seller operational dashboards.
4. Track status progressions (`Pending` -> `Processing` -> `Shipped` -> `Delivered`).
5. Process refund dispute tickets through platform admin verification.
