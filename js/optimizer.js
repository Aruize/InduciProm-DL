// ─── Optimal Variant Finder ───
const optMin = document.getElementById('opt-min');
const optMax = document.getElementById('opt-max');
const optCount = document.getElementById('opt-count');
const optSites = document.getElementById('opt-sites');
const optPosRange = document.getElementById('opt-pos-range');
const optPosEnable = document.getElementById('opt-pos-enable');
const optRandom = document.getElementById('opt-random');
const optThreshUn = document.getElementById('opt-thresh-un');
const optThreshIn = document.getElementById('opt-thresh-in');
const optBtn = document.getElementById('optimize-btn');
const optResults = document.getElementById('opt-results');

function getMaxAllowedMutations() {
  if (optRandom.checked) return 252;
  if (optPosEnable.checked) {
    const rangeText = optPosRange.value.trim();
    if (!rangeText) return 252;
    const parts = rangeText.split(',').map(s => s.trim());
    const allowedSet = new Set();
    for (const part of parts) {
      const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        const start = parseInt(m[1]);
        const end = parseInt(m[2]);
        if (start >= 1 && end >= 1) {
          const s = Math.max(0, start - SEQ_OFFSET);
          const e = Math.min(252, end - SEQ_OFFSET);
          for (let i = s; i <= e; i++) allowedSet.add(i);
        }
      }
    }
    return allowedSet.size || 252;
  }
  const siteCbs = optSites.querySelectorAll('input[type="checkbox"]');
  let totalLen = 0;
  let anyChecked = false;
  siteCbs.forEach(cb => {
    if (cb.checked) {
      anyChecked = true;
      for (const r of REGIONS) {
        if (r.name === cb.value) {
          totalLen += (r.end - r.start + 1);
        }
      }
    }
  });
  return anyChecked ? totalLen : 252;
}

function syncMaxInput() {
  const limit = getMaxAllowedMutations();
  optMax.max = limit;
  optMin.max = limit;
  let v = parseInt(optMax.value);
  if (isNaN(v) || v < 1) optMax.value = 1;
  else if (v > limit) optMax.value = limit;
  v = parseInt(optMin.value);
  if (isNaN(v) || v < 1) optMin.value = 1;
  else if (v > limit) optMin.value = limit;
}

optPosEnable.addEventListener('change', () => {
  optPosRange.disabled = !optPosEnable.checked;
  if (optPosEnable.checked) optPosRange.focus();
  syncMaxInput();
});
optPosRange.addEventListener('blur', syncMaxInput);

optMax.addEventListener('blur', () => {
  let v = parseInt(optMax.value);
  if (isNaN(v) || v < 1) optMax.value = 1;
  else if (v > optMax.max) optMax.value = optMax.max;
});
optMax.addEventListener('input', () => {
  if (parseInt(optMax.value) > optMax.max) optMax.value = optMax.max;
});
optMax.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
optMin.addEventListener('blur', () => {
  let v = parseInt(optMin.value);
  if (isNaN(v) || v < 1) optMin.value = 1;
  else if (v > optMin.max) optMin.value = optMin.max;
});
optMin.addEventListener('input', () => {
  if (parseInt(optMin.value) > optMin.max) optMin.value = optMin.max;
});
optMin.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

optCount.addEventListener('blur', () => {
  let v = parseInt(optCount.value);
  if (isNaN(v) || v < 1) optCount.value = 1;
  else if (v > 10) optCount.value = 10;
});
optCount.addEventListener('input', () => {
  if (parseInt(optCount.value) > 10) optCount.value = 10;
});
optCount.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

[optThreshUn, optThreshIn].forEach(el => {
  el.addEventListener('blur', () => {
    if (el.value.includes(',')) el.value = el.value.replace(',', '.');
    let v = parseFloat(el.value);
    if (isNaN(v) || v < 0.5) el.value = '0.5';
    else if (v > 1) el.value = '1';
    else el.value = v.toFixed(2);
  });
  el.addEventListener('input', () => {
    if (el.value.includes(',')) el.value = el.value.replace(',', '.');
    const m = el.value.match(/^(\d+(?:\.\d{0,2})?)/);
    if (m && m[1] !== el.value) el.value = m[1];
    if (parseFloat(el.value) > 1) el.value = '1';
  });
  el.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
});

const BASES_ALL = ['A', 'C', 'G', 'T'];

