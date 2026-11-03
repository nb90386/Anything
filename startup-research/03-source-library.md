# 03 — Source Library

Every URL cited in this research, grouped by the file that cites it. Retrieval dates: 2026-11-02/03 unless noted. Problem-record sources carry the agent-assigned source type and source date. URLs were taken from search results or GitHub pages; none were constructed by hand. Inclusion here does not mean a source was independently verified beyond what the citing file states.

## A. Problem database sources (from data/problems-*.json)

| Problem | Source type | Source date | URL | What it shows |
|---|---|---|---|---|
| DEV-01 | primary_statistic | 2026-10-30 | https://openssf.org/press-release/2026/10/30/new-lf-research-survey-shows-generative-ai-cuts-open-source-coding-time-in-half-but-25-of-incoming-pull-requests-are-considered-ai-slop/ | LF Research survey: ~25% of incoming PRs considered AI slop, 31% at large projects; 61% of contributors claim to review AI code before submi |
| DEV-01 | firsthand_complaint | 2026-10-17 | https://github.com/curl/curl/discussions/23458 | curl maintainer announces LOW/MEDIUM vulnerability reports go public from Oct 26 because the small team cannot handle report volume in secre |
| DEV-01 | industry_commentary | 2026-01-21 | https://www.theregister.com/2026/01/21/curl_ends_bug_bounty/ | curl ends its HackerOne bug bounty (paid >$100k since 2019) citing a flood of AI slop reports; reports move to GitHub, unpaid. |
| DEV-01 | firsthand_complaint | 2026 | https://raw.githubusercontent.com/curl/curl/master/docs/BUG-BOUNTY.md | Current curl policy: no bounties because bounties give 'too strong incentives to find and make up problems in bad faith that cause overload  |
| DEV-01 | industry_commentary | 2026-02 | https://www.opensourceforu.com/2026/02/github-weighs-pull-request-kill-switch-as-ai-slop-floods-open-source/ | GitHub considering repo-level options to disable or restrict pull requests in response to AI-generated PR floods. |
| DEV-01 | firsthand_complaint | 2026-03-18 | https://github.com/curl/curl/discussions | curl community discussion proposing a ban on LLM-written code in curl. |
| DEV-02 | firsthand_complaint | 2026-10-27 | https://github.com/anthropics/claude-code/issues/105342 | Subagent test fixture ran rm -rf ~ via sh -c inside cargo test; worktree isolation did not contain it; home dir, unpushed commits, gh login  |
| DEV-02 | firsthand_complaint | 2026-10-24 | https://github.com/anthropics/claude-code/issues/104848 | User asked to free disk space; agent recursively deleted entire game project (no remote), also damaged a live app; rewind only tracks agent  |
| DEV-02 | firsthand_complaint | 2026-10-24 | https://github.com/anthropics/claude-code/issues/104811 | Auto-mode permission classifier false positives: 121 of 149 denials benign. |
| DEV-02 | industry_commentary | 2026-04 | https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-powered-ai-coding-agent-deletes-entire-company-database-in-9-seconds-backups-zapped-after-cursor-tool-powered-by-anthropics-claude-goes-rogue | PocketOS: Cursor agent deleted production DB and volume backups via one Railway API call using a credential found in the codebase. |
| DEV-02 | industry_commentary | 2026 | https://www.penligent.ai/hackinglabs/ai-agent-deleted-a-production-database-the-real-failure-was-access-control/ | Analysis framing the PocketOS incident as an access-control failure: no environment scoping, no confirmation, overbroad credential. |
| DEV-02 | primary_statistic | 2026-10 | https://github.com/anthropics/claude-code/security/advisories | 36 advisories including Jun 2026 'Sandbox Escape via Git Worktree Path Confusion' and Oct 2026 TOCTOU writes outside workspace, showing the  |
| DEV-03 | published_study | 2026-04 | https://labs.cloudsecurityalliance.org/research/csa-research-note-comment-control-github-prompt-injection-20/ | CSA research note: GitHub AI agents (Claude Code Security Review, Gemini CLI Action, Copilot Agent) exfiltrate CI credentials via injected P |
| DEV-03 | industry_commentary | 2026 | https://venturebeat.com/security/ai-agent-runtime-security-system-card-audit-comment-and-control-2026 | Three coding agents leaked secrets through one prompt injection; Claude Code action posted its own API key as a PR comment. |
| DEV-03 | industry_commentary | 2026-10 | https://thehackernews.com/2026/10/leaked-litellm-master-key-let-attackers.html | LiteLLM master key committed May 27 2026, unrevoked, used Oct 10 2026 to steal GitHub tokens and hijack release pipeline. |
| DEV-03 | industry_commentary | 2026-11 | https://securityboulevard.com/2026/11/litellms-second-breach-began-with-a-key-nobody-revoked/ | Follow-up framing: LiteLLM's second 2026 breach stemmed from an unrevoked committed key. |
| DEV-03 | primary_statistic | 2026-06-13 | https://github.com/anthropics/claude-code/security/advisories | GHSA-fg94-h982-f3mm: out-of-band data exfiltration via pre-approved HuggingFace domain in WebFetch. |
| DEV-03 | primary_statistic | 2026-10-27 | https://github.com/BerriAI/litellm/security/advisories | LiteLLM advisories incl. Critical 'Unauthenticated file read leaks master key' (Oct 27 2026) and Critical salt-key privilege escalation (Sep |
| DEV-03 | speculation | 2026 | https://www.refontelearning.com/blog/ai-coding-agents-leaking-cicd-secrets | Secondary blog citing GitGuardian: 3.2% secret-leak rate in Claude Code-assisted commits vs 1.5% baseline; unverified. |
| DEV-04 | firsthand_complaint | 2026-08-05 | https://github.com/jaredwray/keyv/issues/2051 | Maintainer's incident thread: keyv@6.0.0 first infected, payload in .claude/math_init.js launched by SessionStart hook and VS Code task, spr |
| DEV-04 | published_study | 2026-08-04 | https://www.microsoft.com/en-us/security/blog/2026/08/04/chaindrop-supply-chain-compromise-anatomy-self-propagating-worm/ | Microsoft analysis: 400+ packages, preinstall-hook execution, stolen npm tokens and OIDC publishing abused for propagation. |
| DEV-04 | published_study | 2026-08 | https://www.elastic.co/security-labs/threat-command/shai-hulud-chaindrop-npm-supply-chain | Elastic: CHAINDROP identified Aug 4 2026; worm commits authored as 'claude' with message 'chore: update config'. |
| DEV-04 | primary_statistic | 2026-08 | https://www.aikido.dev/blog/keyv-and-friends-compromised-in-npm-supply-chain-attack | At least 444 packages across 1,381 versions compromised; exfil to public GitHub repo tagged 'Shai-Hulud: Here We Go Again'. |
| DEV-04 | published_study | 2026-05 | https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem | TanStack wave: compromised packages carried valid SLSA Build Level 3 provenance, first validly-attested malicious npm worm. |
| DEV-04 | primary_statistic | 2026-08 | https://www.csa.gov.sg/alerts-and-advisories/advisories/ad-2026-009/ | Singapore CSA national advisory on the keyv/Shai-Hulud worm; recommends credential rotation and rebuilds. |
| DEV-04 | published_study | 2026-07-15 | https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/ | Unit 42 timeline of 2026 npm worm waves (late April, May 11, May 19, June). |
| DEV-05 | published_study | 2026-07-01 | https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-tool-poisoning-auto-execution-20260701/ | CSA note on tool poisoning and IDE auto-execution; Slack-to-Cursor MCP config hijack demo. |
| DEV-05 | published_study | 2026 | https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-critical-systemic-vulnerability-at-the-core-of-the-mcp/ | OX Security: systemic STDIO command injection in MCP; Anthropic calls it by-design, developers must sanitize. |
| DEV-05 | industry_commentary | 2026 | https://aigovernance.com/news/mcp-server-audit-finds-context-injection-across-19-servers-including-active-prompt | Audit of 19 MCP servers found context injection; Context7 CVE-2026-75130 CVSS 9.0 with active prompt injection. |
| DEV-05 | industry_commentary | 2026-07 | https://the-agent-report.com/2026/07/mcp-security-landscape-2026-vulnerabilities-mitigations/ | Claims 14 CVEs in Q3 2026 and ~200,000 exposed servers; GitHub MCP private-repo exfiltration cited. |
| DEV-05 | industry_commentary | 2026 | https://authzed.com/blog/timeline-mcp-breaches | Timeline of MCP security breaches 2025-2026. |
| DEV-05 | industry_commentary | 2026 | https://www.practical-devsecops.com/mcp-security-statistics-2026-report/ | Aggregated MCP CVE/breach statistics; counts conflict with other sources. |
| DEV-06 | primary_statistic | 2026 | https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act | European Commission: reporting obligations apply from 11 September 2026; main obligations from 11 December 2027. |
| DEV-06 | industry_commentary | 2026 | https://www.techtarget.com/cybersecurity/feature/EU-Cyber-Resilience-Act-reporting-What-CISOs-need-to-know | Cites ENISA survey: 66% of SME respondents had heard of CRA; 1 in 5 unsure it applies to them. |
| DEV-06 | industry_commentary | 2026 | https://dev.to/crakit/what-changes-on-11-september-2026-for-small-software-vendors-eu-cyber-resilience-act-1fg9 | Practitioner write-up of what small vendors must have in place on 11 Sept 2026 (24h/72h windows; process, not full compliance). |
| DEV-06 | industry_commentary | 2026 | https://www.continueops.com/cyber-resilience-act/timeline | Vendor timeline calling the reach to already-shipped products the 'legacy trap' most organisations are unprepared for. |
| DEV-06 | industry_commentary | 2026 | https://www.element.com/resources/articles/cyber-resilience-act-article-14-reporting-obligations-guide | Article 14 reporting guide; micro/small enterprises not fined for missing 24h early warning but still obligated. |
| DEV-07 | firsthand_complaint | 2026-11-01 | https://github.com/anthropics/claude-code/issues/106556 | Background subagents looped: 19,099 Read calls for 93 images, exhausted plan limit twice, ~half of weekly usage; asks for loop fix and credi |
| DEV-07 | firsthand_complaint | 2026-11-02 | https://github.com/anthropics/claude-code/issues/106753 | Agent ignored user-set stop time, ran overnight, used 61% of weekly limit. |
| DEV-07 | firsthand_complaint | 2026-10-31 | https://github.com/anthropics/claude-code/issues/106385 | Frozen desktop process led Workflow agents to rebuild cache every 10 minutes overnight, burning ~14% of weekly Max allowance. |
| DEV-07 | firsthand_complaint | 2026-11-02 | https://github.com/anthropics/claude-code/issues/106673 | Cloud sessions drain Pro plan limits instead of cloud credit and auto-resume after each 5-hour reset. |
| DEV-07 | firsthand_complaint | 2026-10-31 | https://github.com/anthropics/claude-code/issues/106372 | Usage limits exhausted ~4x faster since Oct 27 with unchanged workload (one of several duplicates). |
| DEV-07 | firsthand_complaint | 2026-10-27 | https://github.com/anthropics/claude-code/issues/105486 | ~67K characters of built-in tool schemas loaded every turn as fixed token overhead; request to disable. |
| DEV-08 | published_study | 2026-02 | https://arxiv.org/abs/2602.02307v1 | Study of 1,960 open-source Java projects: flaky tests, network and dependency resolution are the top causes of flaky CI failures. |
| DEV-08 | firsthand_complaint | 2026-01 | https://gitlab.com/gitlab-org/gitlab/-/issues/574762 | GitLab's internal Flaky Test Intervention: tests still quarantined after 2026-01-16 are permanently deleted. |
| DEV-08 | industry_commentary | unknown | https://dev.to/gewenyu99/what-we-learned-from-analyzing-202-million-ci-jobs-in-trunk-flaky-tests-part-2-1363 | Trunk (vendor) analysis of 202M CI jobs on flaky tests. |
| DEV-08 | industry_commentary | 2026 | https://diffie.ai/blog/flaky-test-report-2026 | Vendor 'Flaky Test Report 2026'; treat figures as marketing. |
| DEV-08 | speculation | 2026 | https://sailotech.com/blog/why-flaky-tests-are-slowing-down-your-ci-cd-pipeline/ | Vendor claim that retries inflate CI wall-clock time 20-30%. |
| EDU-01 | primary_statistic | 2017-08 | https://www.gao.gov/products/gao-17-574 | GAO estimated transferring students lost ~43% of credits on average; students receive limited information about articulation. |
| EDU-01 | published_study | unknown | https://files.eric.ed.gov/fulltext/EJ1494521.pdf | Cites CUNY 2022 study: 47% of 5,700 vertical transfer students lost degree-applicable credits. |
| EDU-01 | industry_commentary | 2026-01-08 | https://www.insidehighered.com/opinion/columns/beyond-transfer/2026/01/08/transfer-and-learning-mobility-2026-and-beyond | Nearly 4 in 10 adults have tried to transfer credit; 58% of those lost credits. |
| EDU-01 | industry_commentary | 2026-03-31 | https://www.texastribune.org/2026/03/31/texas-college-university-transfer-credit-loss | Texas reporting on transfer credit loss; 66-hour cap with excess becoming electives (only snippet seen). |
| EDU-01 | industry_commentary | unknown | https://lsadvising.berkeley.edu/progress-planning/transfer-credit/california-community-college | Berkeley advising: credit reviewed per the ASSIST agreement for the year the course was taken; GE vs department tabs differ; '&'-joined cour |
| EDU-01 | industry_commentary | unknown | https://www.transfercredit.org/blog/credits/articulation-agreements-explained-the-fine-print-that-decides-your-credits | Lists common traps: grade cutoffs, course age limits, residency, lower-division caps, elective-only transfer. |
| EDU-02 | primary_statistic | 2026-08-21 | https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-04-15/fafsa-real-time-fraud-detection-updated-aug-21-2026 | FSA: one-time fraud screening of pre-real-time 2026-27 forms completed; ~300,000 applications selected for V5 verification. |
| EDU-02 | primary_statistic | 2026 | https://news.csun.edu/financial-aid-scholarships/temporary-delay-in-2026-2027-financial-aid-processing/ | CSUN notice: FAFSA updates submitted on/after April 26, 2026 paused; federal system updates late June, campus processing resumes ~late July. |
| EDU-02 | industry_commentary | 2026 | https://www.ellucian.com/blog/fafsa-2026-financial-aid-trends-challenges-solutions | 2026-27 FAFSA launched Sept 24, 2025; aid offices face higher volume in shorter window. |
| EDU-02 | industry_commentary | unknown | https://www.financialaid.arizona.edu/policies/federal-verification | School is notified of selection 3-5 weeks after filing; review takes up to 3 weeks after all documents received. |
| EDU-02 | industry_commentary | unknown | https://finaid.gatech.edu/award-process/verification | Aid offers not final and not disbursed until verification complete. |
| EDU-02 | industry_commentary | 2026 | https://collegelens.ai/blog/financial-aid-basics/fafsa-identity-verification-2026-what-to-do | Describes 2026 real-time identity check (4 risk tiers) and June 29-July 6 2026 glitch; secondary source, unconfirmed. |
| EDU-03 | firsthand_complaint | 2026-10-26 | https://www.wvia.org/news/2026-10-26/special-education-teachers-share-the-myths-and-realities-of-their-job | Teachers describe crushing paperwork; a Philadelphia teacher's school hired staff to handle IEP paperwork. |
| EDU-03 | published_study | 2023-01 | https://teachplus.org/wp-content/uploads/2023/01/Teach-Plus-IL_Million-Paper-Cuts.pdf | Former Illinois SPED teachers cite IEP paperwork as a main reason for leaving. |
| EDU-03 | industry_commentary | 2025-10 | https://www.edweek.org/teaching-learning/teachers-are-using-ai-to-help-write-ieps-advocates-have-concerns/2025/10 | Teachers using AI to draft IEPs; Bettini estimate ~10 extra hours/week; 70% of schools had SPED vacancies (NCES 2023-24). |
| EDU-03 | industry_commentary | unknown | https://www.house.mn.gov/comm/docs/f73e24a4-230e-4291-80da-fe8dcde6db56.pdf | Minnesota legislative document: 15-20 unpaid hours/week; district estimate 32-61 hours per student. |
| EDU-03 | published_study | 2026 | https://www.yahoo.com/news/articles/special-education-teachers-report-burnout-110006655.html | North Dakota survey to lawmakers: SPED staff report burnout and uncompensated work time. |
| EDU-03 | primary_statistic | 2025-12-17 | https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/Dispute%20Resolution%20-%20Due%20Process%20Hearing%2026026H%20-12.17.2025.pdf | Due-process decision records district citing insufficient staffing for missed services. |
| EDU-04 | industry_commentary | 2026 | https://www.visaverge.com/news/uscis-backlog-freezes-12000-students-as-stem-opt-extension-and-opt-adjudications-stall/ | Reports ~12,000 students frozen in stalled OPT/STEM OPT adjudications in 2026. |
| EDU-04 | industry_commentary | 2026 | https://www.visaverge.com/f1visa/opt-premium-delays-intensify-risk-for-f1-job-offers/ | Premium processing fee rose to $1,780 for filings postmarked on/after March 1, 2026; delays endanger job offers. |
| EDU-04 | industry_commentary | 2026 | https://www.rnlawgroup.com/opt-delays-in-2026-why-the-14-month-rule-makes-a-timely-decision-essential/ | Law firm: slow initial OPT decisions shorten usable OPT under the 14-month rule. |
| EDU-04 | industry_commentary | 2026 | https://scale.jobs/blog/opt-application-delayed-step-by-step-guide-2026 | Typical 90-120 days; six-month-plus delays reported in early 2026. |
| EDU-04 | industry_commentary | unknown | https://global.cornell.edu/statement/letter-dhs-opt-processing-delays | Cornell letter to DHS on OPT processing delays (institutional complaint). |
| EDU-04 | firsthand_complaint | unknown | https://www.teamblind.com/post/urgent-forgot-to-update-employment-in-sevp-for-opt-w06j6mm6 | Student missed an SEVP employment update and received an unemployment-days-exhausted warning. |
| EDU-04 | primary_statistic | unknown | https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/unemployment-counter | SEVIS unemployment counter rules (days allowed/accrued/remaining). |
| EDU-05 | industry_commentary | 2026-09-24 | https://civicmedia.us/news/2026/09/24/hundreds-of-immigrants-refugees-await-english-education-as-literacy-green-bay-weathers-federal-cuts | Literacy Green Bay cut ESL classes from 15 to 8 after federal funding losses; ~300-person waitlist. |
| EDU-05 | industry_commentary | 2026-09 | https://pbswisconsin.org/news-item/hundreds-of-immigrants-refugees-await-english-education-as-literacy-green-bay-weathers-federal-cuts/ | Same story republished by PBS Wisconsin (deduplicated). |
| EDU-05 | primary_statistic | unknown | https://www.roundrocktexas.gov/city-departments/library-home/adults/esl/ | Library ESL waitlist closed; will reopen later. |
| EDU-05 | primary_statistic | 2026-07-24 | https://www.cuesta.edu/aboutcc/documents/inst_research/WaitSpring.pdf | Spring 2026 waitlisted-classes report shows ESL sections with waiting students at full capacity. |
| EDU-05 | published_study | unknown | https://files.eric.ed.gov/fulltext/ED527905.pdf | 'The ESL Logjam': long waiting lists for adult ESL in many parts of the US (older report). |
| EDU-05 | industry_commentary | 2026-10-06 | https://hyphenonline.com/2026/10/06/esol-waiting-lists-west-yorkshire-two-years-hundreds-demand-leeds-city-college/ | UK comparison: two-year waits, lists of up to 400 per course (structural, non-US). |
| EDU-06 | primary_statistic | unknown | https://news.wttw.com/node/21353 | Illinois survey of ~400 districts: 16,500+ absences/week, ~20% unfilled. |
| EDU-06 | industry_commentary | unknown | https://www.frontlineeducation.com/blog/how-many-absences-are-substitute-teachers-actually-filling/ | Vendor analysis of fill rates across its absence-management data. |
| EDU-06 | published_study | unknown | https://annenberg.brown.edu/news/america-faces-substitute-teacher-shortage-and-disadvantaged-schools-are-hit-hardest | Annenberg (Brown) research: sub shortage hits disadvantaged schools hardest. |
| EDU-06 | primary_statistic | 2026-02 | https://www.kimberly.edu/sites/default/files/Feb%202026%20Substitute%20Board%20Report.%20(1).pdf | One WI district: 95.07% fill rate, 71 of 1,439 jobs covered in-house, Aug 2025-Feb 2026. |
| EDU-06 | primary_statistic | 2026 | https://learningpolicyinstitute.org/product/state-teacher-shortages-2026-factsheet | 37,569 unfilled teaching positions across 29 states + DC. |
| EDU-06 | industry_commentary | unknown | https://digital-release.newsnationnow.com/?p=2087786 | Reports Future-Ed finding: 1 in 5 sub requests unfilled pre-pandemic; 77% of districts worse after. |
| EDU-07 | published_study | 2026-10 | https://www.future-ed.org/wp-content/uploads/2026/10/2026AttendancePlaybook.pdf | FutureEd 2026 Attendance Playbook: tiered, evidence-based attendance interventions (only fragments visible). |
| EDU-07 | industry_commentary | 2026 | https://edsource.org/2026/attendance-data-predicts-success/750210 | Commentary on CA SB 691: reach families by the 3rd absence; over half improve without second intervention. |
| EDU-07 | industry_commentary | 2026-09 | https://www.schoolstatus.com/blog/mailed-attendance-letters | Vendor: hybrid mailed + digital letters recommended; 54% never need a second intervention (vendor data). |
| EDU-07 | primary_statistic | 2025-10 | https://resources.finalsite.net/images/v1759354442/rahwaynet/sldtnnxh3rdv47qfyvmz/23ChronicAbsenteeismPlanCodeofConduct5600R93025docx.pdf | District plan: letters at 5/10/15 absences from the SIS with monthly data review (concrete manual workflow). |
| EDU-07 | industry_commentary | unknown | https://go.panoramaed.com/hubfs/4%20Evidence%20Based%20Attendance%20Interventions.pdf | Nudge-letter model: brief letters/texts with follow-up 2-3 weeks later. |
| EDU-07 | primary_statistic | unknown | https://www.education.ky.gov/school/Pages/Chronic-Absenteeism-Toolkit.aspx | State DOE provides customizable letter templates, implying districts assemble workflows themselves. |
| EDU-08 | primary_statistic | 2026 | https://www.apprenticeship.gov/sites/default/files/bulletins/2026-35%20Announcement%20of%20Shot%20Clock.pdf | DOL OA bulletin committing to registration determinations within 30 days of final signed standards. |
| EDU-08 | primary_statistic | 2025-07-02 | https://www.federalregister.gov/documents/2025/07/02/2025-12317/prohibiting-illegal-discrimination-in-registered-apprenticeship-programs | Proposed rule states a requirement caused greater-than-expected burden on sponsors interacting with RAPIDS. |
| EDU-08 | primary_statistic | 2024-01-17 | https://www.federalregister.gov/documents/2024/01/17/2023-27851/national-apprenticeship-system-enhancements | DOL received complaints from potential sponsors, particularly skilled trades, unable to register programs in certain states. |
| EDU-08 | industry_commentary | unknown | https://jobcannon.io/b2b/guides/apprenticeship-rapids-data-system | Vendor guide describing RAPIDS/WIPS/PIRL reporting pain for sponsors. |
| FIN-01 | primary_statistic | 2026-03 | https://files.consumerfinance.gov/f/documents/cfpb_2025-cr-annual-report_2026-03.pdf | CFPB 2025 Consumer Response Annual Report: ~6.6M complaints, ~5.8M (88%) credit/consumer reporting, most common issue 'problem with a credit |
| FIN-01 | industry_commentary | 2026-04-10 | https://infobytes.orrick.com/2026-04-10/cfpb-reports-complaint-volume-doubled-in-2025-citing-surge-in-credit-reporting-disputes/ | Law-firm summary: complaint volume doubled; CFPB attributes part of surge to credit repair orgs and AI-generated duplicative submissions. |
| FIN-01 | industry_commentary | 2026 | https://bridgeforcedatasolutions.com/fcra-litigation-and-complaints-eoy-update/ | Portal data analysis: 'incorrect information on report' = 1.4M of 2.36M credit reporting complaints in H2 2025. |
| FIN-01 | primary_statistic | 2026-10-27 | https://receivablesinfo.com/2026/10/27/webrecon-september-2026-litigation-statistics/ | WebRecon: FCRA lawsuits up 43.8% YTD through Sep 2026, 8,329 filings. |
| FIN-01 | industry_commentary | 2026-10 | https://ginsburglawgroup.com/2026/10/consumer-lawsuits-record-high-fcra-tcpa-filings-2026-what-it-means/ | Summarizes Lex Machina Oct 2026 report: FCRA filings rose 44% to 7,750 in 2025; common drivers are ID-theft accounts, mixed files, re-report |
| FIN-01 | industry_commentary | 2026 | https://themoneyoverview.com/credit-report-errors-cfpb-5-8-million-complaints/ | Secondary analysis claiming ~40% of complaints closed with non-monetary relief and almost none with money; unverified. |
| FIN-02 | industry_commentary | 2026-05 | https://www.jonesday.com/en/insights/2026/05/ftc-revives-clicktocancel-rule-new-risks-for-subscription-businesses | Law firm: Eighth Circuit vacated the rule on procedural grounds; FTC restarted rulemaking in 2026. |
| FIN-02 | industry_commentary | 2026 | https://www.bclplaw.com/en-US/events-insights-news/im-not-dead-yet-is-the-demise-of-the-ftcs-click-to-cancel-exaggerated.html | Law firm: rule vacated July 8, 2025; FTC continues enforcement under ROSCA/Section 5 (e.g., NextMed). |
| FIN-02 | primary_statistic | 2025-08 | https://www.consumer.ftc.gov/consumer-alerts/2025/08/la-fitness-made-it-difficult-people-cancel-gym-memberships-ftc-says | FTC alert on LA Fitness case; notes changing card number is often not enough and advises card disputes. |
| FIN-02 | firsthand_complaint | unknown | https://uk.trustpilot.com/review/crunch.com | 522 reviews; reviewers describe annual fee charged and not removed despite calls, and billing after management said they would not be billed |
| FIN-02 | firsthand_complaint | unknown | https://au.trustpilot.com/review/gymnation.com | Reviews describe continued billing after membership ended and refusal to cancel after job loss. |
| FIN-02 | firsthand_complaint | unknown | https://www.aol.com/finance/reddit-t-believe-hard-supposedly-200057489.html | Reddit thread coverage calling gym cancellation practices 'flat out predatory'; notes NYC law requiring online cancellation. |
| FIN-02 | industry_commentary | unknown | https://www.yahoo.com/news/equinox-soulcycle-customers-york-may-231532166.html | NY Equinox/SoulCycle members may receive refunds over cancellation issues. |
| FIN-03 | industry_commentary | 2025-07-15 | https://npr.org/2025/07/15/nx-s1-5468438/medical-debt-credit-reports-ruling | NPR: Texas federal judge found every substantive provision of the CFPB Medical Debt Rule exceeded its FCRA authority; rule vacated. |
| FIN-03 | industry_commentary | 2026-08-21 | https://beancount.io/blog/2026/08/21/medical-debt-credit-report-ban-vacated-protections-2026-guide | Summarizes remaining protections: voluntary bureau removals and ~15 state laws; notes preemption litigation (unverified). |
| FIN-03 | firsthand_complaint | unknown | https://www.aol.com/anderson-woman-tried-dispute-her-020517569.html | Patient tried to dispute a medical claim and the hospital sold it to collections anyway; reporting notes this is legal. |
| FIN-03 | firsthand_complaint | unknown | https://www.nbcnews.com/health/health-news/billing-expert-investigated-husbands-er-bill-was-able-knock-thousands-rcna53683 | Family found charge for procedure never performed; bill reduced to about a third after more than a year of disputing. |
| FIN-03 | firsthand_complaint | unknown | https://www.teamblind.com/post/faulty-medical-bill-sent-to-collections-oy3ss2ia | Forum post: bill sent to collections after hospital billed the wrong family member's insurance. |
| FIN-03 | industry_commentary | unknown | https://www.consumerreports.org/money/medical-billing/hit-with-a-big-medical-bill-do-this-a2324099197/ | Consumer Reports guidance: look for duplicates, covered items, services never received; collector must pause 30 days on written dispute. |
| FIN-03 | industry_commentary | unknown | https://drwenner.substack.com/p/use-ai-to-object-to-a-hospital-bill | Physician's template for objecting to hospital bills using itemized CPT breakdown; shows current DIY workaround. |
| FIN-03 | firsthand_complaint | unknown | https://www.yahoo.com/news/articles/local-woman-battles-medical-bill-012100635.html | Local news: woman battling for years over a bill that should have been covered by insurance. |
| FIN-04 | primary_statistic | 2026 | https://news.bloombergtax.com/daily-tax-report/calls-return-backlog-worsen-during-tax-season-advocate-says | NTA midyear report: returns/correspondence backlog nearly doubled in 2026 filing season; ~20% fewer calls answered; ID-theft cases average a |
| FIN-04 | industry_commentary | unknown | https://www.accountingtoday.com/news/irs-lengthy-case-backlog-frustrates-identity-theft-victims | Trade press on IRS identity-theft case backlog frustrating victims. |
| FIN-04 | industry_commentary | 2026 | https://filetax.com/blog/2026-irs-filing-season-report | Summarizes NTA FY2027 Objectives Report (June 24, 2026): frozen refunds, ID-theft cases, >1M taxpayers with refund delays. |
| FIN-04 | primary_statistic | unknown | https://www.ftc.gov/news-events/topics/identity-theft | FTC: over 3.17M identity theft, fraud and other complaints filed directly with FTC in 2025; IdentityTheft.gov provides a personalized recove |
| FIN-04 | industry_commentary | 2026 | https://www.securityhero.io/identity-theft-statistics/ | Cites ITRC: average 10.4 hours resolving in 2025; 13% resolved within a week; ~48% still open; complex cases 6 months to years. |
| FIN-04 | primary_statistic | 2025 | https://www.ftc.gov/reports/consumer-sentinel-network-data-book-2024 | FTC Consumer Sentinel Data Book (complaint counts, not recovery hours). |
| FIN-05 | primary_statistic | 2026 | https://news.bloombergtax.com/daily-tax-report/calls-return-backlog-worsen-during-tax-season-advocate-says | NTA midyear report: returns and correspondence backlog nearly doubled during 2026 filing season; ~20% fewer calls answered. |
| FIN-05 | industry_commentary | 2026 | https://boomtax.com/tax-forms/cp2000-response | CP2000 response guide: 30-day response window, 60 days abroad. |
| FIN-05 | industry_commentary | 2026 | https://unclekam.com/tax-strategy-blog/irs-cp2000-response-agree-or-disagree-options-for-2026/ | Reports IRS typically takes 60-120 days to process a CP2000 response; no official guarantee. |
| FIN-05 | industry_commentary | 2026 | https://gtaaccountinggroup.com/blog/received-irs-cp2000-notice/ | Free response-letter templates; shows DIY demand. |
| FIN-05 | speculation | 2026 | https://meetaitools.com/chatgpt-prompts-irs-response-letter-usa-2026/ | Vendor blog claiming $3,400 saved via AI-drafted response; anecdotal, unverified. |
| FIN-06 | primary_statistic | 2024-09-13 | https://www.eldorado.courts.ca.gov/system/files/tentative-rulings/probate-september-13-2024.pdf | Probate tentative ruling: matter continued several times since July 2023, inventory still being finalized. |
| FIN-06 | primary_statistic | 2026-03-16 | https://www.merced.courts.ca.gov/system/files/probate-notes-cr10-monday-march-16-2026-815-am_0.pdf | Probate notes listing status hearings set months out to force closing of estates. |
| FIN-06 | primary_statistic | 2026-01-22 | https://www.merced.courts.ca.gov/system/files/probate-notes-cr10-thursday-january-22-2026-815-am.pdf | Additional 2026 probate calendar showing continued/status matters. |
| FIN-06 | industry_commentary | 2026 | https://www.ironcladfamily.com/blog/executor-of-will-checklist-a-step-by-step-guide-for-2026 | Executor guide: volume of paperwork and fear of legal mistakes; creditors may appear months later; Form 706 due within nine months. |
| FIN-06 | industry_commentary | unknown | https://www.rocketlawyer.com/article/what-is-a-letter-of-testamentary.rl | Banks often keep a certified copy of letters; executors need multiple certified copies. |
| FIN-06 | primary_statistic | unknown | https://www.dfs.ny.gov/legal/interpret/lo090724.htm | NY DFS interpretation: letters are conclusive evidence of authority, but banks may still decline certain accounts for operational reasons. |
| FIN-07 | industry_commentary | 2026 | https://claimback.app/insurance-denial-statistics | Vendor compilation citing III (5-6% full denials), Weiss Ratings 37% (2024) and 47.5% (2023), and KFF health-appeal figures; notes no author |
| FIN-07 | industry_commentary | 2026 | https://forthepublicadjusters.com/blog/which-insurance-company-denies-most-claims/ | Public adjuster blog citing Weiss/NAIC denial rates by insurer, Florida highest. |
| FIN-07 | industry_commentary | 2026 | https://smartinsurance101.com/homeowners-insurance-claim-denied-appeal-overturn/ | Appeal guide: most insurers require appeals within 30-60 days of denial. |
| FIN-07 | industry_commentary | 2026 | https://www.pnwresidences.com/blog/home-insurance-claims-statistics-2026/ | Claims frequency/severity statistics (Triple-I/ISO derived). |
| GOV-01 | published_study | 2026 | https://www.nber.org/papers/w34698 | NBER working paper: work requirements significantly increase procedural and overall SNAP denials using age-based exemptions and waiver perio |
| GOV-01 | published_study | 2026 | https://ideas.repec.org/a/aea/apandp/v116y2026p309-313.html | Cook, Cox & East (AEA P&P 2026): procedural denials up 19-26%, overall denials up 4-10% under work requirements. |
| GOV-01 | primary_statistic | unknown | https://www.cbpp.org/research/food-assistance/administrative-burden-and-procedural-denials-in-the-supplemental-nutrition | 33% of denials procedural in work-requirement areas vs 27% in waived areas; argues payment-error-rate penalties push states toward more proc |
| GOV-01 | industry_commentary | 2026 | https://www.congress.gov/crs-product/R48755 | CRS comparison of Medicaid vs SNAP work requirements after P.L. 119-21. |
| GOV-01 | industry_commentary | 2026-07 | https://benefitsusa.org/en/blog/obbb-snap-work-requirements-by-state-2026-abawd-tracker | State tracker: waivers terminated Nov 2 2025, reinstated Feb 26 2026 by court order, last statewide waivers expired June 30 2026; Nevada >25 |
| GOV-01 | primary_statistic | 2026 | https://www.dhs.state.il.us/page.aspx?item=174187 | Illinois DHS policy memo MR#26.03: nonexempt recipients must register for work at application and every 12 months; time-limited benefits for |
| GOV-01 | industry_commentary | 2026 | https://benefitguide.net/guides/missed-snap-interview-what-to-do/ | Describes Notice of Missed Interview flow and the shift of burden onto the recipient to call back within a short window. |
| GOV-02 | firsthand_complaint | 2026 | https://abc11.com/post/durham-county-raises-concerns-snap-funding-changes-hr-1/19737008/ | Durham County assistant director: 9 application workers where 14-15 are needed; SNAP admin costs rise Oct 2026. |
| GOV-02 | firsthand_complaint | 2026 | https://www.themountaineer.com/news/county-faces-a-cascade-of-challenges-in-new-medicaid-food-stamp-laws/article_a13d763c-f999-4f2c-8023-eaadc3d71b8c.html | NC county: twice-yearly Medicaid reviews double work on 4,700 cases; 'not enough people to hire, let alone train' before Jan 1. |
| GOV-02 | primary_statistic | 2026-06 | https://www.nysac.org/media/jkif4qiw/snap-under-hr1-nysac-report-6-22.pdf | NYSAC: federal SNAP admin share drops 50%->25% on Oct 1 2026, ~$168M/yr shifted to NY counties and NYC; counties must expand DSS workforce. |
| GOV-02 | primary_statistic | 2026-03-19 | https://sbud.senate.ca.gov/system/files/2026-03/03192026-dhcs-and-cdss-hr-1-calworksfinal.pdf | CA Senate Budget Sub. 3 agenda on H.R.1: counties anticipate hiring hundreds of FTE eligibility workers; semiannual reviews begin Oct 1 2026 |
| GOV-02 | firsthand_complaint | 2026 | https://citizenportal.ai/articles/11242940/Oregon/Multnomah-County/County-and-state-officials-warn-HR-1-will-shrink-eligibility-increase-redetermination-workload-and-hit-SNAP-and-Medicaid-caseloads | Multnomah County officials: HR 1 already reduced SNAP participation and will create a large administrative burden for Medicaid redeterminati |
| GOV-02 | primary_statistic | 2026 | https://www.cms.gov/newsroom/press-releases/cms-launches-nationwide-framework-implement-medicaid-work-requirements | CMS: $200M efficiency grants plus >$600M vendor-committed support for state eligibility system updates. |
| GOV-02 | industry_commentary | 2026 | https://shvs.org/resources/h-r-1-medicaid-implementation-an-administrative-cost-monitoring-guide-for-states/ | SHVS cost-monitoring guide: consultant/contractor and IT development are major admin cost categories. |
| GOV-03 | industry_commentary | 2026-06 | https://foleyhoag.com/news-and-insights/publications/alerts-and-updates/2026/june/cms-issues-interim-final-rule-imposing-medicaid-work-requirements-for-expansion-populations/ | Law-firm summary of CMS IFR: states must overhaul eligibility systems, build verification infrastructure and notices; est. avg $15M per stat |
| GOV-03 | primary_statistic | 2026 | https://www.cms.gov/newsroom/press-releases/cms-launches-nationwide-framework-implement-medicaid-work-requirements | CMS framework: $200M Government Efficiency Grants, >$600M vendor-committed support. |
| GOV-03 | industry_commentary | 2026 | https://www.macpac.gov/publication/panel-on-medicaid-work-requirements-state-implementation/ | MACPAC panel on state implementation challenges. |
| GOV-03 | primary_statistic | 2026 | https://www.dmas.virginia.gov/news-updates/new-federal-requirements/federal-work-requirements/ | Virginia DMAS: affected adults reviewed every 6 months instead of 12. |
| GOV-03 | industry_commentary | 2026 | https://www.openmedicaid.org/insights/work-requirements-2026 | State-by-state tracker; Nebraska implemented early. |
| GOV-04 | industry_commentary | 2026 | https://baylegal.com/california-adu-permit-timelines-in-2026-sb-543-and-what-cities-must-now-do/ | Law-firm explainer: 15 business days to determine completeness (deemed complete if missed), 60 days to decide (deemed approved if missed) ef |
| GOV-04 | industry_commentary | 2026 | https://maxablespace.com/california-adu-laws-in-2026/ | Summarizes SB 543, AB 1154, AB 462 and AB 253 private plan checker option after 30 business days. |
| GOV-04 | industry_commentary | 2026 | https://andalusiadrafting.com/guides/adu-permit-timeline-california | Designer's guide: '60 days by law, 3-12 months in reality'. |
| GOV-04 | industry_commentary | 2026 | https://altobuilds.com/adu-permit-timeline | LA ADU builder: practical timeline from submission to issuance typically 3-5 months. |
| GOV-04 | industry_commentary | 2026 | https://aduhomeconstruction.com/blog/sb-543-adu-permit-timeline-2026/ | Contractor blog on SB 543 timelines (contains a conflicting 15-day approval claim; treat with caution). |
| GOV-05 | primary_statistic | 2026 | https://www.americanimmigrationcouncil.org/blog/uscis-immigration-processing-trends-2026/ | AIC analysis of USCIS data: pending cases 9.7M -> 11.3M (FY25 Q1 to FY26 Q1, +16.5%); backlog clearance time 9.4 -> 18.6 months. |
| GOV-05 | primary_statistic | 2026 | https://www.federalhiringdata.com/articles/uscis-pending-caseload-workforce-2026 | 12.13M pending vs formal net backlog ~7.03M; I-765 pending 191K -> 585K (+206%) FY25 Q2 to FY26 Q2. |
| GOV-05 | industry_commentary | 2026-08 | https://www.visaverge.com/greencard/indian-green-card-holders-face-slowing-us-citizenship-approvals-as-uscis-backlog-grows/ | 513,462 N-400s pending >6 months at end of Aug 2026; August approvals below June/July. |
| GOV-05 | industry_commentary | 2026 | https://www.jeelani-law.com/articles/USCIS-processing-delays-deepen | Law-firm article: 12.1M pending, highest in dataset history. |
| GOV-05 | industry_commentary | 2026-03 | https://www.portnerandshure.com/blog/2026/march/uscis-processing-times-in-2026-a-guide-from-portner-shure/ | Premium processing fee $2,965 effective March 1 2026; filings with old fee rejected. |
| GOV-06 | firsthand_complaint | 2026 | https://www.mantecabulletin.com/news/local-news/manteca-public-records-act-requests-surge-by-12-fold/ | Manteca CA clerk: requests 42 (2016) -> 510+ (2026); almost all of one of three employees' time consumed; 10-day CPRA response window. |
| GOV-06 | firsthand_complaint | 2026 | https://citizenportal.ai/articles/10700892/minnesota/hennepin-county/minneapolis-city/clerks-records-team-says-data-requests-have-doubled-proposed-cuts-would-worsen-backlogs | Minneapolis assistant city clerk to Budget Committee: ~6,500 requests through Sept, ~9,000 projected for 2026; cuts would make workload unsu |
| GOV-06 | firsthand_complaint | 2026 | https://www.yahoo.com/news/articles/city-albuquerque-seeing-influx-records-041008269.html | Albuquerque: >1,700 IPRA requests in backlog; influx from out of state and abroad. |
| GOV-06 | firsthand_complaint | 2026 | https://citizenportal.ai/articles/10679928/california/sonoma-county/cloverdale-city/city-outlines-cpra-backlog-plan-staff-say-requests-are-straining-capacity | Cloverdale CA staff: CPRA requests straining capacity; plan uses temps and auto-assignment software to clear backlog by September. |
| GOV-06 | firsthand_complaint | 2026 | https://citizenportal.ai/articles/10798759/washington/clark-county/battle-ground-city/city-clerk-reports-fewer-publicrecords-requests-but-higher-processing-time-and-costs | Battle Ground WA clerk: requests 968 (2024) -> 899 (2025) but processing time and cost up due to a few very large complex requests. |
| GOV-06 | industry_commentary | 2026 | https://clerkbase.com/public-records-discoverability | Vendor piece: federal FOIA >1.5M FY2024 (+25%); NY FOIL doubled 2018-2024 with 62% of open requests past due. |
| GOV-07 | primary_statistic | 2026-09-21 | https://www.wgbh.org/news/local/2026-09-21/state-audit-faults-states-unemployment-on-hold-times-and-delayed-benefits | MA State Auditor: DUA met no intrastate timeliness standard in any month July 2022-June 2024; DUA says ~70% of claims processed within 30 da |
| GOV-07 | primary_statistic | 2026-09-29 | https://atholdailynews.com/2026/09/29/dua-audit-unemployment-delays/ | Same MA audit coverage; hold times and delayed benefits. |
| GOV-07 | industry_commentary | 2026-10-21 | https://www.wxxinews.org/new-york-public-news-network/2026-10-21/unemployment-check-recipients-face-up-to-12-day-delay-as-state-system-is-modernized | NY DOL system offline from 5pm Nov 2 for 9-12 days; no claims, certifications or account changes; state considered phased migration but did  |
| GOV-07 | industry_commentary | 2026-11-01 | https://www.wamc.org/2026-11-01/about-5-700-central-new-yorkers-on-unemployment-will-face-delays-as-the-state-shuts-down-its-system | ~5,700 Central NY claimants face delays during shutdown. |
| GOV-07 | published_study | 2026 | https://files.gao.gov/reports/GAO-26-109093/index.html | GAO-26-109093: state UI managers face tension between timely payments and identity verification; fraud-risk management challenges in state-a |
| GOV-07 | primary_statistic | 2023 | https://www.gao.gov/products/gao-23-106696 | GAO: pandemic UI fraud likely $100-135B (structural context). |
| GOV-07 | primary_statistic | 2022 | https://oversightdemocrats.house.gov/news/press-releases/chairs-maloney-clyburn-release-evidence-facial-recognition-company-idme | House Oversight: ID.me video-chat waits averaged >4 hours in 14 states (historical). |
| GOV-08 | industry_commentary | 2026 | https://blogs.usfcr.com/sam-registration-what-they-dont-tell-you | Registration consultant describes validation delays and common pitfalls (vendor-interested source). |
| GOV-08 | industry_commentary | 2026 | https://samstream.ai/blog/how-long-sam-gov-registration-takes/ | Estimates 4-6 weeks for first-time registrants because of at least one validation delay; no official expedite. |
| GOV-08 | industry_commentary | 2026 | https://gov-contract-alerts.com/intel/sam-gov-registration/ | Common problems: name/address/EIN mismatch, duplicate UEI records, fsd.gov ticket escalation. |
| GOV-08 | industry_commentary | 2026 | https://www.grantsbase.com/index.php/guides/sam-gov-registration-walkthrough | Walkthrough noting new EINs not yet recognized and renewal lead time advice. |
| HC-01 | primary_statistic | 2026-05 | https://cmadocs.org/newsroom/news/view/ArticleId/51200/AMA-survey-highlights-ongoing-prior-auth-burdens-as-CMA-continues-reform-efforts | Summarizes AMA survey of 1,000 physicians (fielded Dec 2025): ~40 PAs/week, 13 hours/week, 95% say PA delays care, 79% report treatment aban |
| HC-01 | primary_statistic | unknown | https://ama-assn.org/practice-management/sustainability/survey-quantifies-time-burdens-prior-authorization | AMA's own write-up of its PA time-burden survey series (earlier years reported 37-45 requests/week, ~14 hours). |
| HC-01 | firsthand_complaint | 2026 | https://www.medscape.com/viewarticle/how-nps-are-navigating-prior-authorization-coverage-barriers-2026a1000gm0 | Nurse practitioner describes being stuck on hold with an insurer and PA work consuming 2-3 hours a day. |
| HC-01 | firsthand_complaint | 2025-11-05 | https://www.statnews.com/2025/11/05/peer-to-peer-review-prior-authorization-insurance-companies/ | Physician describes repeatedly waiting on hold 40+ minutes for peer-to-peer reviewers and short windows to connect. |
| HC-01 | industry_commentary | 2026 | https://ushealthinsights.com/article/prior-authorization/ | Explains CMS-0057-F timelines in force since Jan 1, 2026 (7 days standard, 72 hours expedited) for MA, Medicaid/CHIP, and exchange plans onl |
| HC-02 | industry_commentary | 2026 | https://www.risehealth.org/insights-articles/new-report-medicare-wiser-prior-authorization-pilot-program-causing-care-delays/ | Summarizes WP Intelligence (Washington Post) analysis finding delays, provider dissatisfaction, long peer-to-peer waits, and vendor PA numbe |
| HC-02 | firsthand_complaint | 2026-04-03 | https://www.wsma.org/Shared_Content/News/advocacy-report/2026/April%203/wsma-raises-concerns-with-cms-on-wiser-model-implementation | Washington State Medical Association reports extended timelines, vendor portal access difficulty, and unresolved discrepancies leaving pract |
| HC-02 | firsthand_complaint | 2026 | https://www.azmed.org/arizona-pain-specialist-says-cms-s-wiser-model-is-disrupting-patient-care | Arizona pain physician reports far more denials under WISeR than under commercial/MA and staff holding up to 90 minutes to schedule peer-to- |
| HC-02 | industry_commentary | 2026-05 | https://www.asahq.org/quality-and-practice-management/wiser-medicare-payment-model/wiser-asa | ASA asks CMS to enforce review timelines with penalties, default to approval when missed, decouple vendor pay from denials, and create gold- |
| HC-02 | industry_commentary | 2025-09-08 | https://osteopathic.org/2025/09/08/aoa-joins-coalition-opposing-wiser-demonstration/ | Regulatory Relief Coalition argues vendor compensation tied to denial volume creates perverse incentives. |
| HC-03 | primary_statistic | 2026-10-01 | https://www.cms.gov/files/document/readout-cms-convening-certified-independent-dispute-resolution-entities-oct-1-2026.pdf | CMS convening readout: users raise concerns about ineligible disputes, unclear IDR entity determination rationales, and delayed payment or n |
| HC-03 | published_study | 2026-10 | https://hsph.harvard.edu/wp-content/uploads/2026/10/Trends-in-Volume-and-Filer-Type-in-NSA-Disputes_HQO-Harvard.pdf | Harvard analysis of CMS public use files: IDR dispute volume increased 20-fold from 2023Q1 to 2025Q4. |
| HC-03 | primary_statistic | 2026 | https://www.cms.gov/priorities/innovation/data-and-reports/2026/federal-idr-supplemental-background-2025-q3-2025-q4 | CMS supplemental data: 257,724 disputes closed Jan 2026; Dec 2025-Jan 2026 closures (506,242) nearly equal initiations (516,241); 92% of all |
| HC-03 | published_study | 2026-03-18 | https://www.healthaffairs.org/do/10.1377/forefront.20260318.548269/full/ | Health Affairs: officials expected ~17,000 disputes per year; 4.8 million total cases through end of 2025. |
| HC-03 | published_study | 2025 | https://chir.georgetown.edu/the-no-surprises-act-idr-process-an-early-look-at-2025-data/ | Georgetown CHIR: 430,000 disputes still outstanding as of late June 2025. |
| HC-03 | primary_statistic | unknown | https://www.cms.gov/files/document/fact-sheet-clearing-independent-dispute-resolution-backlog.pdf | CMS fact sheet on initiative to clear the IDR backlog. |
| HC-04 | industry_commentary | 2026-05 | https://kevinmd.com/2026/05/3-reasons-credentialing-delays-push-past-90-days.html | Physician-facing piece on why credentialing routinely exceeds 90 days (CAQH profile staleness, mismatched locations, expired documents). |
| HC-04 | industry_commentary | 2026 | https://www.getpracticehelp.com/credentialing/credentialing-delays/ | Vendor explainer: credentialing takes 90-150 days; missed CAQH re-attestation can stall an application 60 days in; payers expect attestation |
| HC-04 | industry_commentary | 2026 | https://www.medcloudmd.com/post/provider-credentialing-challenges-2026 | Vendor piece claiming 2026 delays often run 3-6 months; its 85% CAQH-cause figure is unsourced. |
| HC-04 | industry_commentary | unknown | https://drcredentialing.us/blog/caqh-credentialing-issues/ | Lists the top CAQH-related failure causes (outdated profile, attestation lapses, document expiry). |
| HC-04 | industry_commentary | 2026 | https://www.mentalyc.com/blog/insurance-panels-for-therapists | Therapist paneling guide: 60-120 days per payer typical, up to six months; payers review only at monthly committee meetings; quarterly CAQH  |
| HC-04 | industry_commentary | unknown | https://helpsquad.com/blog/provider-credentialing-and-payer-enrollment-why-a-new-physician-can-t-bill-for-90-days/ | Explains why a new physician cannot bill for ~90 days after hire. |
| HC-05 | industry_commentary | 2026-06 | https://news.bloomberglaw.com/health-law-and-business/trumps-pivot-on-medicaid-work-requirements-frustrates-states | June 1, 2026 interim final rule narrows medical-frailty exemption; Oregon, California, Pennsylvania say it forces IT rework and adds adminis |
| HC-05 | firsthand_complaint | 2025-08-05 | https://sourcenm.com/2025/08/05/more-paperwork-for-everyone-nm-medicaid-program-braces-for-more-churn/ | New Mexico Medicaid officials: 'more paperwork for everyone', ~88,000 projected to lose coverage, $32.7M initial system-change cost. |
| HC-05 | industry_commentary | 2026-03 | https://www.pulse.bot/healthcare/news/cms-gives-states-two-options-to-transition-to-six-month-medicaid-eligibility-checks-7eeb8409-7c07-4139-85fe-b506b92649ab | CMS March 2026 guidance: two transition options for six-month renewals applying to renewals on/after Dec 31, 2026. |
| HC-05 | industry_commentary | 2026-08 | https://hub.thenationalcouncil.org/wp-content/uploads/2026/08/H.R.1-What-to-Know-About-Eligibility-Redeterminations.pdf | National Council explainer on H.R.1 redetermination changes for behavioral-health providers, including mixed-household renewal-date issues. |
| HC-05 | primary_statistic | unknown | https://www.healthinsurance.org/medicaid-redetermination/ | Cites Urban Institute projections (up to 3.1M lower enrollment, ~11% procedural) and CBO (~700,000 more uninsured in 2034; $63B). |
| HC-05 | published_study | unknown | https://www.fiercehealthcare.com/payers/procedural-disenrollment-medicaid-blamed-causing-eligible-individuals-lose-cover-age-kff | KFF unwinding data: procedural disenrollment ranged from 96% (NM) to 7% (OR); Arkansas 80%+ procedural. |
| HC-06 | primary_statistic | 2026-04-16 | https://telehealthresourcecenter.org/wp-content/uploads/2026/04/04.16.26-NRTRC-WEBINAR.pdf | University of Utah webinar slide: 70% of hospitals still use fax for some health data exchange. |
| HC-06 | industry_commentary | 2026-03-03 | https://www.docvilla.com/2026/03/03/fax-in-healthcare-communication-medical-billing/ | Cites March 2026 MGMA poll: 73% of practices have digital fax integrated with EHR/PM, nearly 1 in 4 does not; explains why mismatched EHRs m |
| HC-06 | industry_commentary | 2026-08-25 | https://www.physicianspractice.com/view/12-steps-to-finally-kill-the-fax-machine-in-your-practice | Physicians Practice guide on eliminating fax; references CMS 'Axe the Fax' initiative targeting the roughly half of PA traffic still sent by |
| HC-06 | industry_commentary | 2026 | https://www.beckershospitalreview.com/healthcare-information-technology/ehrs/whats-new-with-tefca-in-2026-3-updates/ | TEFCA status 2026: ~500M records exchanged by Feb 2026, over 1B by June 2026; treatment/referral exchange is the most common purpose; partic |
| HC-06 | primary_statistic | 2026 | https://qpp.cms.gov/docs/pi_specifications/Measure%20Specifications/2026-MIPS-Promoting-Interoperability-Enabling-Exchange-Under-TEFCA-Measure.pdf | 2026 MIPS PI measure for TEFCA exchange covers all transitions of care and referrals ordered by the clinician. |
| HC-06 | industry_commentary | 2026 | https://proficienthealth.com/insights-hub/predictions-for-patient-referral-technology-in-2026-recognizing-the-pattern/ | Referral-vendor commentary on persistent fax-based referral workflows. |
| HC-07 | published_study | 2025 | https://www.beckershospitalreview.com/pharmacy/drug-shortages-decline-but-strains-persist-for-health-systems-ashp/ | ASHP national survey: pharmacy staff spent up to 66 hours/week on shortages in 2024; ~1.5 FTE in large hospitals; ~20 hours/week average. |
| HC-07 | industry_commentary | 2026 | https://intuitionlabs.ai/pdfs/drug-shortages-united-states-2026.pdf | Secondary summary citing ASHP/University of Utah: 227 active national shortages in Q2 2026, third straight quarterly increase (unverified ag |
| HC-07 | published_study | unknown | https://www.ajmc.com/view/report-reveals-mounting-burdens-of-drug-shortages-on-us-health-system | Vizient survey: average 24.2 staff hours/week on shortages in 2024 vs 10.5 in 2019. |
| HC-07 | primary_statistic | unknown | https://www.psqh.com/news/survey-99-of-hospital-pharmacists-experiencing-drug-shortages/ | ASHP survey: 99% of hospital pharmacists report experiencing drug shortages. |
| HC-07 | published_study | unknown | https://www.yahoo.com/news/u-hospital-pharmacists-ration-drugs-140709152.html | Survey coverage of hospital pharmacists rationing drugs amid shortages. |
| HC-08 | firsthand_complaint | 2026-06-23 | https://www.npr.org/2026/06/23/nx-s1-5793971/weight-loss-glp1-insurance-coverage | NPR: patient told by physician that PA was on file, then told by pharmacist that Zepbound was denied because insurer found insufficient data |
| HC-08 | primary_statistic | 2026 | https://medi-calrx.dhcs.ca.gov/cms/medicalrx/static-assets/documents/member/GLP1_Changes.pdf | Medi-Cal Rx notice: Wegovy for weight loss alone no longer covered in 2026; prior authorizations approved before the change ended Dec 31, 20 |
| HC-08 | industry_commentary | 2026 | https://tmsbillings.com/blogs/glp-1-billing-guide/ | Billing-vendor guide: most GLP-1 denials trace to benefit routing, diagnosis mismatch, incomplete PA docs, or missed formulary changes; plan |
| HC-08 | primary_statistic | 2026 | https://www.geha.com/~/media93/Project/GEHA/GEHA/documents-files/prescriptions/geha-pharmacy-coverage-for-weight-loss-glp-1-medications.pdf | GEHA 2026 plan document lists Wegovy and Zepbound as non-preferred with PA required. |
| HC-08 | industry_commentary | 2026 | https://www.midwestmindandbodyhealthcare.com/blog/medicare-bridge-after-glp1-denial/ | Clinic blog describing a Medicare GLP-1 Bridge effective July 1, 2026 under which a prior Part D denial does not disqualify the patient (unv |
| HCI-01 | primary_statistic | 2026-03 | https://www.section508.gov/manage/section-508-assessment/2025/findings/accessibility-conformance-outcomes/top-viewed-ict/ | FY2025 governmentwide assessment: 37% of top-viewed public electronic documents fully conformant; 1.1.1 Non-text Content is the most common  |
| HCI-01 | primary_statistic | 2026-03 | https://www.section508.gov/manage/section-508-assessment/2025/executive-summary/ | Average accessibility conformance score 1.96/5 across 212 responding agencies/components; ~half do not routinely test ICT for conformance. |
| HCI-01 | industry_commentary | 2026-03 | https://fedscoop.com/government-tech-largely-falls-short-on-accessibility-requirements-gsa-finds/ | Press summary: nearly a quarter of agencies failed to test at least one of their top digital products. |
| HCI-01 | primary_statistic | 2023-08 | https://www.leighday.co.uk/news/press-releases/2023-news/dwp-in-breach-of-equality-laws-after-failure-to-communicate-accessibly-with-blind-benefits-claimants/ | High Court declared DWP in breach of the Equality Act; claimant got 21 inaccessible/delayed letters vs 2 accessible ones; scanned PDFs witho |
| HCI-01 | industry_commentary | 2023-08-29 | https://www.publictechnology.net/2023/08/29/society-and-welfare/dwp-pays-compensation-over-letters-and-pdfs-sent-to-blind-benefit-claimants/ | DWP agreed to pay compensation and improve services after the ruling. |
| HCI-01 | firsthand_complaint | 2026-06 | https://disabilityhorizons.com/2026/06/accessible-document-sharing-how-we-share-documents-is-important-for-accessibility/ | 2026 article quoting an r/Blind commenter that scanned PDFs lacking OCR leave screen readers with no text to read. |
| HCI-01 | published_study | unknown | https://par.nsf.gov/servlets/purl/10186661 | Study finding blind users frequently find PDF forms very hard to fill with screen readers (meaningless labels, broken reading order) and man |
| HCI-01 | primary_statistic | unknown | https://www.nist.gov/document/rfi-comment-promoting-access-voting-national-federation-blind-attachment | NFB comment to NIST: 43 states had voting forms that were not fully accessible (older filing). |
| HCI-02 | industry_commentary | 2026-04 | https://www.consumerfinancialserviceslawmonitor.com/2026/04/doj-extends-title-ii-ada-web-accessibility-rule-compliance-deadlines-for-state-and-local-governments/ | DOJ interim final rule effective April 20, 2026 pushed Title II web deadlines to April 26, 2027 (50k+ population) and April 26, 2028 (smalle |
| HCI-02 | primary_statistic | unknown | https://www.ada.gov/resources/small-entity-compliance-guide | DOJ small-entity guide: web content and mobile app requirements apply to all state and local governments; hiring an outside developer does n |
| HCI-02 | industry_commentary | unknown | https://www.accessibility.works/blog/ada-title-ii-2-small-cities-towns-compliance-requirements-guide | Vendor guide: no small-entity or volunteer exemption; large-site remediation routinely takes 12-18 months; DOJ has not endorsed overlays. |
| HCI-02 | primary_statistic | unknown | https://www.justice.gov/crt/media/1356141/dl | DOJ finding that a county's election website was inaccessible to individuals with disabilities in violation of Title II. |
| HCI-02 | published_study | 2026 | https://prioritypixels.co.uk/insights/web-accessibility-is-getting-worse-according-to-the-2026-webaim-million-report/ | Summary of 2026 WebAIM Million: 95.9% of home pages have detectable WCAG 2 failures (up from 94.8%), 56.1 errors per page (+10.1%). |
| HCI-02 | industry_commentary | 2026 | https://matthiasott.com/notes/this-still-not-for-everyone | Notes the same six failure categories (contrast, alt text, form labels, empty links/buttons, language) have topped the study for its entire  |
| HCI-02 | industry_commentary | unknown | https://www.mass.gov/doc/americans-with-disabilities-act-title-ii-web-and-mobile-accessibility-information-and-action-steps/download | State guidance for municipalities referencing the separate schedule for entities under 50,000 population. |
| HCI-03 | firsthand_complaint | 2026-04-04 | https://github.com/ollama/ollama/issues/15315 | Gemma 4 tool-call parsing failures across e4b/26b/31b on Linux, macOS and LM Studio; agent clients (opencode, Copilot) hang; maintainer says |
| HCI-03 | firsthand_complaint | 2025-09-04 | https://github.com/ollama/ollama/issues/12187 | GPT-OSS not completing tool calls; open bug with ~41 comments. |
| HCI-03 | firsthand_complaint | 2025 | https://github.com/ollama/ollama/issues/11135 | Qwen3 tool-call hallucination bug (closed). |
| HCI-03 | firsthand_complaint | 2026-06 | https://github.com/open-webui/open-webui/discussions?discussions_q=tool+calling+local+model+not+working | June 2026 discussion: MCP/OpenAPI tool server reachable and lists tools but local models never trigger calls; April 2026 bug that Gemma 4 to |
| HCI-03 | firsthand_complaint | unknown | https://discuss.huggingface.co/t/tool-function-calling-abilities-of-llms-that-are-used-locally-pulled-through-ollama/165277 | User building a database agent reports local Ollama models throwing invalid-tool errors, choosing irrelevant tools or making up answers whil |
| HCI-03 | industry_commentary | unknown | https://pypi.org/project/toolrails/ | Third-party proxy that exists specifically to repair malformed local-model tool calls; its own description says it cannot make a weak model  |
| HCI-03 | firsthand_complaint | 2024-11-27 | https://github.com/ollama/ollama/issues/7865 | Native MCP support request with ~60 thumbs-up, one of the most-upvoted open Ollama issues. |
| HCI-03 | industry_commentary | 2026 | https://www.mindstudio.ai/blog/local-ai-vs-cloud-ai-2026 | Vendor commentary that local models suit well-defined agentic tasks while frontier cloud models remain more reliable for complex tool use an |
| HCI-04 | firsthand_complaint | 2025-10-28 | https://github.com/browser-use/browser-use/issues/3449 | User could not get a product price from Kroger: Akamai bot protection and CAPTCHAs blocked stealth sessions, US proxy, saved profile and the |
| HCI-04 | firsthand_complaint | 2026-10 | https://github.com/browser-use/browser-use/issues?q=is%3Aissue+cloudflare+OR+captcha+OR+%22bot+detection%22 | 61 issues matching anti-bot terms, including 'Reintroduce Stealth' (closed Mar 2026), synthetic-event leak (Mar 2026), local CAPTCHA solving |
| HCI-04 | firsthand_complaint | 2026-10-16 | https://github.com/browser-use/browser-use/issues/6109 | Feature request for Web Bot Auth request signing, reflecting the emerging 'identified agent' standard as a way through anti-bot walls. |
| HCI-05 | primary_statistic | unknown | https://support.apple.com/digital-legacy | Apple requires and verifies legal documentation for a deceased person's account and cannot remove a device passcode without erasing the devi |
| HCI-05 | industry_commentary | unknown | https://www.memorials.com/info/estate-affairs-guide/apple-legacy-contact | Legacy Contact excludes purchased media and iCloud Keychain (passwords, payment info, passkeys). |
| HCI-05 | industry_commentary | unknown | https://www.cipherwill.com/blog/the-big-tech-inheritance-trap-why-your-family-will-be-locked-out-of-your-digital-life | Vendor blog: without a named contact the route is a probate attorney, court petition and an order specific enough for Apple's legal team; fa |
| HCI-05 | published_study | 2026 | https://cs.uwaterloo.ca/~dvogel/gi2026/posters/1022c.pdf | GI 2026 poster (Wermie and Latulipe, Univ. of Manitoba): only four participants in the interview study had set up a legacy contact on at lea |
| HCI-05 | industry_commentary | 2026-11-02 | https://247wallst.com/personal-finance/2026/11/02/his-photos-email-and-online-accounts-will-be-locked-when-he-dies-unless-he-names-a-legacy-contact-it-takes-one-setting-on-his-phone/ | Personal-finance piece (Nov 2, 2026) on accounts being locked at death without a legacy contact; cites a 2026 study that almost none of surv |
| HCI-05 | published_study | 2026-04 | https://nao-ki-mura.pages.dev/chi/2026/crafting-remembrance-beyond-the-self-older-adults-digital-and-material-legacies | CHI 2026 interview study of 14 older adults on digital and material legacies (Thangaraj, Brubaker, Dixon, Pradhan). |
| HCI-06 | published_study | 2026 | https://nexerdigital.com/news-and-thoughts/the-webaim-million-report-2026-what-it-tells-us/ | Summary of the 2026 WebAIM Million: low-contrast text on 83.9% of pages, missing alt text 53.1%, missing form labels 51.0%. |
| HCI-06 | industry_commentary | 2026 | https://testparty.ai/blog/wcag-violations-data | Secondary summary citing WebAIM 2026: empty links 46.3%, empty buttons 30.6%. |
| HCI-06 | firsthand_complaint | 2026 | https://github.com/nvaccess/nvda/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc | Most-reacted open NVDA issues include aria-controls support (open since 2018), aria-describedby on groups in browse mode (2021), aria-sort c |
| HCI-06 | industry_commentary | 2026-07-04 | https://www.digitalapplied.com/blog/web-accessibility-statistics-2026-wcag-lawsuit-data | 2026 statistics and lawsuit-data roundup (content not independently verified in this session). |
| HCI-06 | industry_commentary | 2026 | https://claudefolio.com/blog/your-vibe-coded-app-probably-fails-basic-accessibility | Commentary that AI-generated front-ends commonly fail basic accessibility checks. |
| HCI-07 | industry_commentary | 2026-04-17 | https://elderlawcenterbrevard.com/2026/04/17/digital-tools-protect-older-adults-from-financial-abuse/ | Elder-law guidance recommending password managers for accounts that can reset other accounts (Apple ID/Google) and 2FA; warns compromise of  |
| HCI-07 | industry_commentary | unknown | https://www.elderlawanswers.com/digital-tools-to-protect-older-adults-from-financial-abuse-21402 | Similar guidance; notes AI-generated voice scams imitating a loved one defeat technical defenses. |
| HCI-07 | industry_commentary | unknown | https://clarahomecare.com/articles/smart-tools-to-safeguard-loved-ones-with-dementia-from-scams | Home-care vendor guidance on family-sharing monitoring and mail redirection for people with dementia. |
| HCI-07 | industry_commentary | unknown | https://storypoint.com/resources/health-wellness/what-to-do-elderly-parent-is-being-scammed/ | Senior-living guidance noting that nearly half of elder financial abuse is committed by someone the older adult knows. |
| ID-01 | industry_commentary | 2026 | https://privacysavvy.com/news/privacy/uk-online-safety-act-free-speech | Summarizes Big Brother Watch report: OSA made small community forums too hard to run; a host of ~300 forums shut down with only 2-3 survivin |
| ID-01 | industry_commentary | 2025-08 | https://www.eff.org/deeplinks/2025/08/americans-be-warned-lessons-reddits-chaotic-uk-age-verification-rollout | Documents small forums (parenting, green living, Linux gaming) shutting down or scaling back rather than face vague, expensive compliance; n |
| ID-01 | industry_commentary | 2026 | https://natlawreview.com/article/new-age-verification-reality-compliance-rapidly-expanding-state-regulatory | Roughly half of US states now require some form of age gating with widely varying scope, thresholds and enforcement, a major obstacle for na |
| ID-01 | industry_commentary | 2026 | https://xident.io/blog/us-age-verification-compliance-patchwork-2026/ | Vendor guide noting most state laws mandate verification without specifying qualifying technologies; some cite 'commercially reasonable meth |
| ID-01 | industry_commentary | 2026-07-28 | https://www.techtimes.com/articles/321819/20260728/lords-open-online-safety-act-inquiry-breach-prone-age-checks-strip-adult-privacy.htm | House of Lords opened an inquiry into OSA age-check vendors and breaches in late July 2026 |
| ID-02 | industry_commentary | 2026 | https://www.adaptivesecurity.com/blog/deepfake-statistics-2026-the-data-security-leaders-need-to-know | Aggregates Sumsub 2025-26 (+1,100% deepfake fraud 2024-25), Entrust 2026 (1 in 5 biometric fraud attempts are deepfakes, injection +40%), an |
| ID-02 | industry_commentary | 2026 | https://www.duckduckgoose.ai/blog/how-deepfakes-bypass-kyc | Vendor explainer of three injection/bypass vectors; cites MIT Technology Review April 2026 finding 22 public Telegram channels selling virtu |
| ID-02 | industry_commentary | 2026 | https://www.corsound.ai/blog-posts/how-a-5-dollar-deepfake-beats-your-kyc | Vendor claim that a working KYC bypass costs roughly $5; treat as marketing |
| ID-02 | published_study | 2026-01 | https://arxiv.org/pdf/2601.06241 | Academic paper on agentic microservice framework for deepfake and document fraud detection in KYC pipelines; confirms problem framing, no pr |
| ID-02 | industry_commentary | 2026 | https://www.zyphe.com/resources/blog/identity-verification-statistics | Vendor stat roundup; cites Onfido/Entrust finding digital document forgeries are 57% of document fraud and Signicat deepfake share rising fr |
| ID-03 | primary_statistic | 2025 | https://controld.com/blog/data-broker-report/ | Analysis of California broker filings: 58.0M deletion requests, ~900,000 refused, 22 brokers denied >90% of requests (2024 metrics) |
| ID-03 | primary_statistic | 2026-08 | https://privacy.ca.gov/2026/08/half-a-million-californians-have-signed-up-for-drop-to-delete-their-personal-information-from-data-brokers/ | CalPrivacy: ~500,000 Californians signed up; ~25% of 654 brokers reported processing requests; 99.9% of consumers had profile deleted by at  |
| ID-03 | industry_commentary | 2026 | https://www.freshfields.com/en/our-thinking/blogs/a-fresh-take/drop-is-live-what-data-brokers-need-to-know-as-calprivacy-ramps-up-oversight-102nqhf | Brokers must access DROP every 45 days from Aug 1, 2026 and report status within 45 days; audits start 2028 |
| ID-03 | industry_commentary | 2026 | https://www.legal500.com/intelligence/united-states/privacy/california-data-broker-developments | CalPrivacy penalized LocateSmarter, Cybba and SalesIntel Research for failing to register; enforcement so far centers on registration |
| ID-03 | primary_statistic | 2026-08-13 | https://www.gov.ca.gov/2026/08/13/icymi-california-takes-historic-action-against-data-brokers/ | Governor's office on first state action against a broker that required personal information before honoring opt-outs |
| ID-03 | primary_statistic | 2025-11-13 | https://cppa.ca.gov/announcements/2025/20251113.html | Delete Act regulations approved; 545 brokers registered as of Jan 1, 2026 per related CalPrivacy materials |
| ID-04 | primary_statistic | 2022-11-23 | https://www.consumerfinancemonitor.com/2022/11/23/cfpb-highlights-accuracy-problems-in-two-reports-on-tenant-background-screening-reports/ | Summarizes CFPB reports: ~26,700 complaints, nearly two-thirds alleging false/misleading/outdated info; ~4,500 alleging failure to correct w |
| ID-04 | industry_commentary | 2022-11-23 | https://www.cooley.com/news/insight/2022/2022-11-23-cfpb-reports-highlight-regulatory-concerns-with-tenant-background-checks | Law-firm summary of CFPB findings that screening info is often rife with errors, incomplete or outdated |
| ID-04 | primary_statistic | unknown | https://www.consumerfinance.gov/rules-policy/tenant-background-checks/review-your-rental-background-check/ | CFPB consumer guidance on disputing with both the screening company and the furnisher and filing CFPB complaints |
| ID-04 | industry_commentary | 2022 | https://money.com/tenant-background-checks-problems-cfpb/ | Press coverage: sloppy background checks preventing renters from securing housing |
| ID-04 | firsthand_complaint | unknown | https://www.wsjustice.com/someone-elses-criminal-record-on-background-check/ | FCRA law firm describes recurring wrong-person criminal record cases from similar-identity matching, and an airline offer rescinded after a  |
| ID-04 | industry_commentary | 2026 | https://reliablebackgroundscreening.com/reliable-blog/background-screening-consumer-complaint-statistics-2026/ | Vendor roundup of 2026 complaint statistics for background screening |
| ID-05 | industry_commentary | 2026-09-01 | https://hallrender.com/2026/09/01/ocr-reaches-55th-hipaa-right-of-access-settlement/ | OCR's 55th Right of Access settlement; Azul Vision pays $50,000 after patient waited nearly two years |
| ID-05 | industry_commentary | 2026 | https://www.carusolawoffice.com/post/ocr-azul-vision-hipaa-right-of-access-settlement | Details of Azul Vision settlement and two-year corrective action plan |
| ID-05 | industry_commentary | 2026 | https://www.hipaajournal.com/hipaa-updates-hipaa-changes/ | Right of Access initiative continuing in 2026; proposed rule to shorten response deadline from 30 to 15 days |
| ID-05 | industry_commentary | 2026 | https://www.healthcaredive.com/news/hhs-gets-serious-on-information-blocking-enforcement/813909/ | HHS actively enforcing information blocking; ASTP/ONC issued notices of potential non-conformity to EHR developers in Feb 2026 |
| ID-05 | industry_commentary | 2026 | https://www.reedsmith.com/our-insights/blogs/viewpoints/102nu5x/information-blocking-rules-update-what-diagnostic-radiology-groups-should-know-n/ | ONC identified blanket portal embargoes on radiology reports as likely information blocking, not covered by Preventing Harm exception |
| ID-05 | industry_commentary | 2026 | https://www.birminghammedicalnews.com/article/9403/the-wait-is-over-information-blocking-enforcement-is-officially-here | ONC complaint portal over 2,500 submissions by July 2026, most from patients, most naming providers; front-desk and ROI processes a common s |
| ID-05 | industry_commentary | 2026-09 | https://myurisq.com/2026/09/55-hipaa-right-of-access-enforcement-actions-later/ | Compliance vendor review of 55 enforcement actions asking whether providers are getting the message |
| ID-06 | industry_commentary | 2026-08-08 | https://www.forbes.com/sites/steveweisman/2026/08/08/how-ai-powered-business-email-compromise-scams-are-stealing-billions/ | Reports IC3 2025 BEC figures (24,768 complaints, just over $3B) and AI-augmented BEC trends |
| ID-06 | industry_commentary | 2026-10-28 | https://forbes.com/councils/forbesbusinessdevelopmentcouncil/2026/10/28/your-cfos-voice-is-no-longer-proof-its-your-cfo | Executive commentary that voice recognition is no longer a valid verification control |
| ID-06 | industry_commentary | 2026 | https://aiforaccountants.substack.com/p/when-the-cfo-on-the-call-isnt-real | Accounting-profession guidance on stopping deepfake payment fraud; recounts Arup case |
| ID-06 | industry_commentary | 2026 | https://www.bwcyberservices.com/ai-impersonation-fraud-sec-warning/ | SEC 2026 warning on AI impersonation fraud |
| ID-06 | industry_commentary | 2026 | https://isectech.org/ceo-deepfake-fraud-executive-playbook-2026/ | Case narrative of a $2.3M wire moved in one afternoon via CEO deepfake; vendor-adjacent source |
| ID-06 | industry_commentary | 2026 | https://spycloud.com/blog/fbi-internet-crime-report-2025/ | Summary of IC3 2025 report: 1,008,597 complaints, $20.877B losses; first year account takeover broken out (4,700 complaints, $359.7M) |
| ID-07 | primary_statistic | 2026-10-26 | https://www.helpnetsecurity.com/2026/10/26/transunion-synthetic-identity-fraud-risks-report/ | TransUnion report: ~$2.4B synthetic identity exposure at US lenders as of June 2026, $1.5B in auto lending |
| ID-07 | published_study | 2026 | https://www.cubroadcast.com/news/fraud-is-surging-across-consumer-lending-as-93-of-lenders-report-credit-loss-impact | Celent study commissioned by Zest AI: 93% of lenders say fraud drives credit losses; 82% report increase in 2026; 61% cite synthetic identit |
| ID-07 | industry_commentary | unknown | https://resources.sentilink.com/whitepapers/white-paper-synthetic-fraud-and-credit-unions | Vendor white paper: 15% of synthetic identities target credit unions; CUs issue more credit to synthetics than to real identities |
| ID-07 | industry_commentary | 2026 | https://www.prosightfa.org/insights/frauds-frontlines-how-small-banks-and-credit-unions-must-prepare-in-2026/ | Trade association: credit unions reporting seven-figure losses from account-takeover incidents driven by social engineering |
| ID-07 | industry_commentary | 2026 | https://www.cfodive.com/news/synthetic-identity-fraud-surges-criminals-weaponize-ai/822557/ | Coverage of study finding synthetic identity fraud surging as criminals use AI to generate identities and documents |
| ID-07 | industry_commentary | 2026 | https://www.biia.com/synthetic-identity-fraud-statistics-2026-hard-numbers-big-threats/ | Statistics roundup including projection of >$3.1B unsecured losses in 2026 vs $1.8B in 2020 |
| ID-08 | industry_commentary | 2026 | https://www.pymnts.com/news/artificial-intelligence/2026/visa-and-mastercard-put-tokens-in-charge-of-ai-commerce/ | Describes Visa Intelligent Commerce scoped tokens and Mastercard Agentic Tokens bound to agent, merchant scope and consent |
| ID-08 | industry_commentary | 2026 | https://www.digitalapplied.com/blog/agent-checkout-authentication-card-networks-2026 | Notes Visa and Mastercard ship scoped-credential rails but neither has published a binding chargeback rule for agent disputes |
| ID-08 | industry_commentary | 2026-06 | https://www.digitalapplied.com/blog/visa-openai-tokenized-agentic-commerce-payments-merchant-guide | June 10, 2026 Visa-OpenAI announcement: tokenized credentials power agent checkout in ChatGPT/Codex with spending limits enforced before aut |
| ID-08 | published_study | 2026 | https://www.elibrary.imf.org/view/journals/068/2026/004/article-A001-en.xml | IMF note: traditional authorization (KYC, MFA) assumes human users explicitly approving transactions; frames delegation/authorization layer  |
| ID-08 | published_study | 2026-03 | https://arxiv.org/pdf/2603.24775 | Agent Identity Protocol proposal for verifiable delegation across MCP and A2A |
| ID-08 | published_study | 2026-09 | https://arxiv.org/pdf/2609.14744 | Runtime authorization for resources acquired by AI agents |
| ID-08 | industry_commentary | 2026 | https://hypernovelty.institute/signals/when-agentic-commerce-leaves-the-demo-store/ | Observes that an authorization within a limit can still fail when funds must move; no jurisdiction has enacted agentic-commerce regulation a |
| MFG-01 | firsthand_complaint | unknown | https://practicalmachinist.com/forum/threads/overwhelming-rfq-backlog-strategies-on-being-selective-bidding-quickly.377904/ | Shop owners describe RFQ backlog when quoting process takes too long internally and share triage strategies. |
| MFG-01 | firsthand_complaint | unknown | https://www.practicalmachinist.com/forum/threads/average-quote-turn-around-time-for-custom-tooling.363339/ | Buyer reports ordering from first responders before other quotes arrive; shops say slow quotes lose work. |
| MFG-01 | firsthand_complaint | unknown | https://www.practicalmachinist.com/forum/threads/what-percentage-of-quotes-do-you-win.210474/ | Owners report quote win rates and one describes win rate halving as quote volume increased. |
| MFG-01 | firsthand_complaint | 2026 | https://www.practicalmachinist.com/forum/threads/how-do-you-quickly-check-part-dimensions-when-you-get-an-rfq.446120/ | Recent (~9 months old) thread on how to quickly extract dimensions from RFQ prints; PDFs needed because CAD lacks tolerances/threads. |
| MFG-01 | industry_commentary | unknown | https://www.mmsonline.com/articles/when-it-comes-to-rfq-response-time-is-money | Modern Machine Shop/Paperless Parts case study claiming 6x faster quoting after switching tools (vendor-adjacent). |
| MFG-01 | industry_commentary | unknown | https://www.trustbridge.pro/blogs/post/how-do-you-know-whether-you-re-losing-manufacturing-jobs-on-price-lead-time-or-something-else-entire | Summarizes forum-reported win rates (5-10% new prospects, ~50% repeat) and vendor 24h-vs-48h claim. |
| MFG-02 | primary_statistic | 2026-07-13 | https://legacy.sba.gov/article/2026/07/13/sba-commends-us-department-wars-suspension-cmmc-phase-ii-small-defense-contractors | SBA cites compliance cost up to ~$593,800 per certification (C3PAO) and ~$388,600 (self) and commends Phase II suspension. |
| MFG-02 | primary_statistic | 2026-07-13 | https://business.defense.gov/Engage/News/Article/4542563/forging-the-arsenal-of-freedom-department-of-war-suspends-cmmc-phase-ii-require/ | DoW announcement suspending Phase II and creating a CMMC Reform Task Force for a 60-day review; Phase I and NIST 800-171 obligations remain. |
| MFG-02 | industry_commentary | 2026-07 | https://federalnewsnetwork.com/cybersecurity/2026/07/pentagon-suspends-cmmc-phase-two-requirements-launches-review-of-program/ | News coverage of the suspension and program review. |
| MFG-02 | published_study | 2026 | https://www.csis.org/analysis/what-cmmc-pause-means-defense-industrial-base | CSIS analysis of the pause's effect on the defense industrial base. |
| MFG-02 | industry_commentary | 2025-09 | https://www.preveil.com/blog/cmmc-final-rule-published/ | 48 CFR rule published Sept 10, 2025, effective Nov 10, 2025 (Phase 1 start). |
| MFG-02 | industry_commentary | 2026 | https://getuniqcli.com/insights/cmmc-enforcement-2026 | Third-party estimate of C3PAO lead times 3-12 months, possibly 24-30 months by late 2026 (unverified). |
| MFG-02 | industry_commentary | 2026 | https://secureframe.com/blog/cmmc-small-business | Vendor cost ranges ($34k-$112k implementation; $30k-$60k assessment) and note that no small-business exemption exists. |
| MFG-02 | industry_commentary | 2024-02 | https://downloads.regulations.gov/DOD-2023-OS-0063-0252/attachment_1.pdf | NDIA public comment arguing CMMC 2.0 increases cost and scope beyond current contractual requirements, especially for SMBs. |
| MFG-03 | primary_statistic | 2026-06-24 | https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other | CBP Federal Register notice indefinitely suspending de minimis for all non-postal modes; requires informal or formal entry. |
| MFG-03 | industry_commentary | 2025 | https://www.bdo.com/insights/tax/cbp-suspends-de-minimis-exemption-and-introduces-new-postal-entry-requirements | BDO summary of suspension and new postal entry requirements. |
| MFG-03 | industry_commentary | 2026 | https://strixsmart.com/resources/blog/de-minimis-suspension-self-filing | Describes bond requirement for formal entries and FY2026 MPF rate (0.3464%, $33.58 min / $651.50 max). |
| MFG-03 | industry_commentary | 2026 | https://useripple.io/insights/the-end-of-de-minimis-a-guide-for-brokers-and-forwarders | Broker-side view: structural increase in workload, liability exposure and client-service complexity. |
| MFG-03 | industry_commentary | 2026-04-03 | https://www.kusskefinancial.com/2026/04/03/small-business-coping-with-the-end-of-de-minimis-imports/ | Advisor article on how small businesses are coping with de minimis ending. |
| MFG-03 | industry_commentary | 2026 | https://www.dripcapital.com/en-us/resources/blog/de-minimis-exemption-ended-us-importers | Importer guide listing 10-digit HTS, declared value, duty payment now required on each shipment; notes OBBBA statutory repeal effective July |
| MFG-04 | industry_commentary | 2026-09 | https://www.thompsonhinesmartrade.com/2026/09/cbp-confirms-october-6-2026-launch-of-phase-3-of-the-ieepa-tariff-refund-process/ | Law firm confirms Phase 3 launch Oct 6, 2026, limited to importers with pending CIT cases. |
| MFG-04 | industry_commentary | 2026-06 | https://www.thompsonhine.com/insights/cbp-launches-phase-2-of-the-ieepa-tariff-refund-process-and-confirms-development-of-phase-3/ | Describes Phase 2 (reconciliation entries) and the phased CAPE structure. |
| MFG-04 | industry_commentary | 2026 | https://www.avalara.com/us/en/blog/how-to-request-tariff-refunds.html | Reports Supreme Court ruling Feb 20, 2026 and CAPE refunds starting Apr 20, 2026; cites ~$136.6B accepted claims and 20,362 refunds (~$1.1B) |
| MFG-04 | industry_commentary | 2026 | https://www.amundsendavislaw.com/alert-ieepa-tariff-refunds-cape-phase-iii | Importers with finally liquidated entries may need to file suit; government appealed that portion of the order. |
| MFG-04 | industry_commentary | 2026 | https://www.claconnect.com/en/resources/articles/26/tariff-refunds | CPA-firm FAQ: refunds only to importer of record or Form 4811 notify party; not automatic; ACE filing required. |
| MFG-04 | industry_commentary | 2026 | https://www.ups.com/us/en/supplychain/logistics-solutions/customs-brokerage/us-customs-tariff-refunds | Carrier brokerage markets a paid refund-filing service, indicating importers cannot easily self-serve. |
| MFG-05 | primary_statistic | 2026-02 | https://lockheedmartin.com/content/dam/lockheed-martin/uk/documents/suppliers/SQAG001.pdf | Lockheed Martin UK FAI guidebook Issue 6 (Feb 2026): FAIR must be reviewed and approved by LMUK supplier quality before any material shipmen |
| MFG-05 | industry_commentary | unknown | https://www.ideagen.com/thought-leadership/blog/first-article-inspection-report | Vendor estimates complex FAIR with 200+ characteristics at 8-24+ engineering hours. |
| MFG-05 | industry_commentary | unknown | https://connect981.com/blog-posts/as9102-software-digital-first-article-inspection-for-aerospace-manufacturing | Vendor says manual FAIR can take a full day per part; claims automated ballooning reduces to under 2 hours. |
| MFG-05 | industry_commentary | unknown | https://precisionam.com/articles/quality-compliance/aerospace-machining-inspection-documentation-requirements/ | Notes that chasing a missing special-process certificate or unordered supplier package can take weeks; calendar delay is paperwork, not meas |
| MFG-05 | primary_statistic | 2020-03-16 | https://www.lmiaerospace.com/application/files/9816/9928/4663/FAI_STD-001.pdf | Tier-1 (LMI Aerospace) FAI guideline Rev L showing customer-specific FAIR requirements layered on AS9102. |
| MFG-05 | industry_commentary | unknown | https://www.inspectionxpert.com/fai/as9102 | Vendor description of Forms 1-3 and ballooning burden; documentation burden did not shrink with Rev C. |
| MFG-06 | firsthand_complaint | 2026-03 | https://www.capterra.com/p/182990/GCPAY/reviews/ | March 2026 user review complains that compliance issues hold up pay app submission while waiting on the GC to clear them. |
| MFG-06 | industry_commentary | 2026 | https://ustechautomations.com/resources/blog/automate-reconcile-subcontractor-pay-applications-2026 | 2026 reconciliation guide describing certified-payroll checks, end-of-month 48-hour submission crunch, and 35-50% lien waiver chase rate (ve |
| MFG-06 | industry_commentary | 2026 | https://constructionbids.ai/blog/construction-payment-applications-guide | Lists common pay-app rejection reasons: arithmetic errors, overstated percent-complete, missing/unsigned lien waivers, stored materials, mis |
| MFG-06 | industry_commentary | 2026 | https://www.siteline.com/blog/best-construction-billing-software-for-subcontractors | Vendor roundup showing the crowded sub-billing tool market (Siteline, GCPay, Procore Pay, Built, Trimble Pay). |
| MFG-06 | industry_commentary | unknown | https://www.docsumo.com/blog/construction-ap-automation | Describes AP-side burden of pay apps, lien waivers and COIs. |
| MFG-07 | industry_commentary | 2026 | https://www.thoropass.com/blog/itar-audit-cost-guide | Reports $3,000 Tier 1 DDTC fee effective Jan 2025 and an illustrative ~$85k/yr ongoing cost for a small firm. |
| MFG-07 | industry_commentary | 2026 | https://tglobeconsultants.com/itar-consultant/ | Consultant estimates $20k-$60k year-one consulting for small/mid suppliers; $20k-$40k plus fee for 10-50 employee shops. |
| MFG-07 | industry_commentary | unknown | https://precisionam.com/articles/defense/itar-compliance-steps-contract-manufacturers/ | Estimates $50k-$150k for a full program at mid-sized contract manufacturers. |
| MFG-07 | industry_commentary | 2026 | https://www.lightsoutcnc.com/journal-cmmc-itar-small-machine-shops | Shop-oriented blog on CMMC+ITAR for small machine shops; notes lapsed registration means paying back fees for the gap; claims C3PAO certific |
| MFG-07 | industry_commentary | unknown | https://itarconsultant.us/blog/itar-registration-cost-defense-contractors-actually-pay/ | Gives $2,250-$4,750 tiered fee range citing 22 CFR 122.3(a); conflicts with other sources, unconfirmed. |
| MFG-07 | industry_commentary | 2026 | https://screenshield.dev/blog/itar-fabrication-compliance-guide | 2026 guide noting DFARS 252.204-7012 cyber expectations stack on ITAR for fabrication shops. |
| MFG-08 | industry_commentary | 2026-02-04 | https://www.aabb.org/news-resources/news/article/2026/02/04/fda-implements-quality-management-system-regulation-for-medical-devices | Reports QMSR took effect Feb 2, 2026 incorporating ISO 13485:2016 by reference; QSIT retired. |
| MFG-08 | industry_commentary | 2024 | https://medtechintelligence.com/news_article/fda-adopts-iso-13485-with-qmsr-final-rule/ | Final rule coverage; FDA estimated annualized net cost savings of more than $500 million industry-wide. |
| MFG-08 | industry_commentary | 2026 | https://www.greenlight.guru/blog/qmsr-quality-management-system-regulation | eQMS vendor explanation of QSR-to-QMSR changes; notes small firms needing documentation overhaul as the exception to FDA's low-burden expect |
| MFG-08 | industry_commentary | 2026 | https://www.thefdagroup.com/blog/qmsr-quality-management-system-regulation | Consultancy guide stating small firms bear a larger share of transition cost (no dollar figures). |
| MFG-08 | industry_commentary | 2026-02-26 | https://intuitionlabs.ai/articles/fda-qmsr-iso-13485-changes-2026 | Describes inspection shift to Compliance Program 7382.850 and that ISO certification does not replace FDA inspection. |
| MKT-01 | primary_statistic | 2026 | https://www.pymnts.com/news/artificial-intelligence/2026/how-23-percent-of-merchants-captuared-retails-next-agentic-commerce-advantage/ | Visa-sponsored survey: 23% of merchants can identify both AI traffic and purchases; 21% see traffic but cannot link to orders |
| MKT-01 | primary_statistic | 2026-04 | https://decrypt.co/364733/ai-traffic-us-retailers-jumps-q1-agentic-shoppers-outspend-humans | Adobe Digital Insights: AI-referred retail traffic +393% YoY Q1 2026, converts 42% better |
| MKT-01 | industry_commentary | 2026 | https://www.bcg.com/publications/2026/retailers-win-ai-shopping-agents | Agent referrals <1% of visits late 2025, could reach ~5% by end 2026; referral counts understate influence |
| MKT-01 | industry_commentary | 2026 | https://www.pymnts.com/news/retail/2026/ai-agents-knock-retailers-decide-how-wide-to-open-the-door/ | Retailers split: QVC allows agent checkout, Tapestry and Amazon block outside agents |
| MKT-01 | industry_commentary | 2026-03-20 | https://www.cnbc.com/2026/03/20/open-ai-agentic-shopping-etsy-shopify-walmart-amazon.html | Instant Checkout onboarding described as arduous, item info often inaccurate, ~30 Shopify merchants live, Etsy volume low |
| MKT-01 | industry_commentary | 2026 | https://merchantcostconsulting.com/lower-credit-card-processing-fees/openai-instant-checkout-chatgpt/ | Reported 4% merchant fee on Instant Checkout orders; OpenAI never published the rate |
| MKT-01 | firsthand_complaint | 2026-10-17 | https://github.com/TecharoHQ/anubis/issues/2044 | hgweb operator says bots still pass difficulty-6 challenge; contributor says bot IPs are residential, likely proxy networks |
| MKT-01 | firsthand_complaint | 2026-10-15 | https://github.com/agentic-commerce-protocol/agentic-commerce-protocol/issues/315 | ACP issue: 'merchant has no stored agent identity' |
| MKT-01 | firsthand_complaint | 2026-08-19 | https://github.com/agentic-commerce-protocol/agentic-commerce-protocol/issues/297 | ACP OpenAPI rejects six fields its own JSON schema declares; several similar schema-mismatch issues |
| MKT-02 | firsthand_complaint | 2026-05-03 | https://github.com/stripe/agent-toolkit/issues/402 | Developer reproduces duplicate charges from agent-level retries; 49 comments through Oct 8, 2026; no Stripe maintainer response visible |
| MKT-02 | firsthand_complaint | 2026-08-29 | https://github.com/stripe/agent-toolkit/issues/508 | v0.7.x silently ignores removed configuration.actions policy, fail-opening the toolset |
| MKT-02 | firsthand_complaint | 2026-09-18 | https://github.com/stripe/agent-toolkit/issues/531 | Developer asks for a third-party spend/policy check before Stripe MCP tools execute |
| MKT-02 | firsthand_complaint | 2026-09-02 | https://github.com/google-agentic-commerce/AP2/issues | AP2 bug: verifiers never consume an accepted closed Payment Mandate, one consent redeemable for multiple payments; budget cap unit and float |
| MKT-02 | firsthand_complaint | 2026-08-10 | https://github.com/agentic-commerce-protocol/agentic-commerce-protocol/issues/295 | ACP MCP binding makes mandatory Idempotency-Key optional for mutating checkout tools |
| MKT-02 | industry_commentary | 2026 | https://letsdatascience.com/news/x402-reveals-approval-gap-in-agentic-micropayments-761bf8e7 | Developers still need spending limits and allowlists; they are not built into x402 implementations |
| MKT-03 | firsthand_complaint | 2026-09-09 | https://github.com/agentic-commerce-protocol/agentic-commerce-protocol/issues/303 | SEP proposing a dispute-resolution extension; cites Worldpay on unresolved liability and lists non-fraud dispute cases ACP/AP2 do not handle |
| MKT-03 | firsthand_complaint | 2026-08-21 | https://github.com/google-agentic-commerce/AP2/issues/338 | 34-comment thread: spec leaves retention/retrieval of mandate evidence undefined; keys cannot be re-verified over 5-7 year dispute windows;  |
| MKT-03 | firsthand_complaint | 2026-10-21 | https://github.com/google-agentic-commerce/AP2/issues | Open issue: no revocation path for open mandates (standing agent authority cannot be rescinded) |
| MKT-03 | industry_commentary | 2026 | https://www.nuvei.com/posts/openai-tried-to-checkout-it-couldnt | PSP commentary on why OpenAI retreated from in-chat checkout |
| MKT-04 | published_study | 2026-05 | https://arxiv.org/pdf/2605.11781 | Five practical attacks on x402 leading to unpaid-service or paid-but-denied |
| MKT-04 | published_study | 2026-03 | https://arxiv.org/pdf/2603.01179 | A402: facilitators broadcast payments without verifying execution occurred |
| MKT-04 | published_study | 2026-05 | https://arxiv.org/pdf/2605.30998 | Systematic security analysis of free-riding on x402 payments |
| MKT-04 | primary_statistic | 2026 | https://www.pymnts.com/news/artificial-intelligence/2026/agentic-payments-are-growing-most-x402-payments-are-not-from-ai-agents | TRM Labs: only a fraction of x402 payments attributable to AI agents; adjusted volume down ~77% from Nov 2025 peak |
| MKT-04 | industry_commentary | 2026-03-11 | https://www.coindesk.com/markets/2026/03/11/coinbase-backed-ai-payments-protocol-wants-to-fix-micropayment-but-demand-is-just-not-there-yet | Demand for agent micropayments not yet present |
| MKT-04 | firsthand_complaint | 2026 | https://dev.to/nathanielc85523/agent-payments-in-2026-x402-vs-mpp-and-why-we-built-both-4df3 | Developer with production traffic: agents probe x402 endpoints but conversion requires funded wallets/sessions; bottleneck is not UX or pric |
| MKT-04 | firsthand_complaint | 2026-09-24 | https://github.com/stripe/agent-toolkit/issues/545 | Request for a feeless settlement asset for agent micropayments |
| MKT-05 | firsthand_complaint | 2026-10-17 | https://github.com/TecharoHQ/anubis/issues/2044 | hgweb operator: bots still pass difficulty-6 challenge; re-enabled password auth; contributor says residential-proxy IPs |
| MKT-05 | firsthand_complaint | 2026-07-22 | https://github.com/ai-robots-txt/ai.robots.txt/issues/244 | Site owner posts stats: nbot 26,772 hits, 2,375 MB bandwidth in one month |
| MKT-05 | firsthand_complaint | 2026-10-01 | https://github.com/TecharoHQ/anubis/issues/1994 | Anubis sometimes fails to whitelist Internet Archive crawler (false positive) |
| MKT-05 | industry_commentary | 2026 | https://ppc.land/cloudflare-stops-charging-ai-per-crawl-and-starts-paying-per-answer/ | Cloudflare moving from Pay Per Crawl to Pay Per Use; negotiated deals do not scale beyond largest publishers |
| MKT-05 | industry_commentary | 2026-07 | https://thenextweb.com/news/cloudflare-block-ai-crawlers-pay-publishers | Sept 15, 2026 deadline: AI training/agents blocked by default on ad pages unless site opts in |
| MKT-05 | industry_commentary | 2026 | https://adriandunkley.net/blog/cloudflare-pay-per-crawl-caribbean-data-2026 | Estimates tens to low hundreds of dollars/month for a million-page-view site; applies only to Cloudflare-routed sites |
| MKT-05 | primary_statistic | 2025-09-16 | https://github.com/rslstandard/rsl/issues | RSL standard repo shows a single open issue since Sept 2025, indicating thin implementer activity |
| MKT-06 | firsthand_complaint | 2026-05-02 | https://github.com/Polymarket/py-clob-client/issues/338 | Trader documents ~35% settlement reverts after V2 cutover, asymmetric against winners; 3 confirmations; no maintainer reply; repo archived |
| MKT-06 | firsthand_complaint | 2026-04-12 | https://github.com/Polymarket/py-clob-client/issues/328 | Matched maker orders not delivering CTF tokens ~50% of the time |
| MKT-06 | industry_commentary | 2026-08-07 | https://www.coindesk.com/business/2026/08/07/how-a-five-second-trick-let-traders-drain-millions-from-polymarket | Study found exploit; Polymarket overhauled crypto resolution to TWAP after months of complaints |
| MKT-06 | industry_commentary | 2026 | https://www.alphascope.app/blog/prediction-market-resolution-disputes | Summarizes WSJ finding on UMA voter concentration, Kalshi NFL mis-grading, Discord-only recourse, $54M class action |
| MKT-06 | industry_commentary | 2026 | https://alienwp.com/polymarket-and-kalshi-under-regulatory-scrutiny-over-trading-and-dispute-resolution/ | Regulatory scrutiny of both platforms' dispute resolution; CFTC complaints |
| MKT-06 | industry_commentary | 2026 | https://www.bloomberg.com/features/2026-prediction-markets-polymarket-kalshi/ | Bloomberg feature on Polymarket/Kalshi growth and resolution controversies |
| MKT-07 | industry_commentary | 2026 | https://www.fenwick.com/insights/publications/end-silent-ai-emerging-ai-exclusions-coverage-fragmentation-and-practical-implications | Law-firm analysis: end of silent AI coverage, fragmentation across cyber/E&O/D&O/EPLI |
| MKT-07 | industry_commentary | 2026-08-17 | https://www.ud.hk/en/blogs/insight/article/ai-insurance-gap-2026-08-17 | ISO generative AI exclusions attaching to CGL renewals from Jan 2026 |
| MKT-07 | industry_commentary | 2026 | https://www.inekia.io/en/insights/ai-safety-failures-production-liability-insurance-gaps-enterprises | 60+ P&C groups filed AI exclusions by July 2026; dedicated AI liability market ~$130M (single secondary source) |
| MKT-07 | published_study | 2026-05 | https://arxiv.org/pdf/2605.18784 | Maps AI threats to affirmative coverage, silent exposures, exclusions; names emerging products |
| MKT-07 | published_study | 2026-07 | https://arxiv.org/pdf/2607.11999 | Blueprint for an AI insurance stack; distinguishes first-party vs third-party agent losses |
| MKT-07 | industry_commentary | 2026 | https://www.metaintro.com/blog/insurers-refusing-cover-ai-mistakes-2026-job-impact | Names carriers filing or using AI exclusions |
| MKT-08 | published_study | 2026-05-13 | https://www.hrw.org/feature/2026/05/13/algorithms-of-exploitation/rights-abuses-in-the-gig-economy-and-the-global-fight | Human Rights Watch feature documenting repeated algorithmic suspensions leaving workers without income |
| MKT-08 | industry_commentary | 2026 | https://platformresearch.org/blog/gig-workers-can-fight-the-algorithm-only-the-ones-who-can | Reports Seattle OLS resolved 13 deactivation cases in Q1 2026 across Grubhub, DoorDash, Uber Eats, Instacart, Amazon Flex, Rover; Grubhub pe |
| MKT-08 | published_study | 2026-09 | https://kenradio.substack.com/p/who-judges-the-algorithm | Cites Sept 2026 Uber driver study: 30% no explanation, 3% investigated, language/race disparities |
| MKT-08 | firsthand_complaint | 2026 | https://unstar.app/blog/uber-driver-doordash-instacart-shopper-lyft-amazon-flex-gig-driver-apps-ranked-2026 | Review of 1-3 star app reviews early 2026: appeals slow and opaque across five apps |
| MKT-08 | industry_commentary | 2026 | https://gridwise.io/blog/gig-driver-deactivation-appeal | Amazon Flex appeals 7-10 days normally, 3-4 weeks at peak; DoorDash in-app appeals March 2026 |
| MKT-08 | published_study | 2025-05 | https://arxiv.org/html/2505.08904v1 | FareShare: tool for organizers to estimate lost wages and contest algorithmic deactivations |
| NRG-01 | primary_statistic | unknown | https://www.pge.com/en/clean-energy/solar/getting-started-with-solar.html | PG&E states PTO normally 5-10 business days, max 30 business days, after complete contractor paperwork. |
| NRG-01 | firsthand_complaint | 2025-12 | https://docs.cpuc.ca.gov/PublishedDocs/Efile/G000/M590/K904/590904796.PDF | CPUC filing: PG&E agreed Dec 15, 2025 to compensate a customer for delayed PTO on his solar system, settling a complaint. |
| NRG-01 | firsthand_complaint | 2025 | https://docs.cpuc.ca.gov/PublishedDocs/Efile/G000/M586/K578/586578927.PDF | CPUC complaint describing PG&E revoking PTO for one installer's systems and offering 'Conditional PTO', alleged Rule 21 violation. |
| NRG-01 | industry_commentary | 2026 | https://uspowersolar.com/blog/california-utilities-delay-solar-hookups-faster-with-us-power | Installer blog claims SCE and PG&E are processing applications 4-12 weeks, beyond mandated timelines (vendor source). |
| NRG-01 | industry_commentary | 2026 | https://uspowersolar.com/blog/why-is-my-solar-installation-taking-so-long | Installer guide puts California contract-to-PTO at 3-6 months. |
| NRG-01 | firsthand_complaint | 2026 | https://www.justanswer.com/tax/toj8l-solar-tax-credit-permission-to-operate-delay.html | Homeowner asking whether a system finished in 2025 but with PTO delayed into 2026 still qualifies for the federal credit. |
| NRG-02 | industry_commentary | 2026 | https://nrgcleanpower.com/learning-center/freedom-forever-files-for-bankruptcy/ | Installer write-up of Freedom Forever Chapter 11 (Apr 15, 2026), ~2 GW installed across 35 states. |
| NRG-02 | industry_commentary | 2026-06-03 | https://endmysolar.com/2026/06/03/what-happens-if-my-solar-company-goes-out-of-business/ | Lists Titan, SunPower, Sunnova, PosiGen, Freedom Forever as failed 2024-2026; notes Texas AG investigation and Chapter 7 proof-of-claim dead |
| NRG-02 | industry_commentary | 2026 | https://www.24-7pressrelease.com/press-release/536853/california-solar-exit-reports-rise-in-solar-cancellation-requests-following-freedom-forever-bankruptcy-filing | Press release reporting rising California cancellation requests after the Freedom Forever filing (self-interested source). |
| NRG-02 | industry_commentary | unknown | https://www.energysage.com/solar/solar-company-warranty-bankruptcy/ | Explains that equipment warranties survive but installer workmanship warranties typically do not. |
| NRG-02 | industry_commentary | 2026 | https://www.electricare.com/orphan-solar-help/ | Example of installers building dedicated 'orphaned solar' service offerings, evidence of a paying market. |
| NRG-02 | industry_commentary | 2026 | https://solarcc.com/the-ultimate-guide-to-solar-company-bankruptcies/ | Timeline of SunPower, Sunnova/Mosaic, Titan, ADT Solar failures tied to NEM 3.0 and financing costs; cites Wood Mackenzie 21% residential de |
| NRG-03 | industry_commentary | 2026 | https://unicolorado.com/colorado-hear-rebates-2026/ | Contractor page stating Colorado HEAR closed Front Range Apr 28, 2026 and statewide Aug 1, 2026. |
| NRG-03 | industry_commentary | 2026 | https://gridshiftmedia.com/ | State tracker listing Georgia paused, California waitlisted, Connecticut not launched; cites May 29, 2026 notice ending federal HEAR for fos |
| NRG-03 | industry_commentary | 2026 | https://heatpumplocator.com/guides/heat-pump-tax-credit-2026 | Guide on what is left after 25C expired; says forum users consistently name paperwork as the most frustrating step (low-authority). |
| NRG-03 | industry_commentary | 2026 | https://lucasair.com/heat-pump-tax-credit/ | HVAC contractor confirming no federal heat pump credit in 2026 and listing remaining rebates and a documentation checklist. |
| NRG-03 | industry_commentary | 2026 | https://justheatpumpsllc.com/how-the-colorado-hear-heat-pump-rebates-work-how-to-apply/ | Contractor walkthrough of HEAR application steps; advises getting rebate commitment in writing before contract. |
| NRG-03 | industry_commentary | 2026 | https://energyrebatecalculator.com/guide/hear-program-guide | Describes HEAR as point-of-sale in some states, conflicting with contractor accounts of heavy documentation, illustrating state-by-state inc |
| NRG-04 | firsthand_complaint | 2026-08-06 | https://github.com/rocketraman/open-green-button-homeassistant/issues/10 | User's Alectra (Ontario) GBC authorization returns HTTP 202 'preparing data asynchronously' for hours; maintainer iterated through 0.2.0-0.3 |
| NRG-04 | primary_statistic | 2026-11-02 | https://github.com/topics/green-button | 47 repositories, many single-utility scrapers/importers (Pacific Power, Con Edison, Consumers Energy, Elexicon, Toronto Hydro, PG&E) updated |
| NRG-04 | industry_commentary | 2026 | https://www.the-messenger.com/dawson_springs_progress/news/article_ff37b025-5522-59dd-9fd3-b1ed5e1ac9c3.html | Mission:data called LG&E/KU's Green Button Connect 'non-functional' in Dec 2025 testimony; utility disputes it. |
| NRG-04 | industry_commentary | 2025 | https://utilityapi.com/resource/the-future-of-energy-is-stuck-at-the-login-screen | Aggregator argues many utility GBC APIs don't meet the standard; Hawaiian Electric's had zero users as of Jan 1, 2025 (vendor source). |
| NRG-04 | firsthand_complaint | 2026 | https://community.home-assistant.io/t/utility-energy-data-integration-via-green-button-connect/1016031 | Home Assistant community thread on integrating utility data via Green Button Connect. |
| NRG-05 | primary_statistic | 2026-06 | https://www.utilitydive.com/news/texas-facing-438-gw-queue-approves-initial-large-load-interconnection-pro/823367/ | ERCOT large-load queue at 438 GW when initial process approved. |
| NRG-05 | primary_statistic | 2026-08 | https://www.utilitydive.com/news/facing-an-estimated-474-gw-of-interconnection-requests-texas-hits-pause-data-center-interconnections/827046/ | Texas pauses data center interconnections pending audit; ~474 GW requested; Abbott letter says ~90% are data centers. |
| NRG-05 | primary_statistic | 2026 | https://www.utilitydive.com/news/ercots-large-load-queue-jumped-almost-300-last-year-official/808820/ | ERCOT official says large-load queue grew almost 300% in a year. |
| NRG-05 | industry_commentary | 2026 | https://www.utilitydive.com/news/efforts-to-curb-data-center-speculation-gain-ground-across-the-us/830495/ | Multi-state efforts to curb speculative data center requests; utilities adding fees, collateral, forecast exclusions. |
| NRG-05 | published_study | 2026-06 | https://eta-publications.lbl.gov/sites/default/files/2026-06/queued_up_2026_edition.pdf | LBNL Queued Up 2026: ~2,061 GW active generation+storage capacity across 8,244 projects, context for the generation-side queue. |
| NRG-06 | industry_commentary | 2026 | https://chargecostlab.com/blog/ev-charging-reliability-report-2026 | Cites ChargerHelp 2025 report: 98.7-99.9% reported uptime vs 71% session success across 100k sessions / 2,400 chargers; notes no independent |
| NRG-06 | published_study | unknown | https://efiling.energy.ca.gov/GetDocument.aspx?tn=264470&DocumentContentId=101329 | California Energy Commission document on tracking and improving reliability of the state's EV chargers (primary regulator source). |
| NRG-06 | industry_commentary | 2026 | https://www.evrange.com/nevi | NEVI 2026 status guide; 97% per-port rolling 12-month uptime requirement under 23 CFR 680. |
| NRG-06 | industry_commentary | 2026 | https://oxmaint.com/industries/government/government-ev-charger-maintenance-chargepoint-evse-nevi | Vendor page on NEVI compliance maintenance; describes CA 97% uptime rule with hourly reporting for incentive-funded DCFC. |
| NRG-06 | industry_commentary | 2026 | https://www.zest.uk.com/news/ev-charging-reliability-in-2026-what-the-data-really-shows | UK comparison: only 3.9% of operators met the 99% rapid-charger mandate per 2025 Monta survey. |
| NRG-07 | primary_statistic | 2026 | https://www.nyc.gov/assets/buildings/pdf/cov_build-sn.pdf | DOB 2026 Covered Buildings List memo: compliance path may differ from prior year; some path changes move the next report to 2027; deadlines  |
| NRG-07 | industry_commentary | 2026 | https://violationwatch.nyc/resources/local-law-97-nyc-compliance-2026 | 2026 guide: May 1 deadline, 60-day grace to June 30, extension to Aug 29 for $60; penalty figures. |
| NRG-07 | industry_commentary | 2026 | https://envigilance.com/blog/local-law-97-compliance-avoid-fines/ | $268/ton overage and $0.50/sq ft/month non-filing penalties; claims non-filing is often costlier than overage. |
| NRG-07 | industry_commentary | 2026 | https://lldesk.ai/blog/ll97-in-2026-what-owners-need-to-know | Vendor claims ~93% first-year filing rate and DOB Notices of Deficiency to non-filers (unverified). |
| NRG-07 | industry_commentary | unknown | https://accelerator.nyc/building-laws/ll97 | City-funded NYC Accelerator program page, evidence of public spending on compliance help. |
| NRG-08 | industry_commentary | 2026 | https://www.dallasnews.com/news/watchdog/article/texas-electricity-overpaying-retail-energy-22350098.php | Dallas Morning News watchdog: Texas electricity companies structure plans so customers overpay. |
| NRG-08 | industry_commentary | 2026 | https://vipenergyservice.com/texas/texas-households-overpaying-480-electricity-plan-tricks/ | Retailer blog citing Jun 2026 Retail Energy Revealed report: ~$4B / ~$480 per household overpayment in Texas in 2024 (self-interested, unver |
| NRG-08 | industry_commentary | 2026 | https://www.mybigbill.com/blog/lower-pge-bill-2026 | Bill-review vendor estimates PG&E rate-plan mismatch costs $180-400/year (unverified). |
| NRG-08 | industry_commentary | 2026 | https://malfettoneelectric.com/blog/pseg-time-of-use-rates-nj-2026 | PSE&G TOU is opt-in with a first-12-month bill-protection credit, showing utilities recognize mismatch risk. |
| NRG-08 | firsthand_complaint | 2026-11-02 | https://github.com/topics/green-button | Developers building personal rate optimizers (energy-advisor for CA bills, coned-rate-optimizer, SDGE-Analysis) updated Oct-Nov 2026, showin |
| OVL-01 | primary_statistic | 2025-01-27 | https://ncpa.org/sites/default/files/2025-01/1.27.2025-FinalExecSummary.NCPA_.MemberSurvey.pdf | NCPA member survey: 40.8% paid below NADAC on >40% of Part D scripts; 96.5% say reimbursement threatens viability; 80.3% financial health de |
| OVL-01 | industry_commentary | 2026-01 | https://ncpa.org/sites/default/files/2026-01/IndependentsClosing_2025FlyerEdit.pdf | NCPA flyer linking closures to delayed payments, clawbacks, below-cost reimbursement; $7.3B PBM markup revenue 2017-2022. |
| OVL-01 | industry_commentary | 2026 | https://www.drugtopics.com/view/pbm-underpayment-persists-as-cost-plus-brings-new-strain-ncpa-2026 | Trade press at NCPA 2026: underwater generics and opaque MAC remain top threat; cost-plus contracts require sharing wholesaler invoices with |
| OVL-01 | industry_commentary | 2026 | https://www.drugtopics.com/view/finance-strategies-for-independent-pharmacies-facing-shrinking-margins | 30.3% of independent owners considered closing in 2025. |
| OVL-01 | industry_commentary | 2026 | https://www.bipc.com/the-consolidated-appropriations-act-of-2026-what-plan-sponsors-and-pharmacies-need-to-know-and-how-to-use-it | Law-firm summary: 2026 federal PBM provisions do not mandate acquisition-cost-plus-fee reimbursement, so below-cost claims continue. |
| OVL-02 | firsthand_complaint | 2026-04 | https://www.thetruckersreport.com/truckingindustryforum/threads/lost-detention-pay-again-because-broker-said-no-proof.2540236/ | Driver waited 4+ hours at receiver; broker refused because the only proof was a handwritten note on the BOL. |
| OVL-02 | firsthand_complaint | 2026-02 | https://www.thetruckersreport.com/truckingindustryforum/threads/what-does-your-carrier-contract-say-about-detention-pay-disputes.2537804/ | Driver had timestamps and camera footage; broker still said documentation was insufficient; contract has arbitration clauses. |
| OVL-02 | industry_commentary | unknown | https://getdockpay.com/broker-not-paying-detention | Vendor page citing ATRI 2024 that carriers are paid on only 55% of detention invoices; lists common denial reasons. |
| OVL-02 | industry_commentary | 2026 | https://www.americantruckersllc.com/blog/detention-pay-trucking-2026.html | States there is no FMCSA rule requiring brokers or shippers to pay detention; recourse depends on the rate confirmation. |
| OVL-03 | primary_statistic | 2026 | https://www.overdriveonline.com/business/article/15819815/majority-of-ownerops-victims-of-freight-fraud-broker-tricks-survey | Overdrive reader survey: majority of owner-ops victims of freight fraud; 28% double brokered at reduced pay; 23% stiffed by both brokers. |
| OVL-03 | industry_commentary | unknown | https://www.overdriveonline.com/partners-in-business/independence-growth/article/15707529/double-brokering-scams-how-to-spot-and-avoid-to-preserve-profits | Trade press: owner-operators are typically the ones left unpaid; double brokering has grown sharply. |
| OVL-03 | firsthand_complaint | 2026 | https://finance.yahoo.com/news/75-000-bond-truckers-left-155638602.html | Column describing a driver who recovered $312 from a $75,000 broker bond after many claimants; bond split among all claimants when broker fa |
| OVL-03 | industry_commentary | 2026 | https://checkmybroker.ai/blog/double-brokering-2026 | Vendor post describing 2026 pattern of impersonating real brokers via lookalike domains and phone numbers not in FMCSA records; recommends d |
| OVL-03 | industry_commentary | 2026 | https://truckstop.com/blog/double-brokering-prevention-strategies-under-new-fmcsa-rules/ | Load board notes FMCSA tightened financial review of broker applicants. |
| OVL-04 | industry_commentary | 2026 | https://www.caresmartz360.com/ebooks/evv-enforcement-2026-home-care-compliance-guide/ | Vendor guide: 2026 nationwide shift from soft to hard EVV edits; claims without matching validated EVV record are denied. |
| OVL-04 | industry_commentary | 2026 | https://www.myezcare.com/state-by-state-evv-requirements-for-2026-what-every-home-care-agency-must-know/ | Vendor state-by-state list: Missouri hard edits phased from April; NC denying; MN/OH/IN/PA enforcing in 2026. |
| OVL-04 | industry_commentary | 2026 | https://www.fornexhealth.com/blogs/evv-compliance-home-care-billing | Vendor blog describing EVV mismatches as a 'silent revenue killer' and recoupment risk. |
| OVL-04 | industry_commentary | 2026 | https://bridgecareos.com/blog/everything-home-care-agencies-need-to-know-about-evv-compliance-in-2026/ | Vendor blog on 2026 EVV compliance and FMAP penalty mechanics. |
| OVL-05 | firsthand_complaint | 2026 | https://www.kbzk.com/news/delayed-state-childcare-payments-push-montana-providers-to-the-brink | Montana providers describe delayed subsidy and licensing payments after the new Best Beginnings system launched; one owner worries about mee |
| OVL-05 | firsthand_complaint | 2026 | https://missoulian.com/news/state-regional/government-politics/article_e8b86957-80d3-572d-9e08-020c9700bd47.html | Providers say the state's subsidy program is riddled with delays; DPHHS says it pays within the 21-day federal requirement for error-free in |
| OVL-05 | primary_statistic | 2026-03-31 | https://washingtonstatestandard.com/2026/03/31/audit-questions-37m-in-child-care-payments-in-wa/ | State auditor estimates $37M in questionable child care subsidy payments; DCYF does not check provider documentation before paying; about si |
| OVL-05 | industry_commentary | 2026 | https://komonews.com/news/local/lawmaker-calls-for-more-accountabilty-after-child-care-department-of-children-youth-and-families-payments-dcyf-37-million-signatures-parents-guardians-subsiidy-2021-2024 | Audit findings on weak oversight and missing records (signatures) in subsidy payments 2021-2024; overpayments submitted for recovery. |
| OVL-05 | industry_commentary | unknown | https://pebbledesk.app/resources/guides/subsidy-reimbursement-tracking-guide/ | Vendor guide stating subsidy reimbursements commonly take up to 60 days because states pay retroactively. |
| OVL-06 | firsthand_complaint | 2026 | https://www.farmprogress.com/planting/h-2a-delays-leave-texas-farmers-in-planting-season-bind | Texas farmers expecting workers in Feb/March 2026 still waiting; one filed a DOL complaint. |
| OVL-06 | published_study | 2026-03-03 | https://investigatemidwest.org/2026/03/03/emails-show-trumps-labor-department-struggling-to-deliver-on-h-2a-one-stop-shop-promise/ | Investigative report using DOL emails: one-stop-shop effort struggled; industry says hangups are at State and DHS. |
| OVL-06 | industry_commentary | 2026 | https://specialtycropgrower.com/h-2a-program-delays-florida-georgia/ | NCAE CEO acknowledges processing delays affecting Florida/Georgia growers, stemming from several steps. |
| OVL-06 | speculation | 2026 | https://www.visaverge.com/news/trumps-immigration-policies-and-their-impact-on-u-s-agriculture/ | Claims 40% Vidalia onion losses from H-2A delays; single less-established source, unverified. |
| OVL-07 | published_study | 2026-07 | https://ucanr.edu/sites/default/files/2026-07/UCANR%20x%20CAFF%202026%20Groundwater%20Report_0.pdf | 'Managing Groundwater with Small Farms in Mind' report: first assessment of small-farm consideration under SGMA; 50 recommendations; survey  |
| OVL-07 | published_study | 2026-07 | https://ucanr.edu/blog/food-blog/article/sgma-challenges | UC ANR summary: small farms may not be able to comply and stay in business; ET estimates may overstate use; tenant farmers miss GSA notices. |
| OVL-07 | industry_commentary | 2026-08 | https://sjvwater.org/california-law-aimed-at-saving-groundwater-risks-crushing-states-small-farmers-according-to-report/ | Regional water press coverage of the report's findings on small farms. |
| OVL-07 | primary_statistic | 2026 | https://www.waterboards.ca.gov/board_decisions/adopted_orders/resolutions/2026/rs2026-0011.pdf | State Water Board 2026 resolution text excluding Tule Subbasin pumpers of 20 AFY or less from reporting requirements (adoption status not co |
| OVL-08 | published_study | 2023 | https://information.auditor.ca.gov/pdfs/reports/2023-110.pdf | California State Auditor report documenting physician signature delays, including a funeral home sending three requests over nine days befor |
| OVL-08 | primary_statistic | unknown | https://www.cap.org/article/u-s-death-certification-laws-by-state/ | College of American Pathologists state-by-state table: physician signing windows of 24-72 hours and filing windows of 72 hours to 7 days. |
| OVL-08 | industry_commentary | unknown | https://www.lsbme.la.gov/licensure/death-certificates | Louisiana medical board guidance: physician deadlines and discipline for failing to sign on time. |
| OVL-08 | firsthand_complaint | 2026-03 | https://piercelaw.com/news/probate-question-and-answer/how-do-i-get-a-death-certificate-corrected-when-the-funeral-home-keeps-delaying-and-the-name-is-spelled-wrong-nc/ | NC law-firm Q&A from a family dealing with a delayed, misspelled certificate; notes NC now requires electronic filing through NCDAVE with a  |
| OVL-08 | industry_commentary | unknown | https://capitol.texas.gov/tlodocs/75R/analysis/html/HB02866H.htm | Older Texas bill analysis citing steady weekly complaints about signing delays from disputes over which physician must sign. |
| SCI-01 | published_study | 2026-05-07 | https://retractionwatch.com/2026/05/07/one-in-277-pubmed-indexed-papers-in-2026-shows-fabricated-references-says-analysis/ | Reports an analysis finding 1 in 277 PubMed-indexed 2026 papers contain fabricated references; sharpest rise mid-2024. |
| SCI-01 | industry_commentary | 2026-05-12 | https://www.forbes.com/sites/michaeltnietzel/2026/05/12/ai-blamed-for-rise-in-fabricated-citations-found-in-recent-research-papers/ | Press coverage of the Lancet audit (~3,000 papers, 12-fold rise since 2023) and the call for automated reference verification at submission. |
| SCI-01 | industry_commentary | unknown | https://studyfinds.com/fake-citations-science-papers-quadrupled/ | Secondary coverage of a study finding 1 in 435 early-2026 papers in physical sciences/CS with a fabricated reference and only 2 of 619 affec |
| SCI-01 | published_study | 2026-02 | https://arxiv.org/pdf/2602.05930.pdf | Preprint surfaced in search on hallucinated citations evading NeurIPS 2025 review by 3-5 reviewers per paper; content not independently read |
| SCI-01 | industry_commentary | 2026-11-02 | https://github.com/topics/citation-verification | 235 public repos tagged citation-verification, most created/updated in 2026 (citegate 102 stars, bibverify 98, opendraft 523), showing a rus |
| SCI-02 | industry_commentary | 2026-10 | https://www.scientificamerican.com/article/scientists-left-in-the-dark-by-national-science-foundation-grant-application-delays/ | Reports NSF MRI program silent on its announced Oct 15-Nov 16, 2026 submission window; NSF spokesperson says it is 'currently working to upd |
| SCI-02 | primary_statistic | 2026-06-16 | https://grantwitness.org/nsf/updates/2026-06-16-nsf-grantmaking-pause | Tracker documenting no NSF awards June 4-12, 2026 and calling the halts unprecedented. |
| SCI-02 | primary_statistic | 2026-04 | https://www.aps.org/apsnews/2026/04/nsf-lags-trump-proposes-cuts | NSF had awarded ~613 grants in FY2026, about 20% of the pace of FY2021-2024, per Grant Witness. |
| SCI-02 | industry_commentary | 2026-09-21 | https://www.insidehighered.com/news/government/science-research-policy/2026/09/21/nsf-over-billion-behind-grants-ies-says-will | NSF over $1B behind on grants; awards flatlined since ~Aug 10, 2026. |
| SCI-02 | industry_commentary | unknown | https://www.science.org/content/article/analysis-why-research-money-isn-t-flowing-nsf-and-nih | Attributes part of slowdown to OMB using the apportionment process to slow release of funds. |
| SCI-02 | industry_commentary | unknown | https://research.ucdavis.edu/federal-research-grant-slowdown-implications-and-actions-for-uc-davis-faculty/ | University research office guidance to faculty on coping with the slowdown. |
| SCI-02 | industry_commentary | 2026 | https://casrai.org/news/university-layoffs-budget-cuts-summer-2026 | Attributes 2026 university layoffs to terminated/non-renewed NIH and NSF awards; cites Johns Hopkins 28% decline in active award count. |
| SCI-02 | industry_commentary | 2026-01 | https://www.highereddive.com/news/nih-indirect-cost-cap-appeal-struck-down/808925/ | First Circuit upheld the block on the NIH 15% indirect-cost cap in Jan 2026; the cap is not in effect, so layoffs stem from terminations/del |
| SCI-03 | industry_commentary | 2022-10-19 | https://manager.labs.wisc.edu/wp-content/uploads/sites/297/2022/10/Freezer-Inventory-Panel_Slide-Deck_10192022.pdf | UW-Madison lab-manager panel comparing Google Sheets, LabArchives widget (not a true inventory) and FreezerWorks (~$6K/yr). |
| SCI-03 | industry_commentary | 2018-07-09 | https://research.wisc.edu/research-resources-reporter/2018/07/09/freezer-sample-inventory-discussion-notes | Earlier campus discussion of freezer sample inventory practices; shows the problem is long-standing. |
| SCI-03 | industry_commentary | unknown | https://alternativeto.net/software/drfreezr/about | Lists DrFreezr freezer inventory tool at up to $400/month. |
| SCI-03 | industry_commentary | unknown | https://hms.harvard.edu/news/freezer-failure-cited-loss-mclean-tissue-samples | Loss of 147 brain tissue samples at McLean attributed to freezer digital controls. |
| SCI-03 | industry_commentary | 2023-06 | https://www.nbcnews.com/news/us-news/major-research-lost-custodian-flips-switch-lab-freezer-lawsuit-claims-rcna91160 | Lawsuit over research lost when a custodian turned off a lab freezer. |
| SCI-03 | industry_commentary | unknown | https://ehs.research.uiowa.edu/node/1601 | University EHS recommends purging unidentifiable items and keeping a simple spreadsheet inventory. |
| SCI-03 | industry_commentary | 2026-11-02 | https://github.com/topics/sample-tracking | Nine small open-source sample/freezer trackers, most 0-2 stars and updated in 2026, indicating repeated DIY attempts. |
| SCI-04 | published_study | 2017 | https://pmc.ncbi.nlm.nih.gov/articles/PMC5443717/ | Review noting most academic and government labs continue to use paper notebooks despite ELN advantages. |
| SCI-04 | published_study | unknown | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2810290/ | 'Make it better but don't change anything': study of ELN adoption resistance; the 169-respondent barrier survey surfaced in search synthesis |
| SCI-04 | firsthand_complaint | 2019-10-24 | https://asngrads.com/2019/10/24/electronic-lab-notebooks-hope-or-hype/ | Grad student describes undergrads writing on paper and uploading scans, and bench-side friction with computers. |
| SCI-04 | industry_commentary | unknown | https://news.wisc.edu/researchers-embrace-and-reap-benefits-of-electronic-lab-notebooks/ | UW-Madison campus-wide ELN rollout after pilots; shows adoption works when institution-led. |
| SCI-04 | firsthand_complaint | 2026-11-02 | https://github.com/elabftw/elabftw/issues | 266 open issues on the leading open-source ELN; Oct 2026 cluster on lossy team export/import and attachment/filter bugs indicates migration  |
| SCI-05 | published_study | 2026-05-15 | https://www.medrxiv.org/content/10.64898/2026.05.15.26353334v1.full | GPT-4o mini title/abstract screening evaluation; reports a median false-negative rate of ~4.6% as a caveat. |
| SCI-05 | published_study | 2026-04-28 | https://www.medrxiv.org/content/10.64898/2026.04.28.26352009v1.full | MechaScreener tested on 15 reviews; notes no prior LLM method reliably reaches perfect recall while reducing load. |
| SCI-05 | published_study | 2026-03-17 | https://www.medrxiv.org/content/10.64898/2026.03.17.26348656v1.full | Meta-analysis of LLM screening performance; positions tools as assistants, not replacements. |
| SCI-05 | published_study | unknown | https://pmc.ncbi.nlm.nih.gov/articles/PMC12829171/ | Review Copilot validation: AI-assisted screening took roughly two-thirds to three-quarters fewer person-hours. |
| SCI-05 | firsthand_complaint | 2026-11-02 | https://github.com/asreview/asreview/issues | 94 open issues; 2026 reports of RIS import failures, records failing to load, lost tags, failed upgrades, inability to resume after crash. |
| SCI-05 | industry_commentary | 2026-11-02 | https://github.com/topics/systematic-review | MetaScreener (1.3k stars), meta-pipe, citationchaser and others show a crowded tooling space focused on screening/retrieval. |
| SCI-06 | published_study | 2026-09 | https://arxiv.org/html/2609.19422v1 | BurnRiSc preprint: maintainer burnout as a sustainability problem; lone-departure risk; cites surveys showing burnout is widespread. |
| SCI-06 | published_study | 2025-11 | https://arxiv.org/pdf/2511.07851 | IEEE CiSE paper proposing quality metrics for scientific OSS sustainability, framed around reproducibility. |
| SCI-06 | published_study | 2025-04 | https://arxiv.org/pdf/2504.18971 | Counterpoint: scientific OSS is less likely to be abandoned than assumed (title only seen). |
| SCI-06 | industry_commentary | unknown | https://zenodo.org/records/15674429 | 'People First' talk: research software sustainability depends on maintainer wellbeing; names burnout and institutional precarity. |
| SCI-06 | industry_commentary | 2026 | https://breakpoint.network/state-of-abandonment-2026 | Secondary summary of Tidelift 2024 survey: 60% of maintainers quit or considered quitting; median one active maintainer for top packages. |
| SCI-06 | primary_statistic | 2026-11-02 | https://github.com/topics/flow-cytometry | Of 20 top repos, at least 6 (ParkerICI premessa/panorama/grappolo, pytometry_legacy, etc.) have had no update since 2021-2023. |
| SCI-06 | primary_statistic | 2026-11-02 | https://github.com/topics/lims | Open-source LIMS baobab.lims, MetaLIMS and parkour last updated 2022; limbus 2024. |
| SCI-07 | industry_commentary | 2026-08-11 | https://acrpnet.org/2026/08/11/envisioning-econsent-success-part-i-measuring-operational-impacts-at-clinical-trial-sites | ACRP: eConsent adoption claims of 50-75% may be inflated; sites report operational impacts. |
| SCI-07 | primary_statistic | unknown | https://www.appliedclinicaltrialsonline.com/view/key-considerations-adoption-econsent-sites | CRF Health survey of 105 site respondents: 33% using/planning eConsent, 85% believe it useful. |
| SCI-07 | industry_commentary | unknown | https://www.clinicaltrialvanguard.com/clinical-trial-ops-brief/59-of-sites-are-losing-patients-before-they-ever-screen-heres-where-the-pipeline-actually-breaks/ | 59% of sites losing eligible patients before screening due to recruitment inefficiencies (survey reported by FierceBiotech). |
| SCI-07 | industry_commentary | 2026 | https://www.dittotranscripts.com/blog/clinical-trial-recruitment-statistics/ | Vendor blog aggregating Tufts CSDD 80-86% timeline-miss statistic; secondary and unverified. |
| SCI-08 | primary_statistic | 2022 | https://www.cogr.edu/results-cogr-survey-cost-complying-new-nih-dms-policy | COGR survey of 34 institutions projecting >$500K/yr central cost plus similar academic-level cost. |
| SCI-08 | primary_statistic | 2023-05-11 | https://www.cogr.edu/sites/default/files/DMS_Cost_of_Compl_May11_2023_FINAL%20(1).pdf | COGR cost-of-compliance document. |
| SCI-08 | published_study | unknown | https://jscholarship.library.jhu.edu/items/31f1c1f3-83fd-4701-9a42-a9f231434443 | JHU study: survey of 50 NIH-funded researchers found no increase in data sharing/utilization and negative stigma toward the policy (small sa |
| SCI-08 | industry_commentary | unknown | https://thefdp.org/demonstrations-resources/nih-data-management-sharing-pilot/ | FDP pilot: institute-specific requirement variation places substantial burden on researchers. |
| SCI-08 | industry_commentary | 2026 | https://guides.mclibrary.duke.edu/datasharing/nihdatasharing | Duke guide: new shorter standardized DMS format required from May 25, 2026 (NOT-OD-26-046), designed to reduce burden. |
| WLD-01 | firsthand_complaint | 2026-05-11 | https://github.com/actualbudget/actual/issues/7799 | 182-comment open thread; ~15 distinct users report bank-specific sync failures, skipped/reappearing transactions, wrong balances, browser-sp |
| WLD-01 | firsthand_complaint | 2026-05-21 | https://github.com/actualbudget/actual/issues/7916 | User cannot add new GoCardless links from self-hosted Docker; closed 'not planned' with maintainer saying it recurs and is upstream. |
| WLD-01 | primary_statistic | 2026-07 | https://github.com/actualbudget/actual/issues?q=is%3Aissue+bank+sync+label%3Abug+sort%3Acreated-desc | 251 bug results for 'bank sync'; 25 visible issues closed Mar-Jul 2026 across SimpleFIN, GoCardless, Pluggy, Enable Banking. |
| WLD-01 | firsthand_complaint | 2026-06-10 | https://github.com/actualbudget/actual/issues/8183 | Pluggy sync fails with HTTP 410 after provider removed the /transactions endpoint. |
| WLD-01 | firsthand_complaint | 2023-05-29 | https://github.com/frappe/erpnext/issues/35455 | Open since 2023; ERPNext users say manual reconciliation is burdensome and one would not adopt without bank feeds; maintainers still explori |
| WLD-01 | industry_commentary | 2026 | https://useorigin.com/resources/blog/what-happened-to-mint----and-what-should-you-use-instead | Mint closed March 2024; replacements all depend on Plaid/MX/Finicity aggregators. |
| WLD-01 | industry_commentary | 2026 | https://www.raftlabs.com/blog/cost-to-build-app-like-mint | Vendor estimate of Plaid cost at $0.15-0.50 per connected account per month; screen-scraping broke as banks added MFA/bot detection/OAuth. |
| WLD-01 | speculation | 2026 | https://www.useluminix.com/reports/industry-analysis/competitive-landscape-personal-finance-and-budgeting-apps-2026 | Single less-authoritative source claiming JPMorgan's formalized data-access fees will be copied by other banks. |
| WLD-02 | industry_commentary | 2026 | https://www.physicianspractice.com/view/electronic-prior-authorizations-arrive-jan-1-is-your-practice-ready | AMA survey (May 13, 2026): 40 PAs/week, ~13 hours/week of physician and staff time; CMS-0057-F deadlines; one physician-executive says some  |
| WLD-02 | industry_commentary | 2026 | https://faxpigeon.com/resources/how-to-fax-a-prior-authorization-request | Vendor guide estimating 45% of PA requests submitted via fax and only 12% via X12 278 (the 12% figure is dated to 2019 via MGMA). |
| WLD-02 | industry_commentary | 2026 | https://faxpigeon.com/resources/unitedhealthcare-prior-authorization-fax-number | UHC's PA fax line is limited to a few states' commercial plans; UHC eliminating 30% of PA requirements from Oct 1, 2026. |
| WLD-02 | industry_commentary | 2026 | https://faxpigeon.com/resources/hipaa-fax-for-small-medical-practices | Small practices buy HIPAA fax with BAA from ~$4.99/month as the baseline tool. |
| WLD-03 | firsthand_complaint | 2023-07-14 | https://github.com/openai/whisper/discussions/1522 | User transcribing medical recordings with large-v2 says diseases and medications are handled poorly and initial_prompt with a term list did  |
| WLD-03 | firsthand_complaint | 2022-10-15 | https://github.com/openai/whisper/discussions/328 | Vocabulary prompting works but a user reports it only seems to apply to the first ~30 seconds; no answer on making it global. |
| WLD-03 | published_study | 2026 | https://www.informatica.si/index.php/informatica/article/view/12075/6470 | Cites 63% WER for Whisper-small on medical test sets; fine-tuning needed; base model misidentifies symptom and medication names. |
| WLD-03 | published_study | 2026 | https://www.nature.com/articles/s41746-026-02490-z | Error rates significantly higher for non-native speakers in clinical speech transcription with Whisper; proposes LLM-based remedy. |
| WLD-03 | published_study | 2026-02 | https://arxiv.org/html/2602.18966v1 | Names were the largest error category (35%), replaced by phonetically similar common words; domain validation left as future work. |
| WLD-03 | industry_commentary | 2026 | https://medium.com/@ryanshrott/why-generic-dictation-tools-still-cant-handle-medical-terminology-in-2026-2642b31f87b2 | Vendor-adjacent post: 'atorvastatin 40 mg daily' comes out as nonsense; custom vocabulary lists are the main lever. |
| WLD-03 | industry_commentary | 2026 | https://get-whisper.com/blog/whisper-app-review-2025 | Six-month review: Whisper's prompt biasing is shallower than Dragon's vocabulary management; heavy medical/legal terminology needs correctio |
| WLD-04 | firsthand_complaint | 2026-10-10 | https://github.com/browser-use/browser-use/issues/6031 | Eight known-answer regression cases where the agent reports success although nothing happened; 403-block and stale-cache cases failed 3/3 ru |
| WLD-04 | firsthand_complaint | 2026-10-14 | https://github.com/browser-use/browser-use/issues/6068 | Agent enables a disabled button via evaluate, places the order, and often reports plain success. |
| WLD-04 | firsthand_complaint | 2026-09-30 | https://github.com/browser-use/browser-use/issues/5955 | Structured done actions default incomplete tasks to success. |
| WLD-04 | firsthand_complaint | 2026-03-23 | https://github.com/browser-use/browser-use/issues/4480 | Step timeout stalls step counter and writes stale duplicate history, corrupting long runs (fixed within two days). |
| WLD-04 | industry_commentary | 2026 | https://www.testmuai.com/blog/state-of-ai-browser-agents-2026/ | Testing roundup: long multi-step tasks on live sites still fail frequently from compounding errors. |
| WLD-04 | industry_commentary | 2026 | https://www.agentrank.tech/blog/top-7-ai-browser-agents-worth-using-2026 | Hands-on reviewer: most agents still cannot fill a two-page form without getting confused. |
| WLD-04 | industry_commentary | 2026 | https://xelionlabs.com/blog/ai-browser-agents-guide | Agents get confused by nested frames, pop-ups and non-standard forms; long government forms often end in a CAPTCHA. |
| WLD-05 | firsthand_complaint | 2026-02-07 | https://github.com/paperless-ngx/paperless-ngx/discussions/12029 | 10 participants; users want pluggable/self-hosted OCR because Tesseract fails on handwriting and messy text; list of cloud and LLM workaroun |
| WLD-05 | firsthand_complaint | 2026 | https://github.com/paperless-ngx/paperless-ngx/discussions/12947 | Feature request to run self-hosted MinerU as a remote OCR engine. |
| WLD-05 | firsthand_complaint | 2024-10-17 | https://github.com/paperless-ngx/paperless-ngx/discussions?discussions_q=handwritten | 'HTR Handwritten text recognition' feature request closed unanswered; 'Alternative OCR engines' thread has 91 comments. |
| WLD-05 | industry_commentary | 2026 | https://visiontoprompt.com/blog/ocr-handwritten-medical-forms-accuracy-benchmarks/ | Vendor benchmark: neat block handwriting 94.2%, cursive clinical notes 82.1%, messy shorthand 64.5%; messy shorthand still needs human-in-th |
| WLD-05 | industry_commentary | 2026 | https://schemacare.com/blog/patient-intake-form-ocr | Vendor: 75-90% field accuracy on intake forms depending on handwriting; OCR is a first step, not a replacement for review. |
| WLD-06 | firsthand_complaint | 2025-08-15 | https://github.com/docling-project/docling/issues/2081 | Open; missing values, 0/o confusion, inserted symbols, dropped rows; three other users confirm through Mar 2026; only bot suggestions, none  |
| WLD-06 | firsthand_complaint | 2026-09-17 | https://github.com/docling-project/docling/issues/4255 | TableFormer generates degenerate OTSL at max_steps, dropping table data rows (regression). |
| WLD-06 | firsthand_complaint | 2026-08-27 | https://github.com/docling-project/docling/issues/4083 | Rows/cells misaligned on CJK PDFs with partial text layer, 11 comments. |
| WLD-06 | firsthand_complaint | 2025-11-26 | https://github.com/docling-project/docling/issues/2685 | Error extracting a simple table from an official federal document. |
| WLD-06 | firsthand_complaint | 2026-05-18 | https://github.com/docling-project/docling/issues/3473 | OCR'd text inside a table region never referenced in output, so it is missing from Markdown. |
| WLD-07 | firsthand_complaint | 2023-11-19 | https://github.com/Hopding/pdf-lib/issues/1549 | Flatten removes radio groups and checkboxes; multiple users confirm through Oct 2026; no maintainer response; workarounds listed; spam for s |
| WLD-07 | primary_statistic | 2026-11 | https://github.com/Hopding/pdf-lib/issues?q=is%3Aissue+is%3Aopen+sort%3Acomments-desc | 279 open issues; top ones include corrupted PDFs, form setText font, flatten removal, encrypted copies blank, form calculations not working. |
| WLD-07 | firsthand_complaint | 2023 | https://github.com/py-pdf/pypdf/issues?q=is%3Aissue+form+fill+XFA | pypdf: radio button fill makes later text fields not show values; XFA clone loses content; checkbox fields not extracted. |
| WLD-08 | firsthand_complaint | 2026-09-18 | https://github.com/orgs/community/discussions/208251 | Five independent posters (ismailhalawa-ctrl, chris-crts, Dani-8, kit1211, ssdevkit) describe losing decisions, failed approaches, test statu |
| WLD-08 | firsthand_complaint | 2026 | https://news.ycombinator.com/item?id=46345827 | Ask HN on developer tools people wish existed in 2026 (ideas like test-blocking triage and attention prioritization); content seen only via  |
| WLD-08 | industry_commentary | 2026-08-10 | https://clawdbytes.com/article/2026-08-10-the-problem-with-managing-too-many-developer-tools | Tool sprawl: dozens of tools per day that do not share context. |

