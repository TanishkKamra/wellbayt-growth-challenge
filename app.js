/**
 * Wellbayt AI Growth Challenge - Interactive Application
 * Built for Tanishk Kamra's response to Alvaro & Wellbayt
 */

(function () {
  'use strict';

  // Real verified leads output from live radar run (exact match with leads.csv)
  const EMBEDDED_LEADS = [
    {
      "company": "Advent",
      "score": 12.0,
      "signals": ["expansion"],
      "age": 0,
      "headline": "Advent opens an office in Abu Dhabi International - صوت الإمارات",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Advent's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMivwFBVV95cUxPMGZ5a2pMRU9uQnJlWDJ2Z1JCdHNVYmtabUlRY1hkb09ySXNGS3lEZ1Y1eU94ZUpMeHJUYVFYZWZzb3I2S3ZrV1BBWVEwVmVoaG5QV2lVODY5SVVqX1p0Vm9jSm5aazhtbWptYUNQY0NuYUpvY0kyMmpzMmlDMUkyTmd6MGZQZmlERjd1alkwMVRiNDdDV280TGZiVkgyWVVTM1JWVk1SRC13cGpRRndBUTdhZDJQUFFFMTl2MDFZQQ?oc=5",
      "breakdown": {
        "freshness": "1.00 (0d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (1.00) across 3 regional reporting mentions"
      }
    },
    {
      "company": "Workday Dubai office",
      "score": 7.78,
      "signals": ["expansion", "hiring_surge", "wellbeing_push"],
      "age": 20,
      "headline": "Workday Dubai office opens as UAE employees use AI weekly - Tbreak UAE",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Workday Dubai office's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMiYkFVX3lxTE9WTGczc0h6a0tsbmtBTEFLT2hBeXNBYmJRUHJLa1dxZnE0U21MNzV2VUItdHF2VjAtOXgxZG1KWktzZ3ZrQlRSTmo1REhnc0M4QWpROTlkWEdEMU5XNE9haTVB?oc=5",
      "breakdown": {
        "freshness": "0.70 (20d old)",
        "triggersCount": 3,
        "details": "Weight multiplied by freshness factor (0.70) for 20d age with +1.5 multi-signal bonus"
      }
    },
    {
      "company": "EQT",
      "score": 5.51,
      "signals": ["expansion"],
      "age": 28,
      "headline": "EQT launches Middle East platform with new Abu Dhabi office - Private Equity Wire",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw EQT's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMinAFBVV95cUxPOVBYR1JEeDJicHgxZFJsLXRTclpKZmcxLTBwdWdERHYzYmU4TGppaHp6SnBaUHY0ck1WR0dYYk04OUZ4TTVLWTRnNUlGYzFseXRXY21zQmJuSTh5Rmpjdkc2ZE92N2JSZGJvNU5NNXRWT1F2MlZTci1ZQUtSbXMyRjVsZ2JrZ09BbTY0MWs2RktfSXhOTllhT2UwSTA?oc=5",
      "breakdown": {
        "freshness": "0.59 (28d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.59) for 28d age"
      }
    },
    {
      "company": "Sullivan & Cromwell",
      "score": 4.76,
      "signals": ["expansion"],
      "age": 36,
      "headline": "Sullivan & Cromwell opens first Middle East office in Abu Dhabi - The Global Legal Post",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Sullivan & Cromwell's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMirgFBVV95cUxOZGJUYnQ1eFRkekhuR3FqZTRuLS1nMVR6VVlQYVRIUG55cjZuOWJtbW1BNmI3ZWNjby03NjkwU1IzWXhZTVZDUEdmbnRZOWw4VUhnNFd4YlZId3p0T09BbXpqaE9IcnVER0poN1VMcWxqYkRJMHhENFNwNmVuWU9ROTlEbi1pUkYtZGcxQ3FWVF9vMmhzRFhJeGRGcktlc2Z3U1NSNWxCYVlLQkJFTmc?oc=5",
      "breakdown": {
        "freshness": "0.47 (36d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.47) for 36d age"
      }
    },
    {
      "company": "Keolis",
      "score": 3.73,
      "signals": ["expansion"],
      "age": 6,
      "headline": "Keolis opens regional HQ in Dubai for Middle East growth - Keolis",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Keolis's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMioAFBVV95cUxQX0JjbGM3WExmOEZlTUxoc0JQT29oVy1PYS03TG94dlFGTzVJN25rZ2ZnVmk4OGd5YncyLTI1T1FRLVI4SkxOQVhFa2JKcFVOa01ZWHlrNURiTGpoeGJhak1FNWhiMGVDQmRES0lTTzg4Mi03cFd4ZHUtMzJSQllhTVFQaUZXUFdsT3ZITnhiSGR5VzBLSGFlLS05VlY5QjhV?oc=5",
      "breakdown": {
        "freshness": "0.91 (6d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.91) for 6d age"
      }
    },
    {
      "company": "Rhenus",
      "score": 3.73,
      "signals": ["expansion"],
      "age": 6,
      "headline": "Rhenus opens humanitarian logistics office in Dubai - Container News",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Rhenus's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMihgFBVV95cUxPWUg4MjNhaUNDTTN0WlQ5N1R6aHl2NUsxbTQtTEhKSm53OExxUmp2aG05YlhoQko4dTQ0NmZzTmN3bkFZVlA2LWkyVG80cUZlRXhtakRQdjFtRjE4ejRhOG41YW9YTDZHc2h3LVc2U05NTVFXY21vWmxIT0NtSUQ2dFVXemNEdw?oc=5",
      "breakdown": {
        "freshness": "0.91 (6d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.91) for 6d age"
      }
    },
    {
      "company": "Workday",
      "score": 3.16,
      "signals": ["expansion"],
      "age": 19,
      "headline": "Workday launches UAE operations with Dubai hub - Africa Business Communities",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Workday's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMingFBVV95cUxQRFItYS1ZOWpJUmpXT2E0eThuY0pHc3lXeEdzMGpYcVUzaE1kWjlNSUNmaTBHTS1iT2VJLUw5UEpwSk9XVFdDb0pad1l6cENHYkZYcG5DVHNvU3pHNGp2M0NzVl9xT05iLUlkVWN1MC10eFRyUkJpXzR5MXgxMGtaamlRT21lTHFvZi1vbGhxVm5oZWE5LTl6VEhvamE4Zw?oc=5",
      "breakdown": {
        "freshness": "0.72 (19d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.72) for 19d age"
      }
    },
    {
      "company": "China Securities",
      "score": 2.98,
      "signals": ["expansion"],
      "age": 23,
      "headline": "China Securities opens Dubai office to connect Chinese and Middle East investors - Gulf News",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw China Securities's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMiygFBVV95cUxQeDVxcTBWUWtGTGtIcmFybG5LdVlXS0V2c01fS2JPSjFGZHVudUZYSTF5OHRkcTdDUndpT19pS2VLdm02Mkl1azVPTUFNOUVFdHhvMzZXN2tJUS1GN3dzR2VaNktBdmNFNkFGeld5dGR6VXU4U29CWHlCM19VZ2FmenFGeXZMb2RTbXplVWxVbE1MaWpMWTVUbTRQVzZickhKUXExUGtBTzlrS3JmWjQ5LUtBMklyTEFEVzRyYmlweDlKRUh4U2wtZGNR?oc=5",
      "breakdown": {
        "freshness": "0.66 (23d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.66) for 23d age"
      }
    },
    {
      "company": "Dior",
      "score": 2.67,
      "signals": ["expansion"],
      "age": 30,
      "headline": "Dior opens 7,200 sqm Dubai South hub for Middle East distribution and UAE e-commerce - Gulf News",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Dior's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMiuAFBVV95cUxOLXpMRlM2djF1NkdiYi1LcWdsTUZDZVVGSDNIdS1tRmdnOEdTUFc1eXNmdnZTQWxKSS0yZTFSNzhkQTgtQjBKMDFzZmFqSWNIazBsamdPYU93azk3RVpvdDRwWE9YdkhmUmVKMHlXV1lmTzBSWjVaNHV6M3FxQmNKVGUtMnc0SzRScnhxeEptWERiZzRhUkM3bnhQNWUyclVTdVRJNFNHTjJEbTNnajdnbmFwclJPbGR1?oc=5",
      "breakdown": {
        "freshness": "0.56 (30d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.56) for 30d age"
      }
    },
    {
      "company": "Richardson Lissack",
      "score": 2.49,
      "signals": ["expansion"],
      "age": 34,
      "headline": "Richardson Lissack opens new Dubai office - Solicitors Journal",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Richardson Lissack's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMioAFBVV95cUxPUTFNMXNTbGRaaWh2M0lHbklzV0RBTktINDJHcFU4dWZPUmxZclRNd1h0aG5KWnBIb1BoQzEzUmZIc29HbTZ0UjBzdzFqWnV1em9LUTh3MnBXVXpKRUtxcHF2eTFsUm1VYzF5N2JHNFVmNkVqZFljc1pZcmV2R2lEcl9tWFFnZjJHQ2FBUkktQkpMclRVQi1UQ1hRTUxEVUR3?oc=5",
      "breakdown": {
        "freshness": "0.50 (34d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.50) for 34d age"
      }
    },
    {
      "company": "Mantle8",
      "score": 2.13,
      "signals": ["expansion"],
      "age": 42,
      "headline": "Mantle8 opens Dubai headquarters to drive Middle East hydrogen push - Utilities Middle East",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Mantle8's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMidEFVX3lxTFB5dERBQ3dJVE1UUjg0b0RaOENfZmlmWDNxeHFwb1BxNDNMcmJ4MHZuZzNFdFNpWnBkUzJRd2hkQ2dtQjZBaXhabmpwa1lOQnZUMG80LTVqa1Q0dnE3dkduSTlla1B4TllXM0UwYVg1MTBCY19V?oc=5",
      "breakdown": {
        "freshness": "0.38 (42d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.38) for 42d age"
      }
    },
    {
      "company": "Carmignac",
      "score": 1.87,
      "signals": ["expansion"],
      "age": 48,
      "headline": "Carmignac opens Dubai office - DIFC",
      "why": "A new or growing office means new hires, onboarding and culture-building needs.",
      "roles": "Head of HR / People & Culture / Employee Experience",
      "opener": "Saw Carmignac's expansion in the UAE. New offices usually need an early culture and wellbeing moment for the team settling in. We run onsite activations for exactly that stage. Open to a quick intro call?",
      "link": "https://news.google.com/rss/articles/CBMicEFVX3lxTE4wVG5mTDZnWW8xUVEzdjVQb1JMME12SEgtbTI3eGxGbFAxMDhXMm4yLVM3WnZ5Tlh1SjBCQ1dya0E4U2R6b05NSFpFWUJ3TFZ5S0NXZVlDcndhRDJrOFJUbzlvSFFLTEZqQk05di1zZVY?oc=5",
      "breakdown": {
        "freshness": "0.29 (48d old)",
        "triggersCount": 1,
        "details": "Weight 4 multiplied by freshness factor (0.29) for 48d age"
      }
    }
  ];

  let leads = EMBEDDED_LEADS;
  let activeFilter = 'all';

  // --- Theme Management ---
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let fallbackTimer = null;
  let activeViewTransition = null;

  function initTheme() {
    const savedTheme = localStorage.getItem('wellbayt-theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wellbayt-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    // 1. Reduced motion: Instant switch, no transition
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(next);
      return;
    }

    // 2. View Transitions API: Circular reveal expanding from toggle center
    if (typeof document.startViewTransition === 'function') {
      const rect = themeToggle ? themeToggle.getBoundingClientRect() : {
        left: window.innerWidth - 44,
        top: 20,
        width: 36,
        height: 36
      };
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const endRadius = Math.ceil(Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )) + 2;

      document.documentElement.style.setProperty('--toggle-x', `${x}px`);
      document.documentElement.style.setProperty('--toggle-y', `${y}px`);
      document.documentElement.style.setProperty('--toggle-r', `${endRadius}px`);

      try {
        const transition = document.startViewTransition(() => {
          setTheme(next);
        });
        activeViewTransition = transition;

        transition.finished.finally(() => {
          if (activeViewTransition === transition) {
            document.documentElement.style.removeProperty('--toggle-x');
            document.documentElement.style.removeProperty('--toggle-y');
            document.documentElement.style.removeProperty('--toggle-r');
            activeViewTransition = null;
          }
        });
      } catch (err) {
        activeViewTransition = null;
        setTheme(next);
      }
      return;
    }

    // 3. Fallback for browsers without View Transitions: Coordinated class transition
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
    document.documentElement.classList.add('theme-transitioning');
    setTheme(next);
    fallbackTimer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      fallbackTimer = null;
    }, 420);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('wellbayt-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- Toast Notifications ---
  const toastEl = document.getElementById('toast-notice');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // --- Clipboard Helper (No inline handlers) ---
  function copyText(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || 'Copied to clipboard');
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.setAttribute('readonly', '');
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Copied to clipboard');
    } catch (e) {
      showToast('Press Ctrl+C to copy');
    }
    document.body.removeChild(tempInput);
  }

  // Delegated copy clicks
  document.addEventListener('click', (e) => {
    const copyTarget = e.target.closest('[data-copy]');
    if (copyTarget) {
      e.preventDefault();
      const text = copyTarget.getAttribute('data-copy');
      const label = copyTarget.getAttribute('data-copy-label') || 'Copied to clipboard';
      if (text) copyText(text, label);
    }
  });

  // --- Part A: Interactive Approach Cards & Subtabs ---
  const approachCards = document.querySelectorAll('.approach-card');
  approachCards.forEach(card => {
    const toggleBtn = card.querySelector('.expand-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = card.classList.contains('expanded');
        card.classList.toggle('expanded', !isExpanded);
        toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
        const toggleText = toggleBtn.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = isExpanded ? 'Explore details' : 'Hide details';
        }
      });
    }
  });

  // WAI-ARIA tablist keyboard support
  function setupAccessibleTablist(tablistEl, tabSelector, paneSelector) {
    if (!tablistEl) return;
    const tabs = Array.from(tablistEl.querySelectorAll(tabSelector));
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab, tabs, paneSelector));

      tab.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIndex = tabs.length - 1;
        } else {
          return;
        }
        tabs[newIndex].focus();
        activateTab(tabs[newIndex], tabs, paneSelector);
      });
    });
  }

  function activateTab(tab, allTabs, paneSelector) {
    const targetId = tab.getAttribute('data-target') || tab.getAttribute('data-pane');
    allTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');

    const container = tab.closest('section') || document;
    container.querySelectorAll(paneSelector).forEach(p => p.classList.remove('active'));
    const targetPane = document.getElementById(targetId);
    if (targetPane) targetPane.classList.add('active');
  }

  // Init Part A case study tabs
  setupAccessibleTablist(
    document.querySelector('.subtabs-nav'),
    '.subtab-btn',
    '.subtab-pane'
  );

  // Init Part C timeline stepper tabs
  setupAccessibleTablist(
    document.querySelector('.timeline-stepper'),
    '.timeline-step-btn',
    '.timeline-pane'
  );

  // --- Automated Run Timestamp Display ---
  function formatRunDate(isoString) {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (e) {
      return null;
    }
  }

  function updateLastRunDisplay(isoString) {
    const timeEl = document.getElementById('radar-last-run-time');
    if (!timeEl) return;
    const formatted = formatRunDate(isoString);
    if (formatted) {
      timeEl.textContent = formatted;
      timeEl.setAttribute('datetime', isoString);
      timeEl.setAttribute('title', isoString);
    } else {
      timeEl.textContent = '21 Oct 2026';
    }
  }

  // --- Part B: Terminal Simulation (Robust & Re-entrant Safe) ---
  const btnRunRadar = document.getElementById('btn-run-radar');
  const btnSkipRadar = document.getElementById('btn-skip-radar');
  const terminalCmd = document.getElementById('terminal-cmd');
  const terminalLog = document.getElementById('terminal-stream-log');

  let typingInterval = null;
  let activeStreamTimeouts = [];
  let isSimulating = false;

  function clearSimulation() {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
    activeStreamTimeouts.forEach(t => clearTimeout(t));
    activeStreamTimeouts = [];
    isSimulating = false;
  }

  function typeCommand(text, callback) {
    if (!terminalCmd) return;
    terminalCmd.textContent = '';
    let i = 0;
    typingInterval = setInterval(() => {
      terminalCmd.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(typingInterval);
        typingInterval = null;
        setTimeout(callback, 150);
      }
    }, 38);
  }

  function startRadarSimulation(instant) {
    clearSimulation();
    isSimulating = true;

    // Respect prefers-reduced-motion automatically
    if (prefersReducedMotion.matches) {
      instant = true;
    }

    if (btnRunRadar) {
      btnRunRadar.disabled = !instant;
      btnRunRadar.innerHTML = instant
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 9-14 9V3z"/></svg> Replay Radar`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Replaying...`;
    }

    if (terminalLog) terminalLog.innerHTML = '';

    if (leads.length === 0) {
      if (terminalLog) {
        terminalLog.innerHTML = '<div style="padding:1rem; color:var(--terminal-dim); font-style:italic;">No leads in latest run.</div>';
      }
      isSimulating = false;
      if (btnRunRadar) {
        btnRunRadar.disabled = false;
        btnRunRadar.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 9-14 9V3z"/></svg> Replay Radar`;
      }
      return;
    }

    const executeStream = () => {
      leads.forEach((lead, index) => {
        const delay = instant ? 0 : index * 110;
        const timeoutId = setTimeout(() => {
          if (!terminalLog) return;
          const row = document.createElement('div');
          row.className = 'stream-row';
          row.tabIndex = 0;
          row.setAttribute('role', 'button');
          const scoreStr = lead.score.toFixed(2).padStart(5, ' ');
          const signalStr = Array.isArray(lead.signals) ? lead.signals.join(', ') : lead.signals;

          row.setAttribute('aria-label', `${lead.company} - score ${scoreStr.trim()}: ${lead.headline}`);

          row.innerHTML = `
            <span class="stream-score">${scoreStr}</span>
            <span class="stream-company">${escapeHtml(lead.company)}</span>
            <span class="stream-signal">${escapeHtml(signalStr)}</span>
            <span class="stream-age">${lead.age}d</span>
            <bdi class="stream-headline">${escapeHtml(lead.headline)}</bdi>
          `;

          row.addEventListener('click', () => openLeadDrawer(lead));
          row.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openLeadDrawer(lead);
            }
          });

          terminalLog.appendChild(row);
          terminalLog.scrollTop = terminalLog.scrollHeight;

          if (index === leads.length - 1) {
            isSimulating = false;
            if (btnRunRadar) {
              btnRunRadar.disabled = false;
              btnRunRadar.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3l14 9-14 9V3z"/></svg> Replay Radar`;
            }
          }
        }, delay);
        activeStreamTimeouts.push(timeoutId);
      });
    };

    if (instant) {
      if (terminalCmd) terminalCmd.textContent = 'python radar.py';
      executeStream();
    } else {
      typeCommand('python radar.py', executeStream);
    }
  }

  if (btnRunRadar) {
    btnRunRadar.addEventListener('click', () => startRadarSimulation(false));
  }

  if (btnSkipRadar) {
    btnSkipRadar.addEventListener('click', () => startRadarSimulation(true));
  }

  // --- Lead Cards & Filtering ---
  const leadsGrid = document.getElementById('leads-cards-grid');
  const filterPills = document.querySelectorAll('.filter-pill');
  const queueCountEl = document.getElementById('queue-count');

  function updateFilterCounts() {
    const totalCount = leads.length;
    const expansionCount = leads.filter(l => {
      const sigs = Array.isArray(l.signals) ? l.signals : [l.signals];
      return sigs.includes('expansion') && sigs.length === 1;
    }).length;
    const multiCount = leads.filter(l => {
      const sigs = Array.isArray(l.signals) ? l.signals : [l.signals];
      return sigs.length > 1;
    }).length;
    const freshCount = leads.filter(l => Number(l.age) <= 14).length;

    filterPills.forEach(pill => {
      const type = pill.getAttribute('data-filter');
      if (type === 'all') pill.textContent = `All Signals (${totalCount})`;
      if (type === 'expansion') pill.textContent = `Single Expansion (${expansionCount})`;
      if (type === 'multi') pill.textContent = `Multi-Trigger (${multiCount})`;
      if (type === 'fresh') pill.textContent = `Fresh ≤ 14d (${freshCount})`;
    });

    if (queueCountEl) {
      const filtered = getFilteredLeads();
      queueCountEl.textContent = `Showing ${filtered.length} of ${totalCount} verified leads`;
    }
  }

  function getFilteredLeads() {
    if (activeFilter === 'expansion') {
      return leads.filter(l => {
        const sigs = Array.isArray(l.signals) ? l.signals : [l.signals];
        return sigs.includes('expansion') && sigs.length === 1;
      });
    }
    if (activeFilter === 'multi') {
      return leads.filter(l => {
        const sigs = Array.isArray(l.signals) ? l.signals : [l.signals];
        return sigs.length > 1;
      });
    }
    if (activeFilter === 'fresh') {
      return leads.filter(l => Number(l.age) <= 14);
    }
    return leads;
  }

  function renderLeadCards() {
    if (!leadsGrid) return;
    leadsGrid.innerHTML = '';
    const filtered = getFilteredLeads();

    if (queueCountEl) {
      queueCountEl.textContent = `Showing ${filtered.length} of ${leads.length} leads`;
    }

    if (filtered.length === 0) {
      leadsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          No leads match the selected filter.
        </div>
      `;
      return;
    }

    filtered.forEach(lead => {
      const card = document.createElement('article');
      card.className = 'lead-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${lead.company} - dossier, score ${lead.score.toFixed(2)}: ${lead.headline}`);

      const signalTags = (Array.isArray(lead.signals) ? lead.signals : [lead.signals])
        .map(s => `<span class="lead-tag">${escapeHtml(s.replace(/_/g, ' '))}</span>`)
        .join('');

      card.innerHTML = `
        <div class="lead-card-top">
          <h3 class="lead-card-company">${escapeHtml(lead.company)}</h3>
          <span class="score-badge">${lead.score.toFixed(2)}</span>
        </div>
        <div class="lead-tags">
          ${signalTags}
        </div>
        <bdi class="lead-headline-preview">${escapeHtml(lead.headline)}</bdi>
        <div class="lead-card-footer">
          <span>${lead.age === 0 ? 'Today' : `${lead.age} days ago`}</span>
          <span class="view-dossier-hint">View dossier &rarr;</span>
        </div>
      `;

      card.addEventListener('click', () => openLeadDrawer(lead));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLeadDrawer(lead);
        }
      });

      leadsGrid.appendChild(card);
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter') || 'all';
      renderLeadCards();
    });
  });

  // --- Lead Drawer / Inspector with Focus Trap ---
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerPanel = document.getElementById('drawer-panel');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerTitle = document.getElementById('drawer-company-title');
  const drawerScoreBadge = document.getElementById('drawer-score-badge');
  const drawerBody = document.getElementById('drawer-body-content');
  let previouslyFocusedElement = null;

  function openLeadDrawer(lead) {
    if (!drawerBackdrop) return;
    previouslyFocusedElement = document.activeElement;

    if (drawerTitle) drawerTitle.textContent = lead.company;
    if (drawerScoreBadge) drawerScoreBadge.textContent = `Score ${lead.score.toFixed(2)}`;

    const breakdown = lead.breakdown || {
      details: `Weight multiplied by freshness factor for ${lead.age}d age.`
    };

    if (drawerBody) {
      drawerBody.innerHTML = `
        <div class="dossier-section">
          <div class="dossier-section-title">Verified Signal &amp; Age</div>
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-top:0.2rem;">
            ${(lead.signals || []).map(s => `<span class="lead-tag">${escapeHtml(s.replace(/_/g, ' '))}</span>`).join('')}
            <span style="font-size:0.82rem; color:var(--text-muted);">${lead.age === 0 ? 'Published today' : `Published ${lead.age} days ago`}</span>
          </div>
        </div>

        <div class="dossier-section">
          <div class="dossier-section-title">Score Breakdown (Algorithm Logic)</div>
          <div class="score-calc-box">
            <div class="score-formula">Score = Trigger Weight &times; Freshness + Multi-Trigger Bonus</div>
            <p style="margin:0; font-size:0.82rem; color:var(--text-secondary);">${escapeHtml(breakdown.details)}</p>
          </div>
        </div>

        <div class="dossier-section">
          <div class="dossier-section-title">Why Target (Strategic Rationale)</div>
          <p style="font-size:0.88rem; color:var(--text-primary); line-height:1.5; margin:0;">${escapeHtml(lead.why)}</p>
        </div>

        <div class="dossier-section">
          <div class="dossier-section-title">Evidence &amp; Verification Link</div>
          <div style="background:var(--bg-surface-elevated); padding:0.75rem 0.9rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <bdi style="font-weight:600; font-size:0.86rem; color:var(--text-primary); margin-bottom:0.35rem; display:block;">
              ${escapeHtml(lead.headline)}
            </bdi>
            <a href="${escapeHtml(lead.link)}" target="_blank" rel="noopener noreferrer" style="font-size:0.78rem; display:inline-flex; align-items:center; gap:0.3rem;">
              Verify source article <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
        </div>

        <div class="dossier-section">
          <div class="dossier-section-title">Target Decision Makers</div>
          <p style="font-size:0.86rem; font-weight:600; color:var(--text-primary); margin:0;">${escapeHtml(lead.roles)}</p>
        </div>

        <div class="dossier-section">
          <div class="dossier-section-title">Personalised Draft Opener</div>
          <div class="opener-box">
            <p id="drawer-opener-text" style="margin:0; font-style:italic;">&ldquo;${escapeHtml(lead.opener)}&rdquo;</p>
            <div class="opener-copy-action">
              <button class="btn btn-secondary btn-sm" id="btn-copy-drawer-opener" type="button" data-copy="${escapeHtml(lead.opener)}" data-copy-label="Copied opener for ${escapeHtml(lead.company)}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Opener
              </button>
            </div>
          </div>
        </div>
      `;
    }

    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (drawerCloseBtn) drawerCloseBtn.focus();
  }

  function closeLeadDrawer() {
    if (!drawerBackdrop || !drawerBackdrop.classList.contains('active')) return;
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeLeadDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeLeadDrawer();
    });
  }

  // Focus trap inside drawer
  window.addEventListener('keydown', (e) => {
    if (!drawerBackdrop || !drawerBackdrop.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLeadDrawer();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = drawerPanel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  // --- Sticky Mini-Nav Scroll Spy ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScrollSpy() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });

  // --- Utility ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Dynamic data loading with graceful fallback ---
  function loadRadarData() {
    if (!window.location.protocol.startsWith('http')) {
      updateFilterCounts();
      renderLeadCards();
      return;
    }

    // Attempt to load run metadata
    fetch('run_meta.json')
      .then(res => res.ok ? res.json() : null)
      .then(meta => {
        if (meta && meta.last_run) {
          updateLastRunDisplay(meta.last_run);
        }
      })
      .catch(() => {});

    // Attempt to load leads from data.json
    fetch('data.json')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        let loadedLeads = null;
        if (Array.isArray(data) && data.length > 0) {
          loadedLeads = data;
        } else if (data && Array.isArray(data.leads) && data.leads.length > 0) {
          loadedLeads = data.leads;
          if (data.last_run) {
            updateLastRunDisplay(data.last_run);
          }
        }
        if (loadedLeads) {
          leads = loadedLeads;
          updateFilterCounts();
          renderLeadCards();
          if (!isSimulating) {
            startRadarSimulation(true);
          }
        }
      })
      .catch(() => {
        // Transparent fallback to embedded verified leads
        updateFilterCounts();
        renderLeadCards();
      });
  }

  // --- Initialization ---
  initTheme();
  updateFilterCounts();
  renderLeadCards();
  startRadarSimulation(true);
  loadRadarData();
})();
