"""Wellbayt Opportunity Radar.

Watches free public news feeds for buying signals at UAE/GCC companies, scores
them, and writes a ready-to-review outreach queue (leads.csv + report.html).
Cost to run: $0 (Google News RSS, stdlib only, no LLM calls).
Usage: python radar.py [--days 45] [--top 12]
"""
import argparse, csv, html, os, re, sys, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

# signal -> (weight, news query, why it matters)
SIGNALS = {
    "new_hr_leader": (5, '("appointed" OR "joins as" OR "named") ("Head of HR" OR "Chief People Officer" OR "HR Director" OR "Head of People") (UAE OR Dubai OR "Abu Dhabi")',
        "New HR leaders set priorities and budgets in their first 90 days."),
    "expansion": (4, '("opens" OR "launches" OR "inaugurates") ("regional headquarters" OR "new office" OR "Dubai hub" OR "new campus") (UAE OR Dubai OR "Abu Dhabi")',
        "A new or growing office means new hires, onboarding and culture-building needs."),
    "workplace_award": (3, '("Great Place to Work" OR "Best Workplaces" OR "Top Employer") (UAE OR Dubai OR "Abu Dhabi" OR "Middle East")',
        "Employers proud of culture are buyers of programmes that reinforce it."),
    "wellbeing_push": (3, '("employee wellbeing" OR "mental health" OR "wellness programme") (launches OR introduces OR partners) (UAE OR Dubai OR "Abu Dhabi") company',
        "A public wellbeing commitment signals budget and executive backing."),
    "hiring_surge": (3, '("hiring" OR "to recruit" OR "create jobs") ("1,000" OR "500" OR "2,000" OR "thousands") (UAE OR Dubai OR "Abu Dhabi" OR "Saudi")',
        "Large hiring waves strain retention and onboarding, which wellbeing programmes support."),
}

SIGNAL_TEMPLATES = {
    "new_hr_leader": [
        "Congratulations on the new HR leadership appointment at {company}. The first 90 days are when wellbeing priorities get set. Would a 15-minute chat on what peer UAE employers do for movement programmes be useful?",
        "With new HR leadership taking the helm at {company}, shaping team culture is top of mind. We design human-led wellbeing sessions across the UAE. Could I share two practical ideas for your team?",
        "Stepping into an HR leadership role at {company} sets the tone for workforce wellbeing. We help UAE organisations launch high-participation activations. Worth a short intro call to compare notes?",
        "Welcome to the new People leadership team at {company}. Early tenure is an ideal window to introduce fresh health initiatives. Open to a brief 15-minute introductory conversation this week?"
    ],
    "expansion": [
        "Saw {company}'s expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
        "Congratulations on {company}'s new UAE office milestone. Welcoming new hires to a fresh workspace is the ideal moment to establish movement habits. Could I share two ideas that fit your team?",
        "Establishing a new UAE base for {company} creates an exciting culture-building window for incoming staff. We deliver human-led onsite team activations. Would a brief 15-minute conversation be timely?",
        "Following the launch of {company}'s new regional office, onboarding a growing workforce demands sustained team engagement. We organise turnkey corporate movement challenges. Worth a short chat to explore fit?"
    ],
    "workplace_award": [
        "Congratulations to {company} on the workplace recognition. Teams that earn it often want an engaging wellbeing programme to keep the momentum going. Could I share two ideas that fit your culture?",
        "Earning top employer recognition highlights {company}'s clear culture commitment. We help UAE organisations sustain employee energy with human-led activations. Would a brief 15-minute intro call be welcome?",
        "Celebrating {company}'s recent workplace culture award is a great milestone. Maintaining high engagement takes deliberate wellbeing moments. Open to a quick conversation on our onsite sessions?",
        "Recognised workplace cultures like {company}'s set high standards for employee experience. We build movement and wellness programmes that staff genuinely join. Worth a short intro chat?"
    ],
    "wellbeing_push": [
        "I noticed {company}'s recent wellbeing announcement. Many HR teams struggle to turn commitments into sessions staff actually attend. We design onsite and movement challenges that lift participation. Worth a short conversation?",
        "Committing publicly to employee wellbeing at {company} sets a great standard. Turning strategy into high participation is where we assist UAE employers. Could I share two ideas that fit your roadmap?",
        "Seeing {company}'s active wellbeing initiative is fantastic for the local workforce. We deliver human-led activations and challenges with zero operational friction. Would a brief 15-minute call be timely?",
        "With employee health now a priority at {company}, keeping staff actively engaged is the next step. We design tailored onsite workshops across the UAE. Open to a quick intro chat?"
    ],
    "hiring_surge": [
        "With {company} scaling the team so quickly, keeping new and existing staff engaged becomes the key HR challenge. We help with onsite activations and challenges that build belonging fast. Open to a brief intro?",
        "Rapid headcount growth at {company} puts team cohesion and onboarding to the test. We run turnkey movement challenges that connect colleagues quickly. Could I share two practical ideas?",
        "Scaling up hiring at {company} brings vital energy but also onboarding strain. We deliver human-led wellbeing sessions that help new joiners integrate comfortably. Would a brief 15-minute call be helpful?",
        "Welcoming large cohorts of new staff to {company} requires shared culture moments from day one. We design onsite corporate activations across the UAE. Worth a short conversation?"
    ]
}