## competition-C01.md (95 URLs)

- https://www.duanemorris.com/alerts/doj_extends_ada_title_ii_digital_accessibility_deadlines_one_year_0426.html
- https://www.reedsmith.com/articles/doj-extends-digital-accessibility-compliance-dates-under-title-ii-of-the-ada/
- https://www.adatitleiii.com/2026/04/doj-extends-ada-title-ii-website-accessibility-deadlines-for-governmental-entities-but-litigation-and-compliance-risks-remain/
- https://www.siteimprove.com/blog/ada-title-ii-interim-final-rule/
- https://www.consumerfinancialserviceslawmonitor.com/2026/04/doj-extends-title-ii-ada-web-accessibility-rule-compliance-deadlines-for-state-and-local-governments/
- https://accessibility.arizona.edu/news/doj-issues-interim-final-rule-title-ii-digital-accessibility-compliance-dates
- https://upcea.edu/doj-extends-accessibility-deadline-to-april-2027-policy-matters-april-2026/
- https://www.audioeye.com/post/2027-accessibility-compliance-deadlines/
- https://digital.maryland.gov/accessibility/accessible-documents-and-webpages/content-exempt-ada-title-ii
- https://digital.maryland.gov/accessibility/accessible-documents-and-webpages/how-archive-electronic-documents
- https://cmo.vermont.gov/node/646
- https://erp.gatech.edu/title-ii/exceptions
- https://www.wisconsin.edu/digital-accessibility/exceptions-to-title-ii/
- https://doit.txst.edu/accessibility/laws-policies-and-standards/standards/standards-title-2-exceptions.html
- https://www.acquia.com/blog/european-accessibility-act-and-en-301-549-your-complete-compliance-guide.md
- https://www.quadient.com/en/blog/european-accessibility-laws-standards
- https://www.equalweb.com/platform/standards/eaa.html
- https://business.adobe.com/blog/pdf-accessibility-mandates-for-businesses-gain-urgency
- https://helpx.adobe.com/acrobat/using/creating-accessible-pdfs.html
- https://blog.adobe.com/en/publish/2023/05/17/making-pdfs-accessible-to-all
- https://abilitynet.org.uk/news-blogs/evaluating-adobes-new-cloud-based-auto-tagging-feature-pdf-accessibility
- https://equidox.co/blog/the-truth-about-auto-tagging-pdfs/
- https://community.adobe.com/questions-9/auto-tagging-fails-accessibility-1556749
- https://www.clemson.edu/accessibility/digital/guides/pdf/remediation/untagged-documents.html
- https://www.msudenver.edu/teaching-learning-design/instructional-accessibility/guides-resources/word/remediate-pdf/
- https://unr.edu/digital-learning/accessibility/pdfs/streamlined-remediation
- https://idea.ssw.umaryland.edu/accessibility/document-remediation/remediate-pdfs-with-adobe-acrobat
- https://marcomm.tamu.edu/accessibility/how-to-remediate-an-existing-pdf-using-adobe-acrobat-pro/
- https://support.anthology.com/s/article/Ally-2-19-Release-to-production-July-13-2026?language=en_US
- https://help.anthology.com/ally-lms/en/administrators/whats-new/2026-release-notes.html
- https://www.blackboard.com/blog/the-blackboard-ally-roadmap-2026-accessibility-that-complements-teaching-workflows
- https://community.blackboard.com/public/blogs/looking-ahead-highlights-from-the-ally-roadmap-session-at-building-blackboard-together-2026-08-05
- https://community.anthology.com/public/blogs/highlights-from-the-western-region-ally-user-group-meeting-2026-06-22
- https://community.anthology.com/public/blogs/pdf-assisted-remediation-quick-fixes-is-almost-here-answers-to-the-faqs-youve-been-wondering-about-2025-08-22
- https://help.anthology.com/ally-lms/en/administrators/ai-alt-text-assistant.html
- https://help.anthology.com/ally-lms/en/instructors/alternative-formats/alternative-formats-faqs.html
- https://help.anthology.com/ally-lms/en/instructors/improve-content-accessibility/tag-a-pdf.html
- https://aelira.ai/au/reviews/blackboard-ally
- https://aiagentstore.ai/ai-agent-news/topic/accessibility-inclusion/2026-09-15
- https://www.siteimprove.com/press/siteimprove-advances-its-agentic-content-intelligence-platform/
- https://core.fiu.edu/blog/2026/audit-the-pdfs-on-your-website-with-siteimprove.html
- https://www.businesswire.com/news/home/20250708014451/en
- https://remedocs-website.pages.dev/competitors/
- https://remedocs-website.pages.dev/competitors/remedocs-vs-allyant/
- https://webaim.org/discussion/mail_message?id=50543
- https://equidox.co/pdf-solutions/high-volume-solutions/
- https://equidox.co/blog/pdf-remediation-pricing-am-i-getting-a-good-deal/
- https://equidox.co/blog/pdf-remediation-software-buyers-guide/
- https://www.whoisaccessible.com/reviews/equidox/
- https://uit.stanford.edu/news/prep-ai-powered-pdf-remediation-service
- https://www.continualengine.com/blog/top-10-pdf-remediation-service-providers-for-2026/
- https://pdfix.net/
- https://pdfix.net/pdf-compliance-software/ada-title-ii-university-pdf-accessibility-deadline/
- https://apryse.com/blog/pdf-remediation-ada-2026
- https://www.equalweb.com/11856/11528/pdf_ai_remediation
- https://digitalgovernmenthub.org/examples/pdf-accessibility-remediation/
- https://github.com/ASUCICREPO/PDF_Accessibility
- https://github.com/opendataloader-project/opendataloader-pdf
- https://github.com/EqualifyEverything/equalify-reflow
- https://github.com/Aelira-AI/aelira-core
- https://github.com/Vamsi-2581/aelira-core
- https://github.com/tfscharff/rebind
- https://github.com/vvatter/llm-pdf-remediation
- https://aelira.ai/us/about
- https://www.crunchbase.com/organization/equalify
- https://accessinghigherground.org/ow-an-open-source-pdf-remediation-tool-can-accelerate-document-accessibility/
- https://www.cni.org/wp-content/uploads/2025/12/CNI_Project_Tressler.pdf
- https://venngage.com/blog/pdf-accessibility-cost/
- https://www.digitala11y.com/?p=24025
- https://accessible.org/?p=1011030
- https://calendar.cambridge.ca/Council/Detail/2025-10-27-1300-Cambridge-Accessibility-Advisory-Committee/4d00e30f-2c9d-45a0-bea2-b37f013fbdbe
- https://tabnav.com/pdf-remediation
- https://remedocs-website.pages.dev/government/
- https://www.skynettechnologies.com/blog/pdf-accessibility-cost-factors
- https://yomotherboard.com/?p=449958
- https://www.silicon.co.uk/press-release/level-access-first-digital-accessibility-only-company-to-surpass-100-million-annual-recurring-revenue-arr
- https://getlatka.com/companies/level-access
- https://prospeo.io/c/level-access
- https://pitchbook.com/profiles/company/56776-06
- https://stockanalysis.com/stocks/AEYE
- https://www.barchart.com/story/news/592487/audioeye-reports-record-fourth-quarter-and-full-year-2025-results
- https://getlatka.com/companies/audioeye.com
- https://jdsupra.com/legalnews/ftc-targets-accessibility-overlays-5593127
- https://technologylaw.fkks.com/post/102jsmj/ftc-finds-website-overlay-tool-failed-to-deliver-accessibility-promises
- https://adrianroselli.com/2025/01/ftc-catches-up-to-accessibe.html
- https://testparty.ai/blog/are-accessibility-overlays-legal
- https://www.cccco.edu/wp-content/uploads/2026/03/ess-26-17-accessibility-standards-and-revised-ada-title-ll-regulations-a11y.pdf
- https://laspositascollege.edu/onlinelearning/faculty/accessibility/images/ess-26-38-revised-ada-title-ii-regulations-timeline.pdf
- https://www.cccco.edu/-/media/CCCCO-Website/docs/rfa/oer-rfa-aug-2025-a11y.pdf
- https://www.laccd.edu/sites/laccd.edu/files/2023-06/22_05__Digital%20Product%20and%20Services%20Accessibility%20Remediation%20Services.pdf
- https://www.csustan.edu/access-for-all/guidelines-resources/document-accessibility
- https://bmiimaging.com/blog/document-management/pdf-accessibility-compliance/
- https://www.siteimprove.com/blog/ada-title-ii-public-universities/
- https://www.audioeye.com/post/title-ii-requirements-higher-education/
- https://en.wikipedia.org/wiki/Baker_%26_Taylor

