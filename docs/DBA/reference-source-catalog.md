# FiceCal Thesis Reference Source Catalog

Last updated: 2026-02-25

This catalog consolidates the academic, standards-based, and reputed practitioner sources used to support the FiceCal research approach for internal DBA thesis work.

## How to use this catalog

- Use this file as the source-of-truth bibliography for Chapter 2 and methodology chapters.
- For stronger academic defensibility, pair industry/practitioner sources with peer-reviewed sources in each subsection.
- URLs are included for quick verification and citation audits.

## Source quality legend

- **Peer-reviewed**: Journal/conference or academically refereed.
- **Standards/Institutional**: NIST, OECD/JRC, JCGM, or public-sector institutional guidance.
- **Industry primary**: Vendor and practitioner framework references.

## Structured reference matrix

| ID | APA 7 reference | Source class | Why it matters for FiceCal |
|---|---|---|---|
| [1] | Harms, R., & Yamartino, M. (2010). *The economics of the cloud*. Microsoft Corporation. https://news.microsoft.com/download/archived/presskits/cloud/docs/The-Economics-of-the-Cloud.pdf | Industry primary | Foundational cloud-economics framing for scale, pooling, and multi-tenancy assumptions behind cost curves. |
| [2] | Bayrak, E., Conley, J. P., & Wilkie, S. (2011). The economics of cloud computing. *Korean Economic Review, 27*(2), 203-230. | Peer-reviewed | Supports fixed/variable and scale-behavior assumptions for nonlinear cloud cost modeling. |
| [3] | Bryant, J. (2022). Driving into the cloud: What is FinOps? *ITNOW, 64*(3), 54-55. https://doi.org/10.1093/combul/bwac097 | Peer-reviewed | FinOps discipline framing for KPI governance and business-technology alignment. |
| [4] | Nawrocki, P., & Smendowski, M. (2024). FinOps-driven optimization of cloud resource usage for HPC using machine learning. *Journal of Computational Science, 78*, 102269. https://doi.org/10.1016/j.jocs.2024.102269 | Peer-reviewed | Evidence that FinOps optimization and forecasting logic can be systematically operationalized. |
| [5] | Bourreau, M., de Streel, A., & Graef, I. (2024). *The economics of the cloud* (TSE Working Paper No. 1520). Toulouse School of Economics. https://www.tse-fr.eu/sites/default/files/TSE/documents/doc/wp/2024/wp_tse_1520.pdf | Academic working paper | Extends cloud-economics context to pricing structures, commitments, and egress economics. |
| [6] | FinOps Foundation. (2026). *State of FinOps report*. https://data.finops.org/ | Industry primary | Practitioner benchmark for FinOps maturity, KPI norms, and operating practices. |
| [7] | Google Cloud. (2024). *Resource-based committed use discounts*. https://cloud.google.com/compute/docs/instances/signing-up-committed-use-discounts | Industry primary | Primary source for CUD mechanics and discount factor assumptions. |
| [8] | U.S. General Services Administration, IT Vendor Management Office (ITVMO). (2023). *Cloud optimization through discounts and consolidated billing*. https://itvmo.gsa.gov/assets/files/FinOps-Optimization-Through-Discounts.pdf | Standards/Institutional | Cross-cloud benchmark source covering AWS, Azure, and GCP discount mechanisms. |
| [9] | Kaplan, R. S., & Anderson, S. R. (2004). Time-driven activity-based costing. *Harvard Business Review*. https://hbr.org/2004/11/time-driven-activity-based-costing | Practitioner-academic | Cost-allocation rationale for multi-domain normalization and pooled-cost interpretation. |
| [10] | Nardo, M., Saisana, M., Saltelli, A., Tarantola, S., Hoffman, A., & Giovannini, E. (2008). *Handbook on constructing composite indicators: Methodology and user guide*. OECD Publishing / European Commission Joint Research Centre. https://knowledge4policy.ec.europa.eu/sites/default/files/jrc47008_handbook_final.pdf | Standards/Institutional | Composite-indicator methodology used for confidence and completeness style scoring logic. |
| [11] | Mell, P., & Grance, T. (2011). *The NIST definition of cloud computing* (NIST Special Publication 800-145). National Institute of Standards and Technology. https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-145.pdf | Standards/Institutional | Canonical cloud definitions used for conceptual consistency in service-model references. |
| [12] | Beyer, B., Jones, C., Petoff, J., & Murphy, N. R. (Eds.). (2016). *Site reliability engineering: How Google runs production systems*. O'Reilly Media. https://sre.google/sre-book/table-of-contents/ | Industry primary (high authority) | Reliability economics grounding for SLI/SLO logic, error budgets, and downtime trade-offs. |
| [13] | Jones, C., Armel, J., Woog, N., et al. (2018). *The site reliability workbook*. O'Reilly Media. https://sre.google/workbook/table-of-contents/ | Industry primary (high authority) | Operational playbooks for implementing reliability controls tied to incident-cost assumptions. |
| [14] | Hyndman, R. J., & Athanasopoulos, G. (2021). *Forecasting: Principles and practice* (3rd ed.). OTexts. https://otexts.com/fpp3/ | Academic text | Forecasting foundations for baseline/best/worst scenario logic and interpretation. |
| [15] | Makridakis, S., Spiliotis, E., & Assimakopoulos, V. (2020). The M4 competition: 100,000 time series and 61 forecasting methods. *International Journal of Forecasting, 36*(1), 54-74. https://doi.org/10.1016/j.ijforecast.2019.04.014 | Peer-reviewed | Benchmark evidence for forecast model rigor and confidence interpretation discipline. |
| [16] | Amazon Web Services. (2024). *AWS Well-Architected Framework: Cost Optimization Pillar*. https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html | Industry primary | Reputed architecture guidance for cost optimization controls and governance. |
| [17] | Microsoft Azure. (2025). *Azure Well-Architected Framework: Cost optimization*. https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/ | Industry primary | Cross-provider triangulation for cloud cost governance patterns. |
| [18] | Joint Committee for Guides in Metrology (JCGM). (2008). *Evaluation of measurement data-Guide to the expression of uncertainty in measurement* (JCGM 100:2008). https://www.bipm.org/documents/20126/2071204/JCGM_100_2008_E.pdf | Standards/Institutional | Uncertainty communication basis for confidence-aware decision-support reporting. |

## Suggested citation pairing patterns (recommended)

1. **Cloud economics claims**: [1] + [2] + [5]
2. **FinOps governance claims**: [3] + [6] + [4]
3. **CUD/commitment claims**: [7] + [8] + [16] or [17]
4. **Reliability trade-off claims**: [12] + [13]
5. **Forecast confidence claims**: [14] + [15] + [18]
6. **Composite/normalization claims**: [9] + [10]

## Notes for internal thesis quality control

- Re-check each URL before final submission in case documentation pages move.
- Preserve DOI links where available for auditability.
- In final bibliography, apply one consistent style (APA 7) and punctuation standard across all entries.
