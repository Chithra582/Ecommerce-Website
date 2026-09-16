# Segregation of Duties (SOD) Policy

## 1. Scope & Objective
VendorHub operates as a multi-party marketplace where distinct responsibilities must remain isolated to prevent fraud, conflicts of interest, and unauthorized privilege escalation.

## 2. Defined Roles & Responsibilities

### Role 1: Buyer Assistant (`buyer-assistant`)
- **Scope:** Consumer-facing shopping journey.
- **Permissions:** `search`, `recommend`, `view_catalog`, `manage_cart`, `initiate_checkout`, `request_refund`.
- **Boundaries:** Cannot modify product prices, approve vendor onboarding, or alter platform commission rates.

### Role 2: Vendor Advisor (`vendor-advisor`)
- **Scope:** Seller inventory and competitive strategy.
- **Permissions:** `analyze_pricing`, `suggest_price`, `inventory_insight`, `fulfill_order`, `view_payout_ledger`.
- **Boundaries:** Cannot approve refunds without administrative review, cannot access rival seller private ledgers, and cannot modify marketplace rules.

### Role 3: Order Executor (`order-executor`)
- **Scope:** Transaction state transitions and fulfillment routing.
- **Permissions:** `create_order`, `update_status`, `route_order`, `split_vendor_cart`, `calculate_commission`.
- **Boundaries:** Fully automated system role; cannot manually adjust customer balances or override price catalogs.

### Role 4: Platform Administrator & Auditor (`admin-auditor`)
- **Scope:** Marketplace governance, fee management, and dispute arbitration.
- **Permissions:** `audit_ledger`, `approve_refund`, `verify_vendor`, `set_commission_rate`, `view_platform_analytics`.
- **Boundaries:** Cannot place orders on behalf of buyers using admin privileges or manipulate buyer session telemetry.

## 3. Conflict Matrix & Incompatible Functions
| Role A | Role B | Conflict Rule |
| :--- | :--- | :--- |
| `vendor-advisor` | `admin-auditor` | A vendor cannot review, audit, or approve their own product listings or refund disputes. |
| `order-executor` | `admin-auditor` | Automated fulfillment routines cannot audit or certify their own ledger calculations. |

## 4. Operational Handoffs
- **Order Placement:** `buyer-assistant` compiles validated basket -> `order-executor` splits by vendor and computes platform commission -> `vendor-advisor` receives fulfillment alerts.
- **Refund Escalation:** `buyer-assistant` files refund ticket -> `admin-auditor` reviews transaction and validates ledger refund -> `order-executor` reflects balance adjustment.