## competition-C02.md (62 URLs)

- https://mbp.ms.gov/sites/default/files/inline-images/Optum.Release.pdf
- https://ncpa.org/newsroom/qam/2024/10/17/optum-flouted-mississippi-law-says-states-board-pharmacy
- https://mississippitoday.org/2024/11/07/optum-audit-shows-possible-law-violation/
- https://professionals.optumrx.com/resources/manuals-guides/appeals-submission-guide.html
- https://www.nysenate.gov/sites/default/files/article/attachment/final_investigatory_report_pharmacy_benefit_managers_in_new_york.pdf
- https://www.tn.gov/content/dam/tn/commerce/documents/insurance/pbm/pbm-audit-actions/CaremarkReportAuditPackage_20260212.pdf
- https://ipcrx.com/wp-content/uploads/2024/09/08.24.24-VAN-Inmar-Webinar-Slides.pdf
- https://www.g2.com/products/inmar-intelligence-pharmacy-solutions/reviews
- https://www.inmar.com/blog/press/inmar-intelligence-awarded-pharmacy-claims-reconciliation-and-dscsa-compliance
- https://net-rx.com/products/recrx/
- https://www.inmar.com/redirects/returns
- https://www.pbahealth.com/resources/inmar/
- https://rx-delta.com/pricing
- https://rx-delta.com/integrations
- https://rx-delta.com/compare/automated-vs-manual-pharmacy-reconciliation
- https://nadaclookup.com/
- https://www.outcomes.com/reconciliation
- https://www.sykes-cpa.com/third-party-reconciliation-for-independent-pharmacies/
- https://staffingly.com/enterprises/services/specialty-ltc-pharmacy-outsourcing/pharmacy-billing/
- https://www.medsoftwares.com/news/pharmacy-software-cost-pricing-guide-2026
- https://tridentinfo.com/best-pharmacy-management-software-in-2026-complete-comparison-pricing-guide/
- https://www.computertalk.com/health-mart-atlas/
- https://www.cardinalhealth.com/en/services/retail-pharmacy/business-solutions/psao-services.html
- https://www.epicrx.com/differentiating-between-psaos-and-pbms-2/
- https://mgaleg.maryland.gov/cmte_testimony/2020/hgo/3203_02272020_92455-887.pdf
- https://www.drugchannels.net/2018/04/mckesson-leads-another-round-of-psao.html
- https://www.pioneerrx.com/blog/featured-feature-third-party-reconciliation
- https://www.rx30.com/interfaces-modules/electronic-reconciliation/
- https://rxinsider.com/market-buzz/transaction-data-systems-(tds
- https://www.rfp.wiki/specialty-industries/healthcare-life-sciences/healthcare/pharmacy-management-software/pioneerrx/liberty-software
- https://datascanpharmacy.com/what-are-dir-fees-why-do-they-exist-and-what-can-we-do-about-them/
- https://www.truescripts.com/pharmacy-reimbursement-appeal-process
- https://apps.procarerx.com/MCRxDocuments/MAC%20Price%20Review%20Application%20Tool%20-%20Users%20Guide.pdf
- https://www.frierlevitt.com/?p=10540
- https://www.ncpa.org/newsroom/qam/2025/06/02/colorado-targets-support-independents
- https://inthestates.nacds.org/colorado-50-05162025
- https://www.amcp.org/sites/default/files/2026-05/2026-COLORADO-PBM-Reform-Inventory.pdf
- https://open.pluralpolicy.com/co/bills/2025A/HB25-1094
- https://www.frierlevitt.com/articles/2026-state-pbm-reform-nadac-reimbursement-spread-pricing-bans/
- https://www.frierlevitt.com/articles/pbm-enforcement-west-virginia-michigan-independent-pharmacies/
- https://www.frierlevitt.com/articles/kansas-sb-360-pbm-reform-law-and-what-it-means-for-independent-pharmacies/
- https://www.frierlevitt.com/articles/new-jersey-patient-provider-protection-act-a1502-pbm-reform-independent-pharmacies/
- https://www.frierlevitt.com/articles/arizona-pbm-reform-bills-community-pharmacies/
- https://www.frierlevitt.com/articles/legal-protections-pharmacies-pbm-practices-50-state-overview/
- https://ncpa.org/newsroom/qam/2026/05/26/reimbursement-roundup
- https://ncpa.org/newsroom/qam/2026/03/23/reimbursement-round
- https://www.amcp.org/sites/default/files/2026-05/2026-MISSISSIPPI-PBM-Reform-Inventory.pdf
- https://coapharmacy.com/?p=42309
- https://www.supremecourt.gov/opinions/20pdf/18-540_m64o.pdf
- https://www.quarles.com/newsroom/publications/arkansas-pbm-law-upheld-by-supreme-court
- https://ncpa.org/newsroom/executive-update/2026/05/15/cost-plus-wild-ncpa-executive-update-may-15-2026
- https://ncpa.org/newsroom/news-releases/2026/02/04/boom-ftc-squeezes-concessions-cignas-express-scripts
- https://www.drugtopics.com/view/pbm-underpayment-persists-as-cost-plus-brings-new-strain-ncpa-2026
- https://www.frierlevitt.com/articles/express-scripts-cost-plus-reimbursement-340b-risks/
- https://www.frierlevitt.com/articles/cost-plus-pharmacy-pricing-pbm-reforms-strategies/
- https://www.drugchannels.net/2026/04/the-ftc-blows-up-express-scripts-pbm.html
- https://www.fiercehealthcare.com/payers/express-scripts-embraces-cost-plus-pricing-new-clearnetwork-model
- https://www.healthcaredive.com/news/cvs-costvantage-cost-plus-pharmacy-launch/736659/
- https://primetherapeutics.com/w/cvs-costvantage-overview-and-what-it-means-to-prime-clients
- https://digitaledition.chaindrugreview.com/articles/prescription-reimbursement-is-now-through-innovative-and-transparent-cvs-costvantage
- https://www.cga.ct.gov/2026/hsdata/TMY/2026HB-05354-R000303-Schreiner%20Jr.,%20Ed,%20VP%20of%20Network%20Development-Northeast%20Pharmacy%20Service%20Corp-Supports-TMY.PDF
- https://www.intrinsiq.com/insights/impacts-for-medically-integrated-dispensing-in-2026-and-beyond

