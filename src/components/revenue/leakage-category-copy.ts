import type { LeakageCategory } from "@/lib/types";

/** Plain-English, one-line explanation for each leakage category. Category
 * names are internal shorthand and not self-explanatory to a first-time
 * viewer, so every place a category appears should surface this text. */
export const LEAKAGE_CATEGORY_COPY: Record<LeakageCategory, string> = {
  missed_escalator:
    "An annual price increase clause exists but was never applied. Billing has stayed flat while the contract allowed for more.",
  discount_creep:
    "A renewal landed at the same or lower value than the prior term, with no documented reason for holding pricing down.",
  payment_term_mismatch:
    "Payment terms work against cash flow, long net terms, high late fees, or language the risk engine already flagged.",
  sla_penalty_recoverable:
    "A service credit remedy exists in the contract, but there is no record of it ever being claimed against downtime.",
  unclaimed_credit:
    "An audit or true-up right was never exercised, so billing corrections it could have surfaced are likely still uncaptured.",
  renewal_uplift_risk:
    "A contract lapsed with no renewal on file. If the relationship is still active, it is running with no enforceable pricing.",
  auto_renewal_exposure:
    "An auto-renewing contract is approaching or has passed its notice window, the last chance to renegotiate before terms lock in again.",
};
