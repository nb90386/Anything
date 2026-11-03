# C04 — IEEPA tariff refund recovery + ongoing customs compliance for small importers

Retrieval date: 2026-11-02. Items marked [unverified] were not confirmed against a primary source. Vendor blogs are treated as marketing claims.

## 1. Legal gate: can software let an importer self-file, and can a non-broker prepare for a fee?

**What CAPE requires.** CAPE is a tab inside the ACE Secure Data Portal. The importer of record (IOR) or the licensed broker that filed the entries uploads a CSV "CAPE Declaration" of entry numbers (max 9,999 each, multiple allowed). Refunds are ACH-only; the refund account is entered via the "Importer" sub-account in ACE and is separate from duty-payment ACH. Routing to a third party requires a CBP Form 4811 designation already on the entry summaries (no post-filing corrections). Valid refunds issue in ~60–90 days; status via ACE REV-603/REV-615 reports (CBP IEEPA page; CSMS #68315804; CBP notice; H&K; Norton Rose; GHY).

**Self-filing by the IOR is permitted.** CBP's own FAQ says only the IOR or the broker that filed the entries can submit a CAPE Declaration; a license is not required for an importer transacting customs business on its own behalf (CBP IEEPA page; STR Part 111 course materials). Attorneys and third-party consultants cannot file CAPE declarations (Airlift USA, Tariffrefundcredits [vendor sources]). So the product's core loop — importer logs into its own ACE account and uploads a CSV the software generated — is legal in principle.

**The risk is in "preparing" for a fee.** 19 CFR 111.1 defines "customs business" to include classification, valuation, entry, and refund/drawback of duties, "and the preparation of documents" relating to those activities, while excluding mere electronic transmission of data and "corporate compliance activity" (Cornell LII; govinfo Part 111; Federal Register 2022 broker modernization). CBP ruling H068278 held that an unlicensed software provider that "prepares the entry from the data supplied by the importer" is conducting customs business; a related ruling says actual classification of merchandise for an entry filed with CBP by an unlicensed party is precluded, and another held that electronic data creation in ABI must be done by a licensed provider (rulings.cbp.gov H068278, H272798; Tradewin blog). Penalties attach to anyone conducting customs business for another without a license, and brokers may not create fee arrangements that benefit an unlicensed person (STR Part 111 materials).

**Practical read.** (a) Software that reads the importer's own ACE entry report, flags IEEPA lines and produces a CSV the importer uploads itself sits closest to the "transmission/corporate compliance" exclusions; Flexport's free calculator already does this without a license. (b) A service that *prepares* the refund request or protest for a fee, or assigns HTS codes used on live entries, is inside H068278 and needs a licensed broker (or attorney for protests/CIT work). Ginger Control already works this way: software triages entries, "a licensed partner files it" (gingercontrol.com). The startup must partner with or hold a broker license, or stay strictly self-serve and avoid "we prepare your claim" language. No CBP ruling specific to CAPE-CSV software was found [unverified gap].

**Finally liquidated entries.** CAPE Phase 1 (Apr 20) covered unliquidated/within-window entries; Phase 2 (Jun 29) added entries flagged for reconciliation; Phase 3 (Oct 6) is limited to IORs with finally liquidated entries for which the CIT has ordered reliquidation — i.e., plaintiffs only (~7,000 importers across ~4,000 CIT suits, per DWT/Dentons; CBP accepted 477 Phase 3 declarations covering 425,517 entries by noon on launch day, per C.H. Robinson/Warner Norcross). CBP's position is that it lacks authority to reliquidate finally liquidated entries without a court order (Foley; Diaz Trade Law). For non-litigants the only administrative tool is a protest within 180 days of liquidation; after that, a 28 USC 1581(i) suit at the CIT, which an importer can file only through counsel (Coppersmith; Strix Smart; Troutman).

**Appeal status (late Oct 2026).** DOJ filed its opening brief in the consolidated Federal Circuit appeal (No. 26-1895) on Aug 10, 2026, contesting the CIT's authority to order universal refunds for entries liquidated and past the 80-day window; refunds to non-litigants on those entries are stayed pending the partial appeal (Jackson Walker; NatLawReview; Foley; DWT). No Federal Circuit decision was found as of 2026-11-02; commentators expect resolution not before year-end and a possible Supreme Court petition. On Oct 8, 2026 Judge Eaton certified a class of IORs that paid IEEPA duties Feb 1, 2025–Feb 19, 2026 and have not sued (Steptoe; BakerHostetler; Miller & Chevalier; Thompson Hine; DWT). The class gives small non-litigants a path without their own suit, but creates no payment right yet and is expected to be appealed. The Tariff Refund Act of 2026 (S.3905) would mandate refunds within 180 days; status unknown [unverified].

## 2. Competitors selling refund recovery

| Competitor | What it does | Pricing | Notes |
|---|---|---|---|
| **Flexport** (flexport.com/refunds) | Free Tariff Refund Calculator (upload CBP 2025 Entry Report); AI-assisted audit and CAPE filing as licensed broker | Calculator free; filing price not published; claims "$700M total refunds" [company claim] | Launched Jan 20, 2026. Already does the startup's step 1 for free. |
| **UPS / FedEx / DHL** | File as broker for entries they filed; pass refunds via portals | FedEx: no fee; DHL: chargeable if customer asks DHL to file; brokerage fees non-refundable | Cover courier entries where the small business was often not the IOR. Class actions pending over fees. |
| **Accounting firms** (CLA, BDO, Baker Tilly, Aprio, RSM, Cherry Bekaert, Plante Moran, Brady Ware) | Advisory, ACE setup, CAPE filing with broker/counsel | Hourly/fixed [not published] | Mid-market and public companies. |
| **Law firms** (Kaplan Gore, Great Lakes Customs Law, Diaz Trade Law, Troutman, J. Chang Law) | CIT suits, protests, Phase 3 declarations | Kaplan Gore: fixed, blended hourly+%, or straight contingency | Own the finally-liquidated/CIT path SaaS cannot touch. |
| **Contingency shops** (tariffrecoverycheck.com, tariffapprove.com, tariffrecoverygroup.com, tariffrecoveryteam.com, TariffsTool) | Lead-gen plus attorney/broker filing | "Pay only on recovery"; percentages not published | Thin marketing sites. |
| **1st Capital Financial** | File-and-fund, bridge financing against filed claims | Minimum estimated claim $100k | Sidley notes a secondary claims market estimated up to $100B. |
| **Ginger Control** (gingercontrol.com) | Sorts entries by refund route/deadline, prepares file, licensed partner files; also HTS tool (GingerLite $150/mo, 300 credits) | Refund pricing not published | Closest analogue to C04's full concept, with the broker-partner structure. |
| **TariffCenter.ai** | AI HS classification, landed cost, refund tracking for small importers | From $49/mo | Vendor claim. |
| **TariffLens** (tarifflens.ai) | HTS classification SaaS; de minimis and refund content | Basic $99/mo; Growth $1,245/mo | Vendor claim. |
| **Tariff Refund Suite** | Self-serve CAPE prep kit | $197 one-time | Vendor claim; compares itself to "$5,000–$15,000 per refund cycle" broker fees. |
| **Strix Smart, Caspian (meetcaspian.com), Cubic (gocubic.io), Wove, UNIS calculator, TariffsTool, Tariffrefundcredits** | Calculators, guides, lead-gen | Mostly free/not published | Crowded SEO layer. |
| **Liberty Justice Center "Operation Refund Rescue"** | Nonprofit platform for small businesses with finally liquidated entries | Free | Removes a reason to pay anyone for the hardest cases. |

No funding rounds for Ginger Control, Gaia Dynamics, Spindle, TariffLens or any IEEPA-refund startup were found [unverified]. Duty-drawback specialists (Alliance, Charter, Comstock & Theakston) did not surface in results.

## 3. Ongoing compliance market (post de minimis)

The compliance leg competes with Zonos Classify (~$500/mo, 1,000 free classifications), Avalara (price unpublished), HTS Hero ($39/mo for 10), SimplyDuty (£0.10/call), Tarifflo ($125/item or $7,500/yr for 500), GingerLite, TariffLens, TariffCenter.ai, Flexport's free tools, and general LLMs. Brokers charge roughly $50–200 per SKU for classification and $25–500 per entry (vendor blogs; ranges conflict). Vendor blogs report the de minimis timeline inconsistently (Aug 29, 2025; Feb 24, 2026; June 24, 2026); the June 24, 2026 suspension and 2027 repeal are the working assumption [not confirmed against a CBP primary document]. Evidence of small-importer demand is anecdotal (vendor examples of formal-entry costs exceeding duty on a $500 shipment); no CBP statistics on new entry counts or complaint volumes were found. Classification for a live entry by an unlicensed party is itself "customs business," so the compliance product must be decision support the importer or its broker finalizes.

## 4. Would the startup win against each?

- **Flexport:** No on calculators (free, 10 months earlier) and no on filing (licensed broker, scale). Startup could only win importers who refuse to move brokerage to Flexport.
- **Couriers:** No for courier-cleared parcels; those payors are generally not IORs.
- **Accounting/law firms:** Different customer; they ignore sub-$50k claims, which is the startup's space but also where contingency economics fail.
- **Ginger Control / TariffCenter / TariffLens / Tariff Refund Suite:** Direct peers with 6–9 months head start, low prices, and in Ginger's case the licensed-partner structure. Winning requires either a broker license or a markedly better ACE-export parser and ACH-setup guidance; nothing proprietary surfaced.
- **Liberty Justice Center + class action:** Erode willingness to pay for the finally-liquidated segment.

## 5. Could incumbents ship it in weeks?

Yes. Flexport already has the ACE-report parser and a broker license; Zonos/Avalara could add a CSV refund module; couriers own the courier IOR relationships. CBP's CSV format is trivial. What incumbents skip is ACH/4811 hand-holding and portal setup for very small IORs, a services problem, not a software moat.

## 6. Size and time limit of the small-importer refund opportunity

~330,000 IORs paid ~$166B across ~53M entries (White & Williams citing CBP court filings). By May 26, 2026 more than 157,000 CAPE declarations had been filed and ~$85B accepted (Baker Tilly); by early October CBP had accepted ~$136.6B and transmitted ~$126B to Treasury (C.H. Robinson/Warner Norcross). Roughly 76% of dollars are therefore already in or through CAPE. The remaining cohort is: (a) ~20,184 refunds worth ~$1.3B held for missing ACH as of Sept 15 (the task's Oct 2 figure of 20,362/$1.1B was not located in results [unverified]); (b) non-litigant finally liquidated entries, stayed pending appeal and now dependent on class treatment; (c) IORs that never filed. Only ~7,000 importers sued, so over 97% are non-litigants, but the remaining dollars sit in the ACH-hold and finally-liquidated buckets. Phases 1–2 have no stated deadline, but entries keep liquidating and the 180-day protest clock runs; the small-importer window effectively closes within 12–18 months. The ACH-hold bucket is one-time ($1.3B/20,184 ≈ $64k average, long tail) and CBP, brokers and the class mechanism are all working to clear it.

## Verdict

Maybe-to-no. The legal gate is passable only as pure self-serve software or with a licensed broker partner; the refund wedge is largely already captured (free Flexport calculator, broker filing, ~76% of dollars processed) and the residual segments are either blocked by litigation or being served by nonprofits and a class action; the compliance follow-on is a crowded $39–$500/month market with no demonstrated small-importer volume data.

## Sources (retrieved 2026-11-02)

- https://www.cbp.gov/trade/programs-administration/trade-remedies/ieepa-duty-refunds
- https://content.govdelivery.com/accounts/USDHSCBP/bulletins/4126a9c
- https://www.cbp.gov/sites/default/files/2026-04/trade_information_notice_cape_508c.pdf
- https://www.cbp.gov/sites/default/files/2026-04/webinar_ieepa_refunds_overview_4.17.pdf
- https://www.cbp.gov/sites/default/files/2026-04/ieepa_refunds_factsheet_0.pdf
- https://www.hklaw.com/en/insights/publications/2026/04/cape-has-arrived-navigating-the-next-phase-of-ieepa-duty-refunds
- https://www.nortonrosefulbright.com/en-us/knowledge/publications/44450c73/cbp-issues-tariff-refund-instructions
- https://www.ghy.com/trade-compliance/cbp-cape-ieepa-refund-progress/
- https://www.bdo.com/insights/tax/ieepa-tariff-refunds-frequently-asked-questions
- https://www.chrobinson.com/en-us/resources/insights-and-advisories/client-advisories/2026q3/09-17-26-cbp-cape-phase-3-ieepa-refunds/
- https://www.wnj.com/updates/ieepa-tariff-refunds-cbp-clarifies-cape-phase-3-refund-process-for-liquidated-entries/
- https://www.bakertilly.com/insights/ieepa-refunds
- https://www.cbh.com/insights/alerts/ieepa-tariff-refund-update-cape-phase-iii-open/
- https://www.troutman.com/insights/a-capeable-solution-how-we-can-help-with-cbps-cape-phase-3-rollout-for-cit-plaintiffs-seeking-ieepa-tariff-refunds/
- https://www.troutman.com/insights/to-sue-or-not-to-sue-that-is-the-question-for-ieepa-tariff-refunds/
- https://www.thompsonhinesmartrade.com/2026/09/cbp-confirms-october-6-2026-launch-of-phase-3-of-the-ieepa-tariff-refund-process/
- https://www.thompsonhinesmartrade.com/2026/10/cit-certifies-a-tariff-refund-class/
- https://www.jw.com/news/insights-ieepa-refund-order/
- https://natlawreview.com/article/ieepa-tariff-refunds-critical-developments-phase-iii-delays-and-action-steps
- https://natlawreview.com/article/what-every-multinational-should-know-about-governments-ieepa-federal-circuit-appeal
- https://www.foley.com/insights/publications/2026/06/what-every-multinational-should-know-about-the-governments-appeal-of-judge-eatons-universal-ieepa-tariff-refunds-order-and-why-it-is-claiming-it-can-keep-billions-of-dolla/
- https://diaztradelaw.com/doj-seeks-to-vacate-ieepa-refund-injunctions/
- https://www.dwt.com/insights/2026/10/cit-certifies-ieepa-duty-refund-importer-class
- https://www.steptoe.com/en/news-publications/global-trade-and-investment-law-blog/relief-in-sight-cit-certifies-class-for-ieepa-tariff-refunds-for-certain-importers.html
- https://www.bakerlaw.com/insights/importers-move-to-certify-class-action-in-ieepa-tariff-refund-litigation/
- https://www.millerchevalier.com/publication/trade-compliance-flash-court-international-trade-certifies-class-action-ieepa-tariff
- https://www.strtrade.com/trade-news-resources/str-trade-report/october/ieepa-refunds-trick-or-treat
- https://www.congress.gov/crs-product/IF13150
- https://rulings.cbp.gov/ruling/H068278
- https://rulings.cbp.gov/ruling/H272798
- https://www.law.cornell.edu/definitions/index.php?width=840&height=800&iframe=true&def_id=bb319309f6cb059962b93d33f3090f5d&term_occur=999&term_src=Title%3A19%3AChapter%3AI%3APart%3A111%3ASubpart%3AA%3A111.4
- https://www.govinfo.gov/content/pkg/CFR-2025-title19-vol1/pdf/CFR-2025-title19-vol1-part111.pdf
- https://www.federalregister.gov/documents/2022/10/18/2022-22445/modernization-of-the-customs-broker-regulations
- https://info.strtrade.com/rs/723-WOZ-446/images/STR%20Broker%20Course-%20Part%20111.pdf
- https://blog.tradewin.net/cbp-clarifies-definition-of-transacting-customs-business
- https://tariffrefundcredits.com/guides/broker-vs-consultant
- https://tariffrefundcredits.com/answers/broker-file
- https://airliftusa.com/tariff-updates/tariff-refunds
- https://www.coppersmith.com/cape-phase-3-ieepa-refunds-october-2026/
- https://strixsmart.com/resources/blog/cape-phase-3-liquidated-entries
- https://strixsmart.com/resources/blog/de-minimis-suspension-self-filing
- https://www.flexport.com/refunds
- https://www.businesswire.com/news/home/20260120812295/en/Flexport-Launches-Tariff-Refund-Calculator-Giving-Businesses-Early-Insight-Into-Possible-Tariff-Refunds
- https://www.freightwaves.com/news/flexport-launches-tariff-refund-calculator-as-supreme-court-weighs-tariff-authority
- https://www.flexport.com/webinars/cape-explained-refunds-common-issues-and-next-steps-for-importers
- https://www.ups.com/us/en/supplychain/logistics-solutions/customs-brokerage/us-customs-tariff-refunds
- https://www.fedex.com/en-us/shipping/international/us-tariffs-impact.html
- https://www.dhl.com/discover/en-il/Customs-and-Shipping-Guides/IEPPA-Updates-USA
- https://wwd.com/sourcing-journal/logistics/tariff-refunds-ups-fedex-dhl-cbp-customs-ieepa-tariffs-cape-claims-portal-class-action-lawsuit-administrative-fees-1238926182/
- https://libertyjusticecenter.org/terra-update/what-to-do-if-you-paid-ieepa-tariffs-through-fedex/
- https://wwd.com/sourcing-journal/industry-news/liberty-justice-center-operation-refund-rescue-small-businesses-tariffs-1239392340/
- https://www.claconnect.com/en/resources/articles/26/tariff-refunds
- https://www.aprio.com/insights-events/ieepa-duties-paid-a-step-by-step-guide-to-get-money-back-ins-article-tax/
- https://www.rsmus.com/insights/services/business-tax/tariffs-refund-portal
- https://plantemoran.com/explore-our-thinking/insight/2026/08/tariff-update-new-trade-developments-affecting-importers
- https://bradyware.com/tariff-refund-faq/
- https://www.kaplangore.com/importers-that-paid-ieepa-duties-may-qualify-for-refunds
- https://greatlakescustomslaw.com/ieepa-tariff-refunds/
- https://www.jchanglaw.com/post/ieepa-tariff-refunds-cape-phase-3-class-action
- https://tariffrecoverycheck.com/
- https://www.tariffapprove.com/
- https://tariffrecoverygroup.com/
- https://tariffrecoveryteam.com/
- https://1stcapitalfinancial.com/ieepa-tariff-refund/
- https://www.sidley.com/en/insights/newsupdates/2026/04/ieepa-tariff-refund-claims-key-considerations-for-lenders-borrowers-and-claims-purchasers
- https://gingercontrol.com/services/ieepa-refund
- https://gingercontrol.com/blog/ieepa-tariff-refund-guide
- https://gingercontrol.com/blog/ai-hts-classification-tools-compared
- https://gingercontrol.com/blog/de-minimis-repeal-small-importer-impact
- https://www.tarifflens.ai/blog/best-ai-hts-classification-tools-2026
- https://www.tarifflens.ai/compare
- https://www.tariffcenter.ai/
- https://www.tariffstool.com/
- https://www.meetcaspian.com/blog/cape-phase-3-ieepa-refunds-october-6
- https://www.gocubic.io/blog/ieepa-tariff-refund-class-action-importers-2026
- https://wove.com/blog/ieepa-tariff-refund-calculator
- https://unisco.com/ieepa-refund-calculator
- https://www.whiteandwilliams.com/resources-alerts-IEEPA-Tariff-Refunds-CBP-Launches-CAPE-Process
- https://www.uschamber.com/economy/tariff-refunds-faq-what-small-businesses-need-to-know-after-supreme-courts-ruling
- https://ratetell.com/blog/automated-hs-code-classification
- https://www.newbuyingagent.com/resources/de-minimis-rule-changes-2026-what-the-end-of-the-800-threshold-means-for-your-china-imports
- https://beancount.io/blog/2026/07/08/ieepa-tariff-refund-cbp-cape-portal-small-importer-guide