## competition-C03.md (83 URLs)

- https://github.com/Hopding/pdf-lib
- https://github.com/Hopding/pdf-lib/releases
- https://github.com/Hopding/pdf-lib/issues/1549
- https://github.com/Hopding/pdf-lib/issues/354
- https://github.com/Hopding/pdf-lib/issues?q=is%3Aissue+is%3Aopen+appearance+form
- https://github.com/Hopding/pdf-lib/issues?q=is%3Aissue+is%3Aopen+checkbox
- https://github.com/cantoo-scribe/pdf-lib
- https://github.com/cantoo-scribe/pdf-lib/tags
- https://www.npmjs.com/package/@cantoo/pdf-lib
- https://snyk.io/advisor/npm-package/@cantoo/pdf-lib
- https://depscope.dev/pkg/npm/@cantoo/pdf-lib
- https://depscope.dev/pkg/npm/@pdfme/pdf-lib
- https://security.snyk.io/package/npm/pdfjs-dist
- https://github.com/PhilippMundhenk/stampfill/issues/39
- https://github.com/nbesli/pdf-merger-js/issues/153
- https://github.com/captaincole/OpenReturn/pull/51
- https://github.com/pdfme/pdfme
- https://github.com/pdfme/pdfme/blob/main/packages/pdf-lib/README.md
- https://github.com/LibPDF-js/core
- https://documenso.com/blog/introducing-libpdf-the-pdf-library-typescript-deserves
- https://libpdf.documenso.com/docs/guides/forms
- https://github.com/mozilla/pdf.js
- https://github.com/phihag/pdfform.js
- https://github.com/julianhille/MuhammaraJS
- https://github.com/pdfcpu/pdfcpu
- https://github.com/yfedoseev/pdf_oxide
- https://github.com/yfedoseev/pdf_oxide/issues/2775
- https://github.com/py-pdf/pypdf
- https://pypdf.readthedocs.io/en/latest/user/forms.html
- https://github.com/mstamy2/PyPDF2/issues/506
- https://github.com/pmaupin/pdfrw/issues/84
- https://github.com/mpdf/mpdf/issues/1273
- https://spin.atomicobject.com/pdfsharpcore-fields-chrome/
- https://claudeissues.com/issue/34911-claude-code-struggles-with-pdf-form-filling-comb-digit-boxes-font-sizing-rect-al
- https://www.useanvil.com/ask-anvil/pdfs/filled-pdf-fields-blank-in-adobe-reader/
- https://github.com/docusealco/docuseal
- https://www.useanvil.com/pricing.md
- https://www.useanvil.com/products/pricing/
- https://www.useanvil.com/pdf-filling-api
- https://www.useanvil.com/blog/digital-transformation/best-pdf-filling-api-document-automation/
- https://getemboss.ai/
- https://itextmaster.com/api/form-filler-api/
- https://forhosting.com/kit/fill-pdf-form
- https://apify.com/hipersoft/pdf-fill-form/api
- https://apify.com/ely_source/pdf-form-filler
- https://github.com/pdfops/pdfops-mcp
- https://pdfops.dev/mcp
- https://pypi.org/project/justfill-mcp
- https://www.freshports.org/textproc/pdf-form-filler-mcp/
- https://glama.ai/mcp/servers/Nizoka/pdfnative-mcp/tools/fill_form
- https://apidocs.pdf.co/kb/Fill%20PDF%20and%20Add%20Text%20or%20Images%20(pdf-edit-add
- https://www.vendr.com/marketplace/apryse
- https://simplepdf.com/alternatives/apryse
- https://pricingnow.com/question/apryse-pdf-sdk-pricing/
- https://saasrat.com/products/pdfnet-sdk
- https://www.contractsfinder.service.gov.uk/Notice/58b749ad-b1c1-4950-aeca-e600b7c98c50
- https://www.govconinabox.com/explore/contractors/profile/EDJLL51JQM95
- https://www.nutrient.io/sdk/pricing/
- https://www.nutrient.io/blog/pdf-sdk-pricing-and-licensing-explained/
- https://www.capterra.com/p/171174/PSPDFKit-SDK/pricing/
- https://simplepdf.com/alternatives/pspdfkit
- https://developers.foxit.com/?p=1210
- https://www.trustradius.com/products/foxit-pdf-sdk/pricing
- https://developer.adobe.com/document-services/pricing/
- https://developer.adobe.com/document-services/docs/overview/limits
- https://chrishaff.github.io/developers-stage.adobe.com/apis/documentcloud/dcsdk/pdf-pricing.html
- https://community.adobe.com/questions-21/aws-charged-for-3-000-in-adobe-pdf-services-api-u-s-out-of-nowhere-1560209
- https://community.adobe.com/t5/acrobat-services-api-discussions/looking-for-api-pricing-over-500-transactions-per-month/td-p/15546188
- https://mergr.com/apryse-software-acquires-itext-group-nv
- https://yespress.io/apryse
- https://www.theatdb.com/news/apryse-acquires-pdf-tools-to-expand-global-customer-reach-and-advance-high-performance-document-processing
- https://www.pdfa.org/pspdfkit-acquires-leading-document-software-provider-muhimbi/
- https://mergr.com/transaction/pspdfkit-acquires-aquaforest
- https://pspdfkit.com/company/about/acquisitions/orpalis/
- https://mergr.com/transaction/pspdfkit-acquires-integrify
- https://www.nutrient.io/about/pspdfkit/
- https://www.upwork.com/services/product/development-it-a-custom-uscis-web-form-tool-that-generates-a-filled-submission-ready-pdf-2070201672171135049
- https://peerlist.io/junaid_97/project/fillvisa-open-source
- https://browse.sh/skills/uscis.gov/fill-i539-application-form-b6dv4f
- https://wildandfreetools.com/blog/fill-government-pdf-forms-online
- https://www.airslate.com/workflow/document/1127454-system-form-i-130-pre-fill-from-csv-file-bot
- https://instafill.ai/forms/form-i-130-petition-for-alien-relative-1
- https://www.lido.app/fb-landing/immigration-form-automation