def opener_for(company, signal):
    variants = SIGNAL_TEMPLATES.get(signal, SIGNAL_TEMPLATES["expansion"])
    idx = sum(ord(c) for c in company) % len(variants)
    return variants[idx].format(company=company)

NOISE = re.compile(r"\b(review|school|nursery|university|hospital|clinic|real estate agent|holiday|visa|tourism)\b", re.I)
LEAD = re.compile(r"^(?P<c>[A-Z][\w&.\-' ]{1,40}?)\s+(?:opens|launches|inaugurates|unveils|announces|signs|expands|wins|named|ranked|recognised|certified|partners|appoints|to hire|to recruit|plans|introduces)\b")
AT = re.compile(r"\b(?:at|joins)\s+(?P<c>[A-Z][\w&.\-' ]{1,40}?)(?:\s+[-\u2013\u2014|]|$|\s+as\b|,)")
BAD = {
    "Ghana", "Sharjah", "Apple", "The", "A", "An", "Dubai", "UAE", "Abu Dhabi",
    "How", "Why", "What", "New", "Top", "Best", "DIFC", "Dubai CommerCity",
    "CommerCity", "ADGM", "DMCC", "Gulf", "Middle East", "MENA", "GCC"
}
GENERIC = re.compile(r"\b(people|culture|human resources|hr|great place|expo|forum|summit|awards?|ministry)\b", re.I)
GEO = re.compile(r"\b(UAE|Dubai|Abu Dhabi|Sharjah|Emirates|Emirati|Gulf|GCC|Middle East|MENA)\b", re.I)


def clean_display_name(name):
    s = re.sub(r"\s+(?:Dubai office|Abu Dhabi office|regional headquarters|headquarters|HQ|Dubai hub|regional hub|office|offices|hub|hubs|Group|Middle East)\b", "", name, flags=re.I)
    s = re.sub(r"^[ .,'\-]+|[ .,'\-]+$", "", s).strip()
    return s if len(s) >= 2 else name


def normalize_key(name):
    s = name.lower()
    s = re.sub(r"\b(office|offices|hub|hubs|group|headquarters|hq|regional|campus|branch|branches|international|platform|platforms|middle east|uae|dubai|abu dhabi)\b", "", s, flags=re.I)
    s = re.sub(r"^[ .,'\-]+|[ .,'\-]+$", "", s).strip()
    s = re.sub(r"\s+", " ", s)
    return s


def fetch(query, days):
    q = urllib.parse.quote(f"{query} when:{days}d")
    url = f"https://news.google.com/rss/search?q={q}&hl=en-AE&gl=AE&ceid=AE:en"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return ET.fromstring(urllib.request.urlopen(req, timeout=25).read())


