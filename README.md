# Interactive Insights Automation (Looker Studio + AI-assisted cleaning)

End-to-end automation that turns raw youth-survey exports and their insight reports into
interactive, web-embeddable **Google Looker Studio** dashboards. Data cleaning is
**AI-assisted** (Google Apps Script + Gemini) with human review, and every published figure is
cross-checked against the source report.

> Delivered during an industry project for a New Zealand youth-research organisation (client name
> withheld for confidentiality). All data shown here is illustrative/anonymised; no personal or
> client data is included.

---

## Problem

The organisation published its research as long PDF reports that most website visitors never read.
They needed a faster, more visual way to explore findings on the website, and a **repeatable**
process that could be reused for every future survey without rebuilding the site each time.

## Objective

- Convert each report + survey dataset into a short, interactive dashboard.
- Make it reusable across many surveys (one build, driven by a challenge selector).
- Keep every number traceable to the approved data and matching the formal report.
- Protect participant privacy (young respondents).

---

## What I built

**1. AI-assisted data-cleaning automation (Google Apps Script + Gemini)**
- Reads a raw survey export and cleans it into two modelled tables: one row per person, and one
  row per selected answer (for multi-select questions).
- **Gemini AI proposes** how messy free-text gender and ethnicity values map to standard
  categories; a **human reviews and approves** the mappings before they are applied (AI speed +
  human accuracy).
- Drafts headline findings, sentiment and participant quotes, all reviewed before publishing.

**2. Data modelling**
- Gender normalised with whole-word matching (handles "woman", "she/her", "boy", typos, etc.).
- Ethnicity handled as **multi-select** to match how the reports count it (a person can appear in
  more than one group), with a per-report option for single-select where the report requires it.
- Age derived from date of birth and bucketed into consistent age bands.

**3. Interactive dashboard (Google Looker Studio)**
- Participation (totals, gender, age, ethnicity), headline findings, and voices pages.
- A **challenge/survey dropdown** so one dashboard serves every survey.
- Embedded on the website with a **responsive iframe** (works on desktop and mobile).

**4. Quality & privacy**
- Every displayed figure cross-checked against the official report.
- Quotes shown with **anonymous age-group + gender only** (no names, emails, or postcodes).
- Personal columns stripped from all raw data before use.

---

## Tech stack

| Area | Tools |
|---|---|
| Automation / scripting | Google Apps Script, Gemini API (AI-assisted cleaning) |
| Data cleaning & modelling | Excel **Power Query**, Google Sheets |
| Sentiment (fallback) | Python (**TextBlob**) |
| Visualisation | **Google Looker Studio** (interactive dashboards + embed) |
| Delivery | Responsive HTML iframe embed |

---

## Process (repeatable workflow)

1. **Clean** the raw export (approved records only; normalise gender/ethnicity; split multi-select answers).
2. **Suggest mappings (AI)** -> review and approve gender/ethnicity groupings.
3. **Process** -> write cleaned tables, draft findings, sentiment and quotes.
4. **Verify** every number against the report.
5. **Publish** and embed the dashboard on the website.

Because the dashboard is built once and reused via the dropdown, adding a new survey is a short,
repeatable task rather than a rebuild.

---

## Selected outcomes (illustrative)

- Multiple surveys converted into interactive dashboards using the same reusable pipeline.
- Participation, gender and ethnicity figures matched the source reports on cross-check.
- Fully anonymised, privacy-safe presentation of youth voices.

*(Exact figures and the live dashboard are omitted here for confidentiality.)*

---

## Skills demonstrated

- AI-assisted data cleaning with human-in-the-loop review
- Data cleaning, modelling and ETL (Power Query)
- Interactive BI dashboard design and embedding (Looker Studio)
- Data accuracy / validation against a source of truth
- Data ethics & privacy (anonymisation, minimum group sizes, no PII)
- Stakeholder communication and repeatable documentation

---

## Notes on confidentiality

This case study describes the **approach, tooling and my contribution** only. It intentionally
excludes the client's name, the live dashboard, real figures, participant quotes, and any personal
data. Screenshots (if added) use mock or redacted content.