## competition-C04.md (82 URLs)

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

## competition-C05.md (72 URLs)

- https://www.civicplus.com/nextrequest-public-records-software/
- https://www.civicplus.com/nextrequest-public-records-software/risk-module/
- https://www.civicplus.com/fact-sheets/rr/boost-efficiency-compliance-transparency-nextrequest/
- https://www.civicplus.com/blog/rr/foia-requests-are-up-stay-resilient/
- https://www.getapp.com/government-social-services-software/a/nextrequest/
- https://www.capterra.com/p/177602/NextRequest/
- https://citizenportal.ai/articles/10546685/new-york/dutchess-county/dover/dover-board-approves-nextrequest-foil-software-citing-ai-redaction-concerns
- https://en.wikipedia.org/wiki/CivicPlus
- https://www.govtech.com/biz/archivesocial-acquires-nextrequest-adding-foia-software
- https://granicus.com/product/records-request-management-govqa/
- https://granicus.com/product/records-request-management-legal-suite-govqa/
- https://granicus.com/resource/2026-trends-in-public-records-request-management-report/
- https://granicus.com/press-release/granicus-acquires-leading-compliance-software-provider-govqa-to-help-government-agencies-manage-exponential-increase-in-public-records-requests/
- https://granicus.com/success-stories/natural-disaster-national-attention-public-records-request-management-steps-up-in-time-of-need/
- https://dekree.ai/compare/govqa-alternative
- https://dekree.ai/compare/govqa-pricing
- https://www.route-fifty.com/artificial-intelligence/2026/04/how-public-records-requests-could-help-fight-ai-ai/412825/
- https://betaquick.com/blog/ai-foia-public-records-intake/
- https://betaquick.com/blog/ai-city-clerk-offices/
- https://www.justfoia.com/product-features/redaction/
- https://www.justfoia.com/news/2026-top-foia-trends/
- https://justfoia.com/case-study/how-san-marcos-ca-shared-the-records-request-workload-and-cut-processing-time
- https://www.g2.com/products/justfoia/pricing
- https://www.businesswire.com/news/home/20260804399986/en/
- https://caseguard.com/redaction-pricing/
- https://caseguard.com/event/ai-for-nj-government-foia-opra-redaction/
- https://g2.com/products/redactable/pricing
- https://www.softwareadvice.com/law-enforcement/veritone-redact-profile/
- https://www.capterra.com/p/184450/Veritone-Redact/reviews/?rating=4
- https://us.fitgap.com/products/veritone-redact
- https://www.policemag.com/articles/artificial-intelligence-and-faster-digital-evidence-redaction
- https://www.veritone.com/press-releases/veritone-redact-now-integrated-with-ains-foiaxpress-platform
- https://www.logikcull.com/product/public-records
- https://www.logikcull.com/blog/how-foia-teams-are-fighting-ai-with-ai
- https://www.casepoint.com/solutions/foia-public-records-teams/
- https://www.relativity.com/blog/public-sector-legal-tech-trends-what-agencies-should-watch-in-2026/
- https://jatheon.com/solutions/foia/
- https://www.ordinalforgov.com/city-clerks
- https://gov.appmaisters.com/products/resident-portal/public-record-request-management/
- https://vidizmo.ai/solutions/public-records-requests
- https://www.polimorphic.com/departments/ai-tools-for-clerks-and-recorders-to-modernize-records-access
- https://www.polimorphic.com/articles/hernando-board-approves-contract-for-ai-customer-service-system
- https://rightaichoice.com/tools/polimorphic
- https://www.sortresume.ai/best-ai-tools-government-customer-service-2026/
- https://www.flcities.com/wp-content/uploads/2026/08/Buyers-Guide-AI-Tools-for-Building-Permitting.pdf
- https://techcrunch.com/2026/09/10/ai-agents-are-flooding-public-services-with-new-requests/
- https://www.localgovernmentlawyer.co.uk/information-law/398-information-law-news/101629-researchers-warn-of-agentic-flooding-of-public-services-with-ai-generated-communications
- https://www.muckrock.com/news/archives/2026/jul/15/using-ai-for-foia-in-2026-what-requesters-should-know/
- https://citizenportal.ai/articles/8587513/florida/palm-beach-county/ocean-ridge/staff-warns-of-automated-public-records-requests-and-ai-driven-inquiry-activity
- https://www.cadillacnews.com/news/residents-use-of-ai-to-draft-foia-requests-criticized-by-city-officials/article_5f3fb893-c140-41e2-8971-253926ad68aa.html
- https://www.unite.ai/ai-public-records-requests-government-crisis/
- https://www.lcwlegal.com/news/public-records-act-meets-ai-what-recent-records-requests-reveal-about-chatgpt-use-in-government/
- https://www.axios.com/local/san-diego/2026/04/01/how-san-diego-uses-ai-government-copilot-gemini-future-potholes-records-requests
- https://calmatters.org/politics/2026/06/california-public-records-access-restriction/
- https://www.aalrr.com/newsroom-alerts-4245
- https://apcp.assembly.ca.gov/system/files/2026-06/sb-1159-cabaldon-apcp-analysis.pdf
- https://calmatters.digitaldemocracy.org/bills/ca_202520260sb1159
- https://www.billtrack50.com/billdetail/1830371
- https://policerecordsmanagement.com/when-the-requester-is-a-robot-how-records-managers-should-handle-bot-generated-public-records-requests/
- https://citizenportal.ai/articles/10432085/Washington/King-County/Issaquah/Issaquah-committee-broadens-Public-Records-Act-language-as-AI-driven-requests-strain-staff
- https://wa-pro.org/wp-content/uploads/2026/05/3-Public-records-in-the-age-of-AI.pdf
- https://www.flsenate.gov/Session/Bill/2026/437/Analyses/h0437g.SAC.PDF
- https://www.flsenate.gov/Session/Bill/2026/1361
- https://www.flsenate.gov/Session/Bill/2026/744
- https://www.flsenate.gov/Session/Bill/2026/770
- https://floridapolitics.com/archives/785099-bill-to-make-it-easier-to-get-public-records-dies/
- https://berkeleyca.gov/sites/default/files/documents/2025-04-15%20Item%2008%20Contract%20No.%2032000177%20Amendment%20NextRequest%20PRA%20Software.pdf
- https://berkeleyca.gov/sites/default/files/documents/2021-03-30%20Item%2013%20Contract%20No.%2032000177%20Amendment%20NextRequest.pdf
- https://citizenportal.ai/articles/7718019/michigan/oakland-county/troy-city/council-approves-consultant-contracts-contract-extensions-foia-software-and-routine-appointments
- https://mccmeetings.blob.core.usgovcloudapi.net/mcclearywa-pubu/MEET-Packet-361d78dcb3c54744977b38a799e9e496.pdf
- https://www.civicrecordsonline.com/nextrequest-alternative
- https://www.muckrock.com/news/archives/2023/sep/26/foiaonline-shutting-down/

