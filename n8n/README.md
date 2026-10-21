# Wellbayt Opportunity Radar: n8n Automation Component

This folder contains a complete, functional n8n workflow that automates the Opportunity Radar outbound engine and inbound reply triage described in the Wellbayt AI Growth Challenge.

A reviewer can import and execute this workflow with zero software licenses, zero subscriptions, and zero operating cost ($0).

---

## What This Workflow Does

The workflow combines two connected automation pipelines in a single file (`wellbayt-radar.workflow.json`):

1. **Weekly Opportunity Radar (Outbound Discovery & Preparation)**
   - **Detect**: Queries five targeted Google News RSS feeds configured specifically for UAE corporate expansion, HR leadership appointments, workplace awards, wellbeing commitments, and large-scale hiring waves.
   - **Clean & Filter**: Drops consumer noise (clinics, nurseries, schools, real estate listings, visas) and verifies UAE geographic context.
   - **Entity Extraction**: Uses regex extraction rules to identify clean company names.
   - **Urgency Scoring**: Scores leads using signal weight multiplied by publication freshness, with bonuses for multi-signal companies.
   - **AI Opener Generation**: Calls Google Gemini (model `gemini-3.5-flash-lite`) to craft a concise, 35-word UAE-tailored conversation opener referencing the verified headline. Configured with a 4,200 ms batch spacing interval and automated retries to respect the free-tier 15 RPM rate limit. If no Gemini API key is configured or the service is unreachable, it automatically falls back to deterministic template openers.
   - **CRM Delivery**: Exports the enriched leads into a standardised CSV file ready for outreach, with an optional Google Sheets connector node.

2. **Inbound Reply Assistant (Triage & Draft Assistant)**
   - **Webhook Listener**: Accepts inbound prospect responses at `POST /webhook/wellbayt-reply`.
   - **Intent Classification**: Evaluates response intent (`interested`, `not_now`, `not_interested`, `question`, `out_of_office`) via Gemini AI with an explicit Wellbayt fact sheet (human-led onsite and virtual wellbeing sessions, corporate activations, employer dashboard for HR leaders, and employee wellbeing app; strictly zero gym discounts, counselling/therapy, brochures, or unverified pricing).
   - **Safety Flagging & Next Step**: Evaluates whether human verification is required, setting `needs_human_check: true` whenever the inquiry touches prices, custom scope, or unlisted services. Assigns the CRM status and drafts a concise, factual reply under 45 words in British English for human review before anything is sent. Includes a rule-based regex fallback if AI classification is unavailable.

Operational safety rule: The system generates drafts only. A human reviews every communication before it reaches a prospect.

---

## Quick Start

### 1. Launch n8n Locally

Choose either method below:

#### Option A: Using npx (Fastest, requires Node.js 18+)
Open your terminal (PowerShell or Bash) and run:
```bash
npx n8n
```

