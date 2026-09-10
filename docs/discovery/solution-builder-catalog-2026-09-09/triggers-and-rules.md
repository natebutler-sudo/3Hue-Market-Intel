# Triggers, filters, and Builder rules

This file separates three kinds of signals that should not be conflated in Market Intel:

1. **Buyer triggers** — an external event that can create urgency or budget.
2. **Catalog filters** — the framework, industry, or regulatory language used to find relevant offers.
3. **Builder quote drivers** — profile fields and pricing rules that change quantities or totals.

## Buyer triggers to monitor

- Enterprise deal or renewal blocked by SOC 2 Type II, ISO 27001, or a large customer questionnaire.
- Cyber-insurance renewal with new conditions.
- Investor, lender, or acquirer diligence.
- Portfolio acquisition, exit process, or portfolio-company incident.
- Regulatory examination, MRA, audit finding, or remediation deadline.
- AI rollout pressure, AI customer assurance questions, or an AI governance gap.
- Security incident requiring response leadership or tabletop readiness.
- Technology modernization, continuity, data/AI governance, or delivery-capacity gap.
- Need for a temporary executive, engineering, GRC, AI, or delivery role.

These are working intelligence signals. A public event can suggest relevance; it does not prove active buying intent.

## Framework filters observed in Builder

`ISO 27001` · `ISO 27701` · `SOC 2` · `NIST CSF` · `HIPAA` · `PCI DSS` · `CMMC` · `GDPR` · `CCPA/CPRA` · `ISO 22301` · `NIST RMF`

## Client-profile quantity drivers

The Builder profile row displayed these inputs:

| Profile input | Builder behavior described in the Guide |
| --- | --- |
| Products | Prefills SSPP development and review quantities per system. |
| Entities | Prefills BCP plans, tabletop exercises, and BIA hours. |
| Endpoints | Prefills MDR, MXDR, SIEM, and controls-validation node counts. |
| Managed vendors | Includes the VCP base and computes additional five-vendor blocks. |
| Cloud workloads, users, physical premises, international location | Captured as engagement scope and used with the profile to size work. |

## Pricing and engagement rules observed

- Recurring services can use term selections from one to five years.
- Billing cadence options include monthly, quarterly, semi-annual, and annual; the guide describes commitment discounts for longer prepayment cadence.
- A whole-order recurring commitment discount stacks from term and committed hours, capped at 8%, in addition to the rep discount.
- Line discounts have a 0–30% slider; discounts beyond that are a leadership conversation.
- ITC contractors enforce a 25-hour-per-week minimum. The guide describes a US-based/offshore adjustment and the formula `rate/hour × hours/week × 4.33 × months = engagement total`.
- The guide describes a contractor buyout schedule: 20% of first-year salary below six months, 10% from six to twelve months, and free after twelve months.
- VCP includes five monitored vendors. Additional monitoring is an `$800/month` five-vendor block, with the required base added when missing.
- An orange Builder banner means pricing is draft and must be confirmed before a live quote.

## Drawer-level evidence observed

The Data Mapping & Data Inventory drawer exposed:

- Included: data-flow maps, PII inventory, data-lineage documentation for moderate-plus scope, and multi-entity coverage for large scope.
- Tiers: Small-Scope `$13,475`, Moderate-Scope `$50,050`, Large-Scope `$134,750`.
- Regulatory applicability: GDPR, CCPA/CPRA, HIPAA, ISO 27701.
- Standard industries: SaaS & Technology, Financial Services, Healthcare, Retail & eCommerce, Insurance.
- Related services: DPIA, Data Subject Rights Operations, and Fractional DPO — SOW & Retainer.
- The drawer included market-comparison links, “Why 3HUE” notes, quantity and discount controls, and a live AI price-check action.