## competition-C06.md (81 URLs)

- https://www.fastenhealth.com/
- https://github.com/api-evangelist/fasten-health
- https://github.com/fastenhealth/fasten-onprem
- https://apis.io/providers/fasten-health/
- https://apps.smarthealthit.org/app/fasten-health
- https://www.crunchbase.com/organization/fasten-health
- https://pitchbook.com/profiles/company/711616-60
- https://www.flexpa.com/pricing
- https://www.flexpa.com/docs/records
- https://www.flexpa.com/docs/consent/patient-access
- https://www.flexpa.com/product-overview
- https://www.flexpa.com/blog/oura-and-flexpa-partner-to-ground-wearable-health-insights-in-clinical-records
- https://www.cms.gov/initiatives/health-technology-ecosystem/overview/pledge-demo-showcase/flexpa
- https://startupintros.com/orgs/flexpa
- https://elion.health/products/flexpa
- https://chartsquad.com/
- https://chartsquad.com/about-us/faq/
- https://chartsquad.com/about-us/
- https://chartsquad.com/about-us/medical-records-news-and-information/records-request-operational-costs/
- https://evolvelaw.ai/chartsquad.html
- https://blog.cvn.com/the-hipaa-application-that-slashes-law-firms-medical-records-costs
- https://www.lighthouselegal.ai/learn/chartsquad-vs-record-grabber-medical-records
- https://www.tavrn.ai/blog/tavrn-vs-chart-squad
- https://www.tavrn.ai/blog/medical-record-retrieval-companies-for-lawyers
- https://www.tavrn.ai/blog/personal-injury-medical-records-request
- https://arctrieval.com/wp-content/uploads/2025/05/Arctrieval-Record-Cost-Guidance-2025_03_04.pdf
- https://www.getcodeshealth.com/blogs/evenup-vs-supio-vs-codes-health
- https://www.getcodeshealth.com/blogs/tavrn-vs-evenup-vs-codes-health
- https://www.getcodeshealth.com/blogs/tavrn-reviews
- https://www.getcodeshealth.com/blogs/ciox-health-reviews
- https://www.getcodeshealth.com/blogs/national-record-retrieval-alternatives
- https://www.hellocounsel.ai/blog/codes-health-alternatives
- https://www.hellocounsel.ai/blog/medical-records-retrieval-companies
- https://www.inquery.ai/post/best-medical-record-retrieval-companies-law-firms/
- https://medrecords.ai/reports/chartswap-review/
- https://medrecords.ai/best/medical-record-retrieval-services/
- https://www.recordsontime.com/top-medical-record-retrieval-companies-2026/
- https://attorneyatlawmagazine.com/legal-vendors/top-7-medical-record-retrieval-services-for-law-firms
- https://www.vaquill.ai/blog/best-ai-software-plaintiff-law-firms
- https://www.aivortex.io/legal/compare/evenup-vs-filevine/
- https://www.uslegalsupport.com/record-retrieval/medical/
- https://www.lexitaslegal.com/solutions/record-retrieval
- https://www.chartrequest.com/articles/personal-injury-record-retrieval-process
- https://www.fiercehealthcare.com/health-tech/datavant-acquires-real-world-evidence-company-aetion-boost-its-life-sciences-business
- https://dealroom.co/companies/datavant/
- https://ecf.ca8.uscourts.gov/opndir/20/03/183467P.pdf
- https://www.marketscreener.com/quote/stock/RELX-PLC-9590187/news/LexisNexis-Risk-Solutions-Acquires-Human-API-43635179/
- https://hitconsultant.net/2023/04/25/lexisnexis-risk-solutions-acquires-human-api/
- https://www.prnewswire.com/news-releases/invitae-divests-ciitizen-health-data-platform-and-implements-further-cost-cuts-302014675.html
- https://medcitynews.com/2024/11/invitae-healthcare-data/
- https://www.fiercebiotech.com/medtech/labcorp-picks-invitae-portfolio-239m-bankruptcy-sale
- https://fhir.epic.com/Documentation
- https://open.epic.com/Tutorial/PatientAuthentication?whereFrom=MyChart
- https://mychart.nyulmc.org/mychart/en-us/docs/PatientAuthenticationInstructions.pdf
- https://mychart.bsahs.org/en-us/docs/InteroperabilityGuide_en.pdf
- https://rce.sequoiaproject.org/wp-content/uploads/2026/01/SOP-IAS-Provider-Requirements_v2.1_508.pdf
- https://rce.sequoiaproject.org/wp-content/uploads/2025/04/SOP-IAS-Exchange-Purpose-Implementation-v2.1-April-2025_508.pdf
- https://rce.sequoiaproject.org/wp-content/uploads/2026/02/TEFCA-IAS-Proposal-2-pager-DRAFT-5081.pdf
- https://healthit.gov/wp-content/uploads/2025/09/2026AnnualMeeting_TEFCA-from-A-to-Z.pdf
- https://www.federalregister.gov/documents/2024/12/16/2024-29163/health-data-technology-and-interoperability-trusted-exchange-framework-and-common-agreement-tefca
- https://natlawreview.com/article/federal-court-strikes-down-hipaa-fee-limitations-third-party-medical-records
- https://www.nixonpeabody.com/insights/alerts/2020/02/04/ocr-issues-notice-regarding-medical-record-fees
- https://www.federalregister.gov/documents/2021/01/21/2020-27157/proposed-modifications-to-the-hipaa-privacy-rule-to-support-and-remove-barriers-to-coordinated-care
- https://healthit.gov/data/data-briefs/growth-health-it-enabled-patient-engagement-capabilities-among-us-hospitals-2021/
- https://healthit.gov/wp-content/uploads/2025/07/DB68-Hospital-Use-of-APIs-to-Enable-Data-Sharing_508.pdf
- https://healthit.gov/blog/interoperability/checking-in-on-hospital-ehr-apis-can-providers-and-patients-access-and-share-health-data-via-apps/
- https://www.techtarget.com/patientengagement/news/366584778/Digital-Patient-Data-Access-Grows-in-Large-Hospitals-Lags-in-Small-Orgs
- https://healthit.gov/information-blocking/enforcement-alert/
- https://www.hklaw.com/en/insights/publications/2026/02/the-wait-is-over-information-blocking-enforcement-is-officially-here
- https://www.healthcarelawinsights.com/2026/03/hhs-crackdown-on-information-blocking-new-era-of-enforcement-fines-and-compliance-risks-for-healthcare-entities/
- https://www.mcdermottlaw.com/insights/hhs-issues-provider-information-blocking-disincentives-final-rule/
- https://www.expertinstitute.com/resources/insights/medical-evidence-issues-in-personal-injury-trials-admitting-evidence-in-medical-records-to-prove-or-challenge-causation-and-damages/
- https://www.llamalab.ai/blog/medical-records-evidence-authentication-admissibility
- https://www.mlpime.com/medical-record-authentication/
- http://www.nfsesq.com/resources/california-law-admitting-medical-records-at-trial/
- https://www.ssa.gov/blog/en/posts/2026-02-11.html
- https://www.nextgov.com/digital-government/2026/08/social-security-expands-electronic-health-record-sharing-speed-disability-claims-adjudication/415496/
- https://www.govexec.com/technology/2026/08/social-security-expands-electronic-health-record-sharing-speed-disability-claims-adjudication/415501/
- https://www.techtarget.com/searchhealthit/feature/How-EHR-sharing-speeds-up-disability-applications-for-patients
- https://www.fingerlakes1.com/2025/03/28/social-security-disability-health-it-2025
- https://www.healthcareitnews.com/news/some-epic-health-systems-now-connect-ssa-through-tefca