#### Option B: Using Docker
Run n8n in a lightweight container:
```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

Once started, open your browser to:
```
http://localhost:5678
```

---

## Import Steps

1. In the n8n interface, open the left navigation menu and click **Workflows**.
2. Click the three dots menu (top right) or select **Import from File**.
3. Choose the file: `n8n/wellbayt-radar.workflow.json`.
4. The workflow will appear on the canvas with neat color-coded sticky notes for each stage:
   - Detect (Yellow)
   - Clean & Score (Cyan)
   - Prepare (Green)
   - CRM (Red)
   - Reply Management (Orange)
   - Guardrails (Grey)
5. Click **Save** in the top right.
6. To run the radar immediately, click **Test workflow** or click the **Run Now (Manual Trigger)** node and press **Execute Node**.

---

## Your Key, Your Computer

The AI opener step is completely optional. You can test and inspect the entire radar without configuring any credentials:

- **No key? No problem:** Leave it out and just click **Run now** (or execute from the manual trigger node). The workflow uses clear template openers from `radar.py`, which are enough to see exactly how the system works.
- **Optional own key:** Add your own free Gemini API key to see AI-written openers. The key stays on your computer (an environment variable). It is never stored in the workflow file, never sent to me, and nothing here is tracked.
- **Where data goes:** The workflow only contacts Google News (public headlines) and, if you add a key, Google's Gemini API (the headline text, to write the opener). Nothing is sent to anyone else.

---

## Configuring the Google Gemini API Key (Optional)

The workflow includes an AI opener node powered by Google Gemini (default model: `gemini-3.5-flash-lite`, selected for its high speed, stability, and zero-cost free tier).

### How to add your key:
1. Get a free API key at [Google AI Studio](https://aistudio.google.com/).
2. Before launching n8n, set the environment variable:
   - **PowerShell**: `$env:GEMINI_API_KEY="AIzaSy..."`
   - **Bash/macOS/Linux**: `export GEMINI_API_KEY="AIzaSy..."`
3. Alternatively, double-click the **Generate AI Opener (Gemini)** node in n8n and append your key directly to the URL parameter:
   `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=YOUR_API_KEY`

### Automatic Fallback (Zero Setup Required):
If the API key is not provided or the request fails, the workflow continues uninterrupted. The subsequent node detects the missing AI response and immediately applies the vetted template opener from `radar.py`. The field `opener_source` is set to `template`.

---

> **Required for the AI step:** n8n 2.x blocks `$env` in nodes by default. Start n8n with `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`, for example `docker run -it --rm -p 5678:5678 -e N8N_BLOCK_ENV_ACCESS_IN_NODE=false -e GEMINI_API_KEY=your_key n8nio/n8n`. Docker is the most reliable way to run it; `npx n8n` can fail on very new Node versions. Without a key the workflow still completes using template openers.

## Testing the Reply Webhook

The second part of the workflow processes prospect replies via an HTTP POST webhook.

In n8n, activate the workflow (toggle top right to **Active**), or click the **Webhook (POST /wellbayt-reply)** node and click **Listen for test event**.

### Scenario 1: Prospect Expresses Interest
The lead asks for pricing and a meeting.
- **Expected classification**: `interested`
- **CRM status**: `Qualified - Meeting Requested` (or `Marketing Qualified Lead`)

**Bash (curl):**
```bash
curl -X POST http://localhost:5678/webhook/wellbayt-reply \
  -H "Content-Type: application/json" \
  -d '{"company": "Advent", "reply_text": "Interested, send me your brochure and pricing"}'
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5678/webhook/wellbayt-reply" -Method Post -ContentType "application/json" -Body '{"company": "Advent", "reply_text": "Interested, send me your brochure and pricing"}' | ConvertTo-Json
```

### Scenario 2: Timing Is Not Right
The lead requests a follow-up in a future quarter.
- **Expected classification**: `not_now`
- **CRM status**: `Nurture - Follow up next quarter` (or `Follow-up Q3`)

**Bash (curl):**
```bash
curl -X POST http://localhost:5678/webhook/wellbayt-reply \
  -H "Content-Type: application/json" \
  -d '{"company": "EQT", "reply_text": "Not now, check back in Q3 when our budget resets"}'
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5678/webhook/wellbayt-reply" -Method Post -ContentType "application/json" -Body '{"company": "EQT", "reply_text": "Not now, check back in Q3 when our budget resets"}' | ConvertTo-Json
```

### Scenario 3: Question Regarding Service Offering
The lead asks for specific clarification on offerings.
- **Expected classification**: `question`
- **CRM status**: `Active Conversation - Information Requested` (or `Lead - Responded`)

**Bash (curl):**
```bash
curl -X POST http://localhost:5678/webhook/wellbayt-reply \
  -H "Content-Type: application/json" \
  -d '{"company": "Workday", "reply_text": "Do you provide mental health workshops or just gym discounts?"}'
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5678/webhook/wellbayt-reply" -Method Post -ContentType "application/json" -Body '{"company": "Workday", "reply_text": "Do you provide mental health workshops or just gym discounts?"}' | ConvertTo-Json
```

---

## Operating Cost Breakdown ($0 / month)

Running this automation costs **$0.00 per month**:

| Component | Provider / Tier | Cost | Note |
|:---|:---|:---|:---|
| Workflow Runtime | n8n Community Edition | $0.00 | Free, open self-hosted automation platform |
| Signal Ingestion | Google News RSS | $0.00 | Public syndication feeds, no scraping or API subscriptions |
| AI Generation | Google Gemini 3.5 Flash Lite | $0.00 | Free tier includes 15 requests/min and 1M tokens/min |
| CRM / Storage | Local CSV & Google Sheets | $0.00 | Free built-in file export and standard Google workspace account |
| **Total Monthly Cost** | | **$0.00** | Completely free to pilot and operate |

For a weekly run producing 10 to 15 qualified leads, Gemini consumes approximately 1,200 tokens per week. That represents less than 0.05% of Google's free monthly allocation.

---

## Weekly Maintenance Routine (5 Minutes per Week)

To maintain top data quality with minimal effort, follow this 5-minute weekly checklist:

1. **Review Output Leads (2 minutes)**: Open the generated CSV (`wellbayt-radar-leads.csv`) or Google Sheet. Scan company names and scores to ensure the top 5 to 10 targets are genuine corporate accounts.
2. **Review Openers (1 minute)**: Read through the drafted openers to ensure phrasing sounds natural and adheres to Wellbayt brand standards.
3. **Update Filter Rules if Needed (1 minute)**: If an irrelevant organisation slips through (e.g., a regional sporting tournament or non-corporate entity), open the **Clean, Extract & Score Leads** node and append the keyword to the `NOISE` regex.
4. **Inspect Inbound Classifications (1 minute)**: Check the webhook triage log for unclassified replies to refine intent keywords over time.

---

## Honest Operational Limits

To ensure realistic expectations, here is what this automation can and cannot do:

### What it does well:
- Monitors targeted buying signals across the UAE 24/7 without manual research.
- Scores leads objectively using decay formulas based on real news recency.
- Drafts credible, non-generic first-touch messages that reference verified news items.
- Sorts inbound replies into clear operational buckets so hot leads are never missed.

### What it cannot do:
- **Email discovery**: It identifies the target company and role (e.g., Head of HR, Chief People Officer), but does not guess email addresses without an enrichment database.
- **Company internal politics**: It detects external signals (expansions, awards), but cannot assess internal budget freezes or restructuring not covered in the press.
- **Inbox deliverability**: Outbound messages must be sent from a properly warmed domain with SPF, DKIM, and DMARC configured.

---

## Production Upgrade Path

When Wellbayt is ready to scale beyond this zero-cost pilot:

1. **Hosted 24/7 Runtime**:
   Deploy n8n to a $5/month cloud VPS (such as Hetzner or DigitalOcean) via Docker Compose, or subscribe to n8n Cloud for managed hosting with automatic SSL and webhooks.

2. **Automated Contact Enrichment**:
   Insert an **Apollo.io** or **Hunter.io** API node directly after scoring. The workflow takes `company` and searches for contacts with titles matching `Head of HR`, `VP People`, or `Employee Experience Director` located in the United Arab Emirates, returning verified email addresses and LinkedIn URLs.

3. **Direct CRM Integration**:
   Replace or augment the CSV node with native n8n integrations for **HubSpot**, **Pipedrive**, or **Salesforce**. Automatically create company records, deal stages, and reminder tasks for the sales team.

4. **Two-Way Email Sync**:
   Connect Gmail or Microsoft 365 to listen directly for replies to sent campaigns, automatically routing positive responses into the reply webhook without manual copy-pasting.