def company_of(title, hr_role=False):
    title = re.sub(r"\s+[-–|]\s+[^-–|]+$", "", title).strip()  # drop trailing publisher
    # HR-appointment headlines name a person first, so only trust "... at <Company>"
    cands = [m.group('c') for m in AT.finditer(title)] if hr_role else [m.group("c") for rx in (LEAD, AT) for m in [rx.search(title)] if m]
    for c in reversed(cands) if hr_role else cands:
        c = c.strip(" .,'")
        if c and c not in BAD and len(c.split()) <= 5 and not GENERIC.search(c):
            return c
    return None


def run(days, top):
    found = {}
    now = datetime.now(timezone.utc)
    for name, (weight, query, why) in SIGNALS.items():
        try:
            items = fetch(query, days).iter("item")
        except Exception as e:
            print(f"[warn] {name}: {e}", file=sys.stderr)
            continue
        for it in items:
            title = html.unescape(it.findtext("title", ""))
            if NOISE.search(title) or not GEO.search(title):
                continue
            c = company_of(title, name == "new_hr_leader")
            if not c:
                continue

            disp = clean_display_name(c)
            norm = normalize_key(disp)
            if not norm or norm in {b.lower() for b in BAD} or c in BAD or disp in BAD:
                continue

            age = max((now - parsedate_to_datetime(it.findtext("pubDate", ""))).days, 0)
            score = weight * (1.0 - min(age, days) / (days * 1.5))  # fresher = higher

            if norm not in found:
                found[norm] = {"company": disp, "score": 0.0, "signals": set(), "evidence": []}
            else:
                if len(disp) < len(found[norm]["company"]):
                    found[norm]["company"] = disp

            found[norm]["score"] += score
            found[norm]["signals"].add(name)
            found[norm]["evidence"].append((age, title, it.findtext("link", ""), name))

    leads = sorted(found.values(), key=lambda l: -(l["score"] + 1.5 * (len(l["signals"]) - 1)))[:top]
    for l in leads:
        age, title, link, sig = min(l["evidence"], key=lambda e: e[0])
        l.update(best_signal=sig, why=SIGNALS[sig][2], headline=title, link=link, age=age,
                 roles="Head of HR / People & Culture / Employee Experience",
                 opener=opener_for(l["company"], sig), score=round(l["score"], 2),
                 signals=", ".join(sorted(l["signals"])))
    return leads


def write(leads):
    cols = ["company", "score", "signals", "age", "headline", "why", "roles", "opener", "link"]
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "leads.csv")
    html_path = os.path.join(base_dir, "report.html")
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(leads)
    rows = "".join(
        f"<tr><td><b>{html.escape(l['company'])}</b><br><small>score {l['score']} · {l['age']}d ago</small></td>"
        f"<td>{html.escape(l['signals'])}</td>"
        f"<td><a href='{html.escape(l['link'])}'>{html.escape(l['headline'])}</a><br><small>{html.escape(l['why'])}</small></td>"
        f"<td>{html.escape(l['opener'])}</td></tr>" for l in leads)
    page = ("<meta charset=utf-8><title>Wellbayt Opportunity Radar</title><style>body{font:14px system-ui;margin:2rem;color:#1a2b2a}"
            "table{border-collapse:collapse}td,th{border-bottom:1px solid #d6e2e0;padding:.6rem;vertical-align:top;text-align:left}"
            "th{background:#e8f3f1}small{color:#587}</style>"
            f"<h1>Opportunity Radar</h1><p>{datetime.now():%d %b %Y}. {len(leads)} ranked companies. Review, then approve for outreach.</p>"
            f"<table><tr><th>Company</th><th>Signals</th><th>Evidence</th><th>Draft opener</th></tr>{rows}</table>")
    open(html_path, "w", encoding="utf-8").write(page)


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=45)
    ap.add_argument("--top", type=int, default=12)
    a = ap.parse_args()
    ls = run(a.days, a.top)
    write(ls)
    for l in ls:
        print(f"{l['score']:5.2f}  {l['company']:<32} {l['signals']:<28} {l['age']}d  {l['headline'][:70]}")
    print(f"\n{len(ls)} leads -> leads.csv, report.html")
    sys.exit(0 if len(ls) > 0 else 1)