## competition-C07.md (57 URLs)

- https://www.cbpp.org/research/health/assessing-the-medicaid-work-requirement-vendor-landscape
- https://www.cbpp.org/research/health/a-guide-to-reducing-coverage-losses-through-effective-implementation-of-medicaids
- https://www.cbpp.org/blog/understanding-cmss-emmy-medicaid-work-requirement-tools
- https://digitalgovernmenthub.org/wp-content/uploads/2026/05/2-9-26health.pdf
- https://newhampshirebulletin.com/2026/10/22/new-hampshire-sets-up-digital-system-to-accommodate-new-medicaid-work-requirements/
- https://www.nextgov.com/digital-government/2026/07/cms-quietly-moved-medicaid-technology-project-federal-data-hub-new-eligibility-requirements-approach/415106/
- https://insidehealthpolicy.com/daily-news/cms-emmy-medicaid-work-req-app-awaits-additional-policy-guidance
- https://www.medicaid.gov/resources-for-states/working-families-tax-cut-legislation/community-engagement/pledges-from-medicaid-tech-companies
- https://www.cms.gov/newsroom/press-releases/cms-launches-nationwide-framework-implement-medicaid-work-requirements
- https://www.fiercehealthcare.com/regulatory/10-medicaid-vendors-pledge-600m-discounted-free-services-support-work-requirements-cms
- https://www.healthcaredive.com/news/medicaid-vendors-trump-deals-cms-work-requirements/810839/
- https://www.healthcarefinancenews.com/news/tech-companies-pledge-600-million-support-states-medicaid-work-requirements
- https://news.bloomberglaw.com/health-law-and-business/tech-financial-firms-sign-on-to-build-medicaid-work-requirement
- https://www.beckerspayer.com/payer/medicaid/cms-secures-600m-in-tech-support-for-medicaid-work-rules/
- https://ccf.georgetown.edu/2026/02/11/implementing-costly-medicaid-work-reporting-requirements-who-will-foot-the-bill/
- https://ccf.georgetown.edu/2026/02/06/self-help-tools-and-tutorials-are-critical-to-implementing-medicaid-work-reporting-requirements/
- https://shvs.org/wp-content/uploads/2025/11/SHVS_Work-Requirements-Compliance-and-Exemptions-Verification_November-2025.pdf
- https://www.businesswire.com/news/home/20230223005352/en/mPulse-Supports-Over-30-Medicaid-Managed-Care-Organization-Customers-During-the-Unwinding-of-Continuous-Enrollment
- https://resources.cotiviti.com/case-study/medicaid-plans-leverage-eliza-to-reach-members-during-redetermination
- https://www.firstsource.com/wp-content/uploads/2023/11/Firstsource-Provider-Medicaid-Redermination_Solution-Overview.pdf
- https://prnewswire.com/news-releases/virgin-pulse-helps-health-plans-reach-vulnerable-populations-facing-medicaid-redetermination-301745517.html
- https://www.oliverwyman.com/our-expertise/perspectives/health/2024/jan/overcoming-medicaid-redetermination-hurdles-in-2024.html
- https://ai.novoflow.io/solution-automates-medicaid-redetermination-outreach-calls
- https://www.ohmd.com/care-setting/fqhc
- https://www.caremessage.org/partners/fqhcs/
- https://www.lumahealth.io/who-we-serve/fqhc/
- https://www.lumahealth.io/platform/integrations/epic
- https://www.prnewswire.com/news-releases/luma-health-accelerates-the-shift-to-operational-ai-across-health-system-workflows-302691540.html
- https://www.mobihealthnews.com/news/fortuna-health-raises-18m-enhance-ai-medicaid-enrollment
- https://www.hcinnovationgroup.com/policy-value-based-care/medicare-medicaid/news/55304442/fortuna-gets-funding-to-expand-medicaid-enrollment-solution
- https://fiercehealthcare.com/health-tech/medicaid-navigation-startup-fortuna-health-picks-4m-investment-backed-a16z-cityblock
- https://oes.gsa.gov/projects/2406-increasing-medicaid-renewals-with-texts/
- https://oes.gsa.gov/assets/abstracts/2406-abstract.pdf
- https://codeforamerica.org/explore/louisiana-demo/
- https://codeforamerica.org/news/leveraging-text-messaging-to-improve-communications-in-safety-net-programs/
- https://kffhealthnews.org/news/article/state-medicaid-programs-texting-capability-reenrollment-communication/amp
- https://www.kff.org/medicaid/experience-of-the-five-largest-publicly-traded-companies-operating-medicaid-managed-care-plans-during-unwinding/
- https://www.kff.org/medicaid/unwinding-of-medicaid-continuous-enrollment-key-themes-from-the-field/
- https://realeconomy.rsmus.com/healthcare-industry-trend-watch-week-of-aug-17-2026/
- https://centaurihs.com/?p=5793
- https://agilian.com/resources/blog/the-real-cost-of-losing-5-percent-medicaid-members
- https://www.nachc.org/wp-content/uploads/2023/08/Preparing-for-Medicaid-Unwinding-Financial-Impact-FAQ.pdf
- https://legislature.vermont.gov/Documents/2024/WorkGroups/House%20Health%20Care/FY2024%20Budget/W~Mary%20Kate%20Mohlman~Bi-State%20Primary%20Care%20Association%20Testimony%20-%20Federally%20Qualified%20Health%20Centers%20Medicaid%20Rates~2-23-2023.pdf
- https://www.milbank.org/quarterly/articles/estimating-the-impact-of-medicaid-expansion-and-federal-funding-cuts-on-fqhc-staffing-and-patient-capacity/
- https://chcimpact.org/hr1-medicaid-heatmap/
- https://grantedai.com/blog/community-health-centers-medicaid-work-requirements-funding-crisis-strategy-2026
- https://gbpi.org/georgias-pathways-to-coverage-program-the-first-year-in-review-fact-sheet/
- https://www.commonwealthfund.org/blog/2024/few-georgians-are-enrolled-states-medicaid-work-requirement-program
- https://floridaphoenix.com/2025/09/26/repub/georgias-limited-medicaid-expansion-program-is-extended-through-2026-despite-concerns-about-cost/
- https://dhhs.ne.gov/WorkRequirements
- https://dhhs.ne.gov/Pages/New-Medicaid-Work-Requirements-Take-Effect-for-Expansion-Members-Friday.aspx
- https://www.ktiv.com/2025/12/31/nebraska-implement-medicaid-work-requirements-starting-may-2026/
- https://www.nebraskahospitals.org/nebraska-hospitals-warn-medicaid-work-rules-could-disrupt-care
- https://www.inquirer.com/health/benefits-data-trust-closing-august-23-20240823.html
- https://route-fifty.com/management/2024/07/nonprofits-abrupt-closure-puts-access-public-benefits-risk/397968
- https://www.statnews.com/2026/08/10/medicaid-work-requirement-changes-states-contact/
- https://www.openmedicaid.org/insights/work-requirements-2026