REGIONS.forEach(r => {
  const label = document.createElement('label');
  label.style.setProperty('--site-color', r.color);
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.value = r.name;
  cb.checked = false;
  const span = document.createElement('span');
  span.innerHTML = r.label;
  label.appendChild(cb);
  label.appendChild(span);
  optSites.appendChild(label);
});

optRandom.checked = true;
syncMaxInput();

optSites.querySelectorAll('input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', () => {
    if (cb.checked) {
      optRandom.checked = false;
    } else {
      const anyChecked = Array.from(optSites.querySelectorAll('input[type="checkbox"]')).some(c => c.checked);
      if (!anyChecked) optRandom.checked = true;
    }
    syncMaxInput();
  });
});
optRandom.addEventListener('change', () => {
  if (optRandom.checked) {
    optSites.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  }
  syncMaxInput();
});

const optSearchHistory = [];
const MAX_HISTORY = 5;

function renderOptHistory() {
  const el = document.getElementById('opt-history');
  if (optSearchHistory.length === 0) { el.style.display = 'none'; return; }
  let html = '<div class="opt-history-title">Previous searches</div>';
  optSearchHistory.forEach((entry, idx) => {
    const label = entry.params || 'Search ' + (idx + 1);
    html += `<div class="opt-history-item" data-idx="${idx}">${label}</div>`;
  });
  el.innerHTML = html;
  el.style.display = 'block';
  el.querySelectorAll('.opt-history-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.idx);
      const entry = optSearchHistory[idx];
      if (entry) {
        optResults.innerHTML = entry.html;
        optResults.style.display = 'block';
      }
    });
  });
}