## competition-C11.md (70 URLs)

- https://github.com/Polymarket/py-clob-client/issues/338
- https://arxiv.org/html/2606.16852v1
- https://arxiv.org/abs/2606.16852
- https://github.com/Polymarket/rs-clob-client-v2/issues/36
- https://github.com/nautechsystems/nautilus_trader/issues/3844
- https://docs.polymarket.com/v2-migration
- https://www.quantvps.com/blog/polymarket-clob-central-limit-order-book
- https://www.quantvps.com/blog/polymarket-fixes-ghost-fills-clob-v2-upgrade
- https://www.kucoin.com/news/flash/polymarket-v2-launches-ghost-fills-addressed-but-not-fully-resolved
- https://www.kucoin.com/news/insight/POL/69f873492f8d6c000732226a
- https://x.com/Autonomous_Chad/status/2050690992882221273
- https://github.com/orderbooktrade/ghostguard
- https://github.com/OrderBookTrade/v2-migration
- https://www.theblock.co/post/390546/polymarket-buys-fresh-prediction-market-api-startup-dome-marking-second-official-acquisition
- https://pulse2.com/polymarket-acquires-prediction-market-api-startup-dome/
- https://crypto.news/polymarket-acquires-prediction-market-api-startup-dome/
- https://crypto-fundraising.info/projects/polymarket-analytics/
- https://predictreport.io/blog/best-prediction-market-apis-builders
- https://www.apibricks.io/blog/prediction-market-api-one-data-layer-for-the-future-of-event-markets
- https://techfundingnews.com/polymarket-400m-15b-valuation-ice-nyse-investment/
- https://fintech.global/2026/05/06/elastics-raises-2m-pre-seed-for-ai-prediction-market-agents/
- https://fortune.com/2026/07/16/exclusive-prediction-market-startup-pascal-9-million-heavyweights-kalshi-and-polymarket/
- https://www.coindesk.com/business/2026/02/04/opinion-raises-usd20-million-as-prediction-markets-draw-capital-in-a-weak-crypto-market
- https://cryptorank.io/insights/deals/parlay-x-pre-seed-2026-09-03
- https://www.thesaasnews.com/news/predictpro-raises-4m-strategic-investment/
- https://www.cnbc.com/2026/10/29/kalshi-40-billion-valuation-funding-round.html
- https://www.quicknode.com/builders-guide/tools/adjacent-news-by-adjacent-news
- https://observablehq.com/@adjacent/adjacent-news-api-exploration
- https://app.dealroom.co/companies/adjacent_markets
- https://adjacentresearchxyz.notion.site/Adjacent-News-Manifund-Application-f686227d78ab4cd49f7fe8ffcd1b52fb
- https://stacymuur.substack.com/p/polymarket-trading-tools-masterclass
- https://app.dealroom.co/companies/polysights
- https://pm.wiki/uk/projects/polysights
- https://orrery.me/research/best-polymarket-analytics-tools/markdown
- https://www.bonus.com/prediction-markets/tools/polymarket-analytics/
- https://polyalerthub.com/
- https://polyalerthub.com/comparisons
- https://launchpoly.com/category/analytics
- https://kalshi-public-docs.s3.amazonaws.com/Kalshi-Developer-Agreement.pdf
- https://www.predictionhunt.com/terms-of-service
- https://telonex.io/terms
- https://apidocs.polymarketexchange.com/isv-partners/participant-agreement
- https://www.marketdata.app/docs/account/data-policies/data-redistribution/
- https://huggingface.co/datasets/trentmkelly/polymarket_historical_data
- https://www.pulse.bot/fintech/news/kalshi-expands-data-distribution-with-procap-research-deal-40d839fb-571c-4321-bba5-53a4a3465038/
- https://a-teaminsight.com/blog/tradeweb-and-kalshi-announce-strategic-partnership-to-expand-institutional-access-to-prediction-markets/?brand=madi
- https://news.bloomberglaw.com/financial-accounting/wall-street-bond-trading-hub-tradeweb-strikes-deal-with-kalshi
- https://www.financemagnates.com/institutional-forex/tradeweb-backs-kalshi-after-jump-trading-to-push-prediction-markets-to-institutions/
- https://ground.news/article/prediction-giant-kalshi-strikes-a-new-media-partnership-with-cnbc-days-after-its-cnn-deal_0cdeec
- https://digitalmoneybox.com/news/research/cnbc-taps-kalshi-to-bring-real-time-prediction-data-into-financial-coverage
- https://www.kucoin.com/news/flash/kalshi-launches-bloomberg-terminal-style-interface-for-prediction-market-traders
- https://finance.yahoo.com/markets/crypto/articles/polymarket-kalshi-volumes-hit-150b-145540046.html
- https://www.pewresearch.org/short-reads/2026/07/22/what-we-know-about-the-typical-polymarket-user/
- https://www.trmlabs.com/resources/blog/how-prediction-markets-scaled-to-usd-21b-in-monthly-volume-in-2026
- https://startupfortune.com/kalshi-and-polymarket-just-posted-their-biggest-trading-month-on-record/
- https://predictionscout.com/research/prediction-market-statistics/
- https://blockonomi.com/prediction-market-statistics-2026-kalshi-polymarket-and-the-numbers-behind-the-boom
- https://www.nbcnews.com/business/consumer/polymarket-trading-halt-hack-wallets-rcna606405
- https://rollingout.com/2026/10/29/polymarket-halts-trading-exploit-users/
- https://orochi.network/blog/oracle-manipulation-in-polymarket-2025
- https://laikalabs.ai/news/polymarket-uma-oracle-resolution-disputes-scrutiny
- https://www.turbinefi.com/blog/how-prediction-markets-resolve-oracles-disputes-2026
- https://www.webopedia.com/crypto/learn/polymarkets-uma-oracle-controversy/
- https://polymarkets.co.il/en/guide/uma-disputes/
- https://truthinadvertising.org/wp-content/uploads/2026/03/Golan-v-Kalshi-complaint.pdf
- https://decrypt.co/360293/kalshi-sued-refusing-pay-out-prediction-market-iran-leader-death
- https://www.financemagnates.com/fintech/khamenei-out-market-becomes-legal-headache-for-kalshi/
- https://www.mondaq.com/unitedstates/arbitration-dispute-resolution/1749320/its-not-on-the-house-the-risks-of-ambiguity-in-prediction-markets
- https://help.underdogfantasy.com/en/articles/14127596-settlement-issues-disputes
- https://pm.wiki/tr/learn/is-kalshi-legal

## why-now-discontinuities.md (78 URLs)

- https://www.spheron.network/blog/llm-api-pricing-comparison-gpt-claude-gemini-deepseek-2026/
- https://www.morphllm.com/llm-api
- https://benchlm.ai/blog/posts/llm-pricing-2026
- https://benchlm.ai/anthropic/api-pricing
- https://www.finout.io/blog/anthropic-api-pricing
- https://www.maximem.ai/blog/claude-api-pricing-2026
- https://www.morphllm.com/comparisons/groq-vs-deepinfra
- https://costbench.com/software/llm-api-providers/deepinfra/
- https://capitalandcompute.net/ai-inference-providers/groq/
- https://pricepertoken.com/pricing-page/model/openai-gpt-4
- https://capitalandcompute.net/blog/cost-per-token-over-time/
- https://tokencostcalculator.pages.dev/llm-price-history/
- https://www.morphllm.com/best-open-source-llm
- https://kingy.ai/news/best-open-weight-ai-models-in-2026-glm-5-2-vs-deepseek-v4-vs-kimi-k2-6-vs-qwen-vs-mistral/
- https://arxiv.org/pdf/2508.03153
- https://github.com/openai/gpt-oss
- https://github.com/QwenLM/Qwen3.5
- https://github.com/MoonshotAI/Kimi-K2
- https://github.com/deepseek-ai/DeepSeek-V3.2-Exp
- https://github.com/meta-llama/llama-models
- https://github.com/google-gemini/gemma-cookbook
- https://github.com/mistralai/mistral-inference
- https://arxiv.org/pdf/2608.22959
- https://regolo.ai/deepseek-ocr-vs-glm-ocr-vs-paddleocr-benchmark-2026/
- https://www.spheron.network/blog/best-open-source-ocr-vlm-self-host-gpu-cloud-2026/
- https://arxiv.org/pdf/2605.27978
- https://arxiv.org/pdf/2603.24373
- https://blog.roboflow.com/best-open-source-ocr-models/
- https://github.com/deepseek-ai/DeepSeek-OCR
- https://github.com/NVIDIA-NeMo/NeMo
- https://github.com/ggml-org/whisper.cpp
- https://github.com/k2-fsa/sherpa-onnx
- https://github.com/ggml-org/llama.cpp
- https://github.com/ollama/ollama
- https://insiderllm.com/guides/best-local-llms-mac-2026/
- https://localaimaster.com/mac/best-llm-16gb-mac
- https://www.natashatherobot.com/p/apple-foundation-models
- https://dev.to/arshtechpro/wwdc-2026-apple-just-opened-the-foundation-models-framework-to-any-llm-provider-5ejn
- https://hackernoon.com/a-developers-guide-to-apples-foundation-models-framework-in-ios-26
- https://benchlm.ai/benchmarks/osworld-verified
- https://benchlm.ai/benchmarks/osworld2
- https://decodethefuture.org/en/ai-agent-benchmarks-2026/
- https://github.com/xlang-ai/OSWorld
- https://github.com/web-arena-x/webarena
- https://github.com/sierra-research/tau2-bench
- https://github.com/METR/eval-analysis-public
- https://x.com/METR_Evals/status/2026355544668385373
- https://www.matthewswong.com/en/blog/metr-developer-productivity-2026-uplift-update/
- https://philippdubach.com/posts/93-of-developers-use-ai-coding-tools.-productivity-hasnt-moved./
- https://github.com/modelcontextprotocol/modelcontextprotocol
- https://github.com/modelcontextprotocol/registry
- https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol
- https://nimblebrain.ai/blog/state-of-mcp-security-2026/
- https://the-agent-report.com/2026/07/mcp-security-landscape-2026-vulnerabilities-mitigations/
- https://arxiv.org/abs/2510.16558
- https://authzed.com/blog/timeline-mcp-breaches
- https://github.com/a2aproject/A2A
- https://github.com/anthropics/skills
- https://github.com/openai/openai-apps-sdk-examples
- https://github.com/agentic-commerce-protocol/agentic-commerce-protocol
- https://github.com/google-agentic-commerce/AP2
- https://github.com/coinbase/x402
- https://github.com/auth0/auth0-ai-js
- https://github.com/stripe/agent-toolkit
- https://github.com/TheRobotStudio/SO-ARM100
- https://github.com/huggingface/lerobot
- https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/
- https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-omnibus-vii-deadline-delay-20260/
- https://www.joneswalker.com/en/insights/blogs/ai-law-blog/yes-august-2-still-matters-the-eu-approved-a-high-risk-ai-delay-but-most-trans.html
- https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes
- https://cdp.cooley.com/digital-ai-omnibus-delays-key-deadlines-introduces-new-rules/
- https://slashdot.org/story/26/08/25/1756243/ai-is-hitting-entry-level-jobs-hardest-stanford-study-finds
- https://intuitionlabs.ai/articles/ai-entry-level-employment-hiring-data
- https://launchready.ai/insights/ai-workforce/stanford-young-workers-ai-employment-gap-19-percent
- https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users
- https://techcrunch.com/2026/03/28/anthropics-claude-popularity-with-paying-consumers-is-skyrocketing
- https://www.businessofapps.com/data/claude-statistics/
- https://technologychecker.io/blog/chatgpt-statistics

## yc-thiel-context.md (69 URLs)

- https://www.ycombinator.com/rfs
- https://x.com/ycombinator/status/2111183078072979886
- https://x.com/kseniam0s/status/2115478381462429904
- https://x.com/stretchcloud/status/2115321161471177153
- https://vclens.substack.com/p/yc-requests-for-startups-winter-2027
- https://conferras.com/blog/yc-requests-for-startups-winter-2027
- https://linas.substack.com/p/yc-winter-2027-requests-for-startups
- https://foundedceo.substack.com/p/y-combinator-releases-its-new-requests
- https://www.the-founders-corner.com/p/yc-just-published-its-startup-wishlist
- https://fourweekmba.com/ai-yc-names-11-startup-ideas-as-ai-bottlenecks-move-past-models/
- https://www.kucoin.com/news/flash/yc-identifies-11-ai-driven-sectors-shifting-from-models-to-real-world-applications
- https://beinsure.com/news/y-combinators-winter-2027-startup-priorities/
- https://postdigitalist.xyz/yc-request-for-startups/
- https://colrows.com/blogs/plaid-for-government-benefits/
- https://www.chaincatcher.com/en/article/2299835
- https://huggingface.co/datasets/rdjarbeng/yc-rfs-analysis-2026
- https://github.com/CharlieChenyuZhang/news-watchdog
- https://github.com/lanaccelerator/lan-skills
- https://github.com/eric0205market-bit/market-intelligence
- https://github.com/Yashsharma1911/granted
- https://github.com/ZacSadan/podcasts-summary
- https://github.com/admin-gltrax/gltrax-hacks-healthcare-
- https://github.com/humanaios-ui/operations
- https://modelence.com/yc-rfs-summer-2026
- https://modelence.com/yc-rfs-spring-2026
- https://www.thevccorner.com/p/yc-summer-2026-requests-for-startups-ideas
- https://urbangeekz.com/2026/05/y-combinator-reveals-15-startup-ideas-it-wants-founders-to-build-in-summer-2026/
- https://substack.com/@linas/note/c-250609833
- https://superframeworks.com/articles/yc-rfs-startup-ideas-indie-hackers-2026
- https://www.the-ai-corner.com/p/yc-request-for-startups-2026-70-ideas
- https://www.linkedin.com/posts/joseph-michael_y-combinator-just-released-their-request-activity-7424720983363784704-ju7i
- https://www.joinleland.com/library/a/yc-application
- https://www.roundfunded.com/en/blogs/yc-application-deadlines-2026-2027
- https://www.roundfunded.com/en/blogs/yc-batches-2026-dates-acceptance-rate
- https://www.roundfunded.com/en/blogs/yc-standard-deal-equity-explained-2026
- https://www.roundfunded.com/en/yc-startups/summer-2026
- https://zyner.io/blog/yc-application-deadline
- https://zyner.io/blog/yc-standard-deal
- https://venturecapitaltracker.com/yc-fall-2026-application-deadline-interview-guide
- https://www.startupgrantsindia.com/y-combinator-winter-2027
- https://en.wikipedia.org/wiki/Y_Combinator
- https://founderstoday.org/startup-accelerators-2026/y-combinator
- https://ycinsight.com/questions/applying-to-yc
- https://www.quora.com/Can-I-apply-to-Y-Combinator-as-a-17-year-old-startup-founder
- https://admissionsight.com/y-combinator/
- https://foundedceo.substack.com/p/y-combinators-new-data-shows-how
- https://www.extruct.ai/research/ycw26/
- https://www.extruct.ai/research/ycx26/
- https://www.neweconomies.co/p/y-combinator-summer-26-batch
- https://www.foundra.ai/key-reads/yc-s26-demo-day-agent-infrastructure-founder-strategy-2026
- https://en.wikipedia.org/wiki/Thiel_Fellowship
- https://www.businesswire.com/news/home/20250522267532/en/Thiel-Foundation-Announces-2025-Class-of-Thiel-Fellows
- https://www.businesswire.com/news/home/20260420984007/en/Thiel-Foundation-Announces-2026-Class-of-Thiel-Fellows
- https://x.com/thielfellowship/status/1925538154582269976
- https://pulse2.com/thiel-foundation-2026-thiel-fellowship-class-awarded-250000-grants-to-young-entrepreneurs/
- https://richnerds.substack.com/p/thiel-fellowship-2026-fellows
- https://catalaize.substack.com/p/meet-the-new-thiel-fellows
- https://insights.tryspecter.com/thiel-fellows-2026/
- https://www2.fundsforngos.org/innovation/applications-open-for-thiel-fellowship-for-young-innovators-and-entrepreneurs/
- https://hub.causo.ai/guides/how-to-apply-to-thiel-fellowship-2026
- https://fellows.best/opportunity/thiel-fellowship-2026
- https://www.for9a.com/en/opportunity/thiel-fellowship-2026
- https://www.unigo.com/scholarships/by-type/entrepreneurship-scholarships/thiel-fellowship
- https://theincubatorpro.com/programs/z-fellows/
- https://www.startupgrantsindia.com/z-fellows-2026-fellowship
- https://www.foundersprime.com/deals/z-fellows
- https://grantedai.com/grants/1517-fund-medici-grant-1517-fund-4ae92610
- https://grantcompass.co/grants/1517-fund-medici-grant
- https://1517.substack.com/p/a-drop-in-the-ocean