async function findOptimalVariants() {
  if (!modelsReady) return;

  const minMut = Math.max(1, parseInt(optMin.value) || 1);
  const maxMut = Math.min(optMax.max, Math.max(minMut, parseInt(optMax.value) || 1));
  const targetCount = Math.min(Math.max(1, parseInt(optCount.value) || 5), 10);

  const isRandom = optRandom.checked;
  const isCustomPos = optPosEnable.checked;
  const allowedSet = new Set();

  if (isRandom) {
    for (let i = 0; i < 253; i++) allowedSet.add(i);
  } else if (isCustomPos) {
    const rangeText = optPosRange.value.trim();
    if (!rangeText) {
      showToast('Enter a position range or disable custom range.', 3000);
      return;
    }
    const parts = rangeText.split(',').map(s => s.trim());
    let valid = false;
    for (const part of parts) {
      const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        const start = parseInt(m[1]);
        const end = parseInt(m[2]);
        if (start < 1 || end < 1) { showToast('Negative positions not allowed.', 3000); return; }
        const s = Math.max(0, start - SEQ_OFFSET);
        const e = Math.min(252, end - SEQ_OFFSET);
        for (let i = s; i <= e; i++) allowedSet.add(i);
        valid = true;
      }
    }
    if (!valid) { showToast('Invalid range format. Use e.g. 30-45, 50-200.', 3000); return; }
  } else {
    const siteCbs = optSites.querySelectorAll('input[type="checkbox"]');
    siteCbs.forEach(cb => {
      if (cb.checked) {
        for (const r of REGIONS) {
          if (r.name === cb.value) {
            for (let i = r.start - SEQ_OFFSET; i <= r.end - SEQ_OFFSET; i++) {
              if (i >= 0 && i < 253) allowedSet.add(i);
            }
          }
        }
      }
    });
    if (allowedSet.size === 0) {
      for (let i = 0; i < 253; i++) allowedSet.add(i);
    }
  }

  const allowedArr = Array.from(allowedSet);
  if (allowedArr.length === 0) {
    showToast('No valid positions selected.', 3000);
    return;
  }

  const realMaxMut = Math.min(maxMut, allowedArr.length);
  const realMinMut = Math.min(minMut, realMaxMut);

  optBtn.disabled = true;
  optBtn.classList.add('searching');
  optResults.innerHTML = '<div style="text-align:center;padding:24px;"><div class="opt-pulse-container"><div class="opt-pulse-ring"></div><div class="opt-pulse-ring"></div><div class="opt-pulse-ring"></div></div><div class="opt-loading-text">Finding optimal variants...</div></div>';
  optResults.style.display = 'block';

  const results = [];
  const seen = new Set();
  const deadline = Date.now() + 30000;
  let attempts = 0;
  let yieldCounter = 0;

  try {
    while (Date.now() < deadline && results.length < targetCount) {
      if (++yieldCounter % 5 === 0) await new Promise(r => setTimeout(r, 0));
      attempts++;
      const numMuts = realMinMut + Math.floor(Math.random() * (realMaxMut - realMinMut + 1));
      const shuffled = [...allowedArr].sort(() => Math.random() - 0.5);
      const positions = shuffled.slice(0, numMuts).sort((a, b) => a - b);

      const seq = WT_SEQ.split('');
      for (const pos of positions) {
        const avail = BASES_ALL.filter(b => b !== seq[pos]);
        seq[pos] = avail[Math.floor(Math.random() * avail.length)];
      }
      const variant = seq.join('');

      const key = positions.join(',');
      if (seen.has(key)) { attempts--; await new Promise(r => setTimeout(r, 0)); continue; }
      seen.add(key);

      try {
        const [pu, pi] = await Promise.all([
          runInference(uninducedSession, variant),
          runInference(inducedSession, variant),
        ]);
        if (pu[0] <= pu[1]) continue;
        if (pi[2] <= pi[0] || pi[2] <= pi[1]) continue;
        const threshUn = Math.min(1, Math.max(0.5, parseFloat(optThreshUn.value) || 0.5));
        const threshIn = Math.min(1, Math.max(0.5, parseFloat(optThreshIn.value) || 0.5));
        if (pu[0] < threshUn) continue;
        if (pi[2] < threshIn) continue;
        const score = pu[0] * pi[2];
        results.push({ seq: variant, score, pu, pi, positions });
        results.sort((a, b) => b.score - a.score);
        if (results.length > targetCount) results.length = targetCount;
      } catch (e) {
        // skip
      }
    }
  } finally {
    optBtn.classList.remove('searching');
    optBtn.disabled = false;
  }

  if (results.length === 0) {
    optResults.innerHTML = '<div class="opt-apology">No optimal variants found. Please select a less restrictive configuration (more positions, lower thresholds, wider mutation range).</div>';
    optResults.style.display = 'block';
    return;
  }

  let html = '';

  if (results.length < targetCount) {
    html += '<div class="opt-apology">Could not find all requested variants. Try limiting the variant range (fewer positions or mutations) for a faster search.</div>';
  }

  results.forEach((r, idx) => {
    const mutStrs = r.positions.map(p => `${WT_SEQ[p]}${p + SEQ_OFFSET}${r.seq[p]}`);
    const lowPct = r.pu[0] * 100;
    const highPct = r.pi[2] * 100;
    const lowBar = lowPct >= 70 ? 'high' : lowPct >= 40 ? 'medium' : 'low';
    const highBar = highPct >= 70 ? 'high' : highPct >= 40 ? 'medium' : 'low';
    html += `<div class="opt-result-item">
      <div style="flex:1">
        <div style="font-weight:600;margin-bottom:4px;">#${idx + 1} ${mutStrs.join(', ')}</div>
        <div class="prob-row" style="margin-bottom:2px;">
          <span class="prob-label" style="min-width:50px;font-size:11px;">Unind Low</span>
          <div class="prob-bar-wrap" style="height:12px;">
            <div class="prob-bar ${lowBar}" style="width:${Math.max(lowPct, 2)}%;height:12px;font-size:8px;">${lowPct >= 20 ? lowPct.toFixed(0) + '%' : ''}</div>
          </div>
          <span class="prob-pct" style="width:36px;font-size:11px;">${lowPct.toFixed(1)}%</span>
        </div>
        <div class="prob-row" style="margin-bottom:0;">
          <span class="prob-label" style="min-width:50px;font-size:11px;">Ind High</span>
          <div class="prob-bar-wrap" style="height:12px;">
            <div class="prob-bar ${highBar}" style="width:${Math.max(highPct, 2)}%;height:12px;font-size:8px;">${highPct >= 20 ? highPct.toFixed(0) + '%' : ''}</div>
          </div>
          <span class="prob-pct" style="width:36px;font-size:11px;">${highPct.toFixed(1)}%</span>
        </div>
      </div>
    </div>`;
  });

  optResults.innerHTML = html;
  optResults.style.display = 'block';

  optSearchHistory.push({ html: html, params: `${minMut}-${maxMut} mut, ${targetCount} variants` });
  if (optSearchHistory.length > MAX_HISTORY) optSearchHistory.shift();
  renderOptHistory();
}

optBtn.addEventListener('click', findOptimalVariants);
