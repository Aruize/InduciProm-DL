// ─── DOM refs ───
const themeToggle = document.getElementById('theme-toggle');
const mutationInput = document.getElementById('mutation-input');
const applyBtn = document.getElementById('apply-btn');
const resetBtn = document.getElementById('reset-btn');
const predictBtn = document.getElementById('predict-btn');
const wildtypeEl = document.getElementById('wildtype-seq');
const mutatedEl = document.getElementById('mutated-seq');
const mutatedCard = document.getElementById('mutated-card');
const resultsCard = document.getElementById('results-card');
const resultsGrid = document.getElementById('results-grid');
const resultsLoading = document.getElementById('results-loading');
const mutCount = document.getElementById('mut-count');
const toastEl = document.getElementById('toast');
const dotUninduced = document.getElementById('dot-uninduced');
const dotInduced = document.getElementById('dot-induced');

// ─── Theme ───
function getTheme() { return localStorage.getItem('gfp-theme') || 'light'; }
function setTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? t('themeLight') : t('themeDark');
  localStorage.setItem('gfp-theme', theme);
}
themeToggle.addEventListener('click', () => {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
});
setTheme(getTheme());

// ─── Region color map ───
function buildRegionColorMap(hidden) {
  const map = {};
  for (const r of REGIONS) {
    if (hidden && hidden.has(r.name)) continue;
    for (let i = r.start - SEQ_OFFSET; i <= r.end - SEQ_OFFSET; i++) {
      if (i >= 0 && i < 253) {
        if (!map[i]) map[i] = [];
        map[i].push({ color: r.color, label: r.label });
      }
    }
  }
  return map;
}

// ─── Responsive Sequences ───
let seqResizeTimer = null;

function calcBasesPerRow() {
  const container = document.getElementById('sequence-card');
  if (!container) return 50;
  const sample = document.querySelector('.seq-base');
  const fs = sample ? parseFloat(getComputedStyle(sample).fontSize) : parseFloat(getComputedStyle(document.body).fontSize);
  const baseW = 1.2 * fs;
  const blockW = 10 * baseW + 6;
  const cardInner = container.clientWidth - 40;
  const availForBases = cardInner - 40;
  const blocks = Math.max(1, Math.floor(availForBases / blockW));
  return blocks * 10;
}

function formatSeq(seq, diffs, basesPerRow, regionMap, diffClass) {
  const lines = [];
  for (let lineStart = 0; lineStart < 253; lineStart += basesPerRow) {
    const end = Math.min(lineStart + basesPerRow, 253);
    let html = '<div class="seq-line">';
    html += `<span class="seq-num">${lineStart + SEQ_OFFSET}</span>`;
    html += '<div class="seq-bases">';
    for (let i = lineStart; i < end; i += 10) {
      html += '<span class="seq-block">';
      for (let j = i; j < Math.min(i + 10, end); j++) {
        const base = seq[j];
        const isDiff = diffs && diffs.has(j);
        const cls = BASE_CLASS[base] || '';
        const diffCls = isDiff ? (diffClass ? ` ${diffClass}` : ' diff') : '';
        const regs = regionMap && regionMap[j];
        let style = '';
        if (regs) {
          if (regs.length === 1) {
            const c = regs[0].color;
            style = ` style="background:${c}44;border-bottom:2px solid ${c}"`;
          } else {
            const cs = regs.map(r => r.color);
            style = ` style="background:linear-gradient(90deg,${cs.map(c => c + '44').join(',')});border-bottom:2px solid transparent;border-image:linear-gradient(90deg,${cs.join(',')}) 2"`;
          }
        }
        html += `<span class="seq-base ${cls}${diffCls}" data-pos="${j}"${style}>${base}</span>`;
      }
      html += '</span>';
    }
    html += '</div></div>';
    lines.push(html);
  }
  return lines.join('');
}

function renderSequences() {
  const wtMap = buildRegionColorMap(WT_HIDDEN);
  const mutMap = buildRegionColorMap(MUT_HIDDEN);
  const diffs = new Set();
  const mutSeqArr = currentSeq.split('');
  for (let i = 0; i < 253; i++) {
    if (mutSeqArr[i] !== WT_SEQ[i]) diffs.add(i);
  }
  diffPositions = diffs;

  wildtypeEl.innerHTML = formatSeq(WT_SEQ, diffs, currentBpr, wtMap, 'mutated');
  renderLegend('region-legend', WT_HIDDEN);

  if (diffs.size > 0) {
    mutatedCard.style.display = 'block';
    mutatedEl.innerHTML = formatSeq(currentSeq, diffs, currentBpr, mutMap, 'diff');
    renderLegend('mut-region-legend', MUT_HIDDEN);
    mutCount.textContent = `(${diffs.size} ${diffs.size > 1 ? t('mutationPlural') : t('mutationSingle')})`;
  } else {
    mutatedCard.style.display = 'none';
  }

  document.querySelectorAll('#wildtype-seq .seq-base, #mutated-seq .seq-base').forEach(el => {
    el.addEventListener('click', (e) => {
      const pos = parseInt(el.dataset.pos);
      showBasePicker(e, pos, el);
    });
  });
}

function updateRegionHighlights() {
  const wtMap = buildRegionColorMap(WT_HIDDEN);
  document.querySelectorAll('#wildtype-seq .seq-base[data-pos]').forEach(el => {
    const j = parseInt(el.dataset.pos);
    const regs = wtMap && wtMap[j];
    let style = '';
    if (regs) {
      if (regs.length === 1) {
        const c = regs[0].color;
        style = `background:${c}44;border-bottom:2px solid ${c}`;
      } else {
        const cs = regs.map(r => r.color);
        style = `background:linear-gradient(90deg,${cs.map(c => c + '44').join(',')});border-bottom:2px solid transparent;border-image:linear-gradient(90deg,${cs.join(',')}) 2`;
      }
    }
    if (style) el.setAttribute('style', style);
    else el.removeAttribute('style');
  });
  const mutMap = buildRegionColorMap(MUT_HIDDEN);
  document.querySelectorAll('#mutated-seq .seq-base[data-pos]').forEach(el => {
    const j = parseInt(el.dataset.pos);
    const regs = mutMap && mutMap[j];
    let style = '';
    if (regs) {
      if (regs.length === 1) {
        const c = regs[0].color;
        style = `background:${c}44;border-bottom:2px solid ${c}`;
      } else {
        const cs = regs.map(r => r.color);
        style = `background:linear-gradient(90deg,${cs.map(c => c + '44').join(',')});border-bottom:2px solid transparent;border-image:linear-gradient(90deg,${cs.join(',')}) 2`;
      }
    }
    if (style) el.setAttribute('style', style);
    else el.removeAttribute('style');
  });
  renderLegend('region-legend', WT_HIDDEN);
  renderLegend('mut-region-legend', MUT_HIDDEN);
}

function renderLegend(elId, hidden) {
  const legendEl = document.getElementById(elId);
  let html = '';
  for (const r of REGIONS) {
    const h = hidden.has(r.name);
    html += `<span class="legend-item${h ? ' hidden' : ''}" data-name="${r.name}"><span class="legend-swatch" style="background:${r.color}66;border-color:${r.color}"></span>${r.label}</span>`;
  }
  legendEl.innerHTML = html;
  legendEl.querySelectorAll('.legend-item').forEach(el => {
    el.addEventListener('click', () => {
      const name = el.dataset.name;
      if (hidden.has(name)) hidden.delete(name);
      else hidden.add(name);
      updateRegionHighlights();
    });
  });
}

function recalcBprAndRender() {
  currentBpr = calcBasesPerRow();
  renderSequences();
}

window.addEventListener('resize', () => {
  clearTimeout(seqResizeTimer);
  seqResizeTimer = setTimeout(recalcBprAndRender, 100);
});

// ─── Base picker (click to mutate) ───
let activePicker = null;
function showBasePicker(event, pos, targetEl) {
  if (activePicker) activePicker.remove();
  const picker = document.createElement('div');
  picker.className = 'base-picker active';
  picker.style.position = 'absolute';
  const rect = targetEl.getBoundingClientRect();
  picker.style.top = (rect.bottom + window.scrollY + 4) + 'px';
  picker.style.left = (rect.left + rect.width / 2 + window.scrollX) + 'px';
  picker.style.transform = 'translateX(-50%)';

  BASES.forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'base-option ' + BASE_CLASS[b];
    btn.textContent = b;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentSeq[pos] !== b) {
        const arr = currentSeq.split('');
        arr[pos] = b;
        currentSeq = arr.join('');
        renderSequences();
        updatePredictButton();
      }
      picker.remove();
      activePicker = null;
    });
    picker.appendChild(btn);
  });
  document.body.appendChild(picker);
  activePicker = picker;

  const close = (e) => {
    if (!picker.contains(e.target) && e.target !== targetEl) {
      picker.remove();
      activePicker = null;
      document.removeEventListener('click', close);
    }
  };
  setTimeout(() => document.addEventListener('click', close), 0);
}

// ─── Apply mutations ───
function parseMutation(mutStr) {
  mutStr = mutStr.trim().toUpperCase();
  const m = mutStr.match(/^([ACGT])(\d+)([ACGT])$/);
  if (!m) return null;
  return { origBase: m[1], pos: parseInt(m[2]) - SEQ_OFFSET, newBase: m[3] };
}

function applyMutations(input) {
  const seq = currentSeq.split('');
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  const errors = [];
  let applied = 0;

  for (const part of parts) {
    const mut = parseMutation(part);
    if (!mut) { errors.push(`"${part}" \u2014 ${t('formatHint')}`); continue; }
    if (mut.pos < 0 || mut.pos >= 253) { errors.push(`"${part}" \u2014 ${t('posOutOfRange', SEQ_OFFSET, SEQ_OFFSET + 252)}`); continue; }
    if (seq[mut.pos] !== mut.origBase) { errors.push(`"${part}" \u2014 ${t('expectedFound', mut.origBase, mut.pos + SEQ_OFFSET, seq[mut.pos])}`); continue; }
    seq[mut.pos] = mut.newBase;
    applied++;
  }

  currentSeq = seq.join('');
  renderSequences();
  updatePredictButton();

  if (errors.length > 0) {
    showToast(errors.join(' | '), 5000);
  }
  if (applied === 0 && errors.length > 0) {
    currentSeq = WT_SEQ.split('').join('');
    renderSequences();
    updatePredictButton();
  }
  return errors.length === 0;
}

applyBtn.addEventListener('click', () => {
  const input = mutationInput.value.trim();
  if (!input) { showToast(t('enterMutation'), 2000); return; }
  applyMutations(input);
});

mutationInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') applyBtn.click();
});

resetBtn.addEventListener('click', () => {
  currentSeq = WT_SEQ;
  mutationInput.value = '';
  renderSequences();
  updatePredictButton();
  resultsCard.style.display = 'none';
});

// ─── One-hot encode ───
function oneHotEncode(seq) {
  const map = { A: 0, C: 1, G: 2, T: 3 };
  const data = new Float32Array(1 * 1 * 253 * 4);
  for (let i = 0; i < Math.min(seq.length, 253); i++) {
    const idx = map[seq[i]];
    if (idx !== undefined) data[i * 4 + idx] = 1.0;
  }
  return data;
}

function softmax(logits) {
  const max = Math.max(...logits);
  const exps = logits.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

// ─── ONNX models ───
async function loadModel(url, dotEl) {
  try {
    dotEl.className = 'model-dot loading';
    const session = await ort.InferenceSession.create(url, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    });
    dotEl.className = 'model-dot ready';
    return session;
  } catch (err) {
    dotEl.className = 'model-dot error';
    console.error('Failed to load', url, err);
    throw err;
  }
}

async function loadModels() {
  try {
    const [uninduced, induced] = await Promise.all([
      loadModel('./models/uninduced.onnx', dotUninduced),
      loadModel('./models/induced.onnx', dotInduced),
    ]);
    uninducedSession = uninduced;
    inducedSession = induced;
    modelsReady = true;
    updatePredictButton();
    optBtn.disabled = false;
  } catch (err) {
    showToast(t('modelLoadError'), 5000);
  }
}

// ─── Predict ───
async function runInference(session, seq) {
  const data = oneHotEncode(seq);
  const tensor = new ort.Tensor('float32', data, [1, 1, 253, 4]);
  const feeds = { input: tensor };
  const results = await session.run(feeds);
  const logits = Array.from(results.output.data);
  return softmax(logits);
}

function getBarClass(pct) {
  if (pct >= 70) return 'high';
  if (pct >= 40) return 'medium';
  return 'low';
}

function renderResults(probsUninduced, probsInduced) {
  const uninducedLabels = [t('low'), t('high')];
  const inducedLabels = [t('low'), t('medium'), t('high')];
  const uninducedConfig = { num_classes: 2, label: t('uninducedExpr'), cond: t('condUninduced'), labels: uninducedLabels };
  const inducedConfig = { num_classes: 3, label: t('inducedExpr'), cond: t('condInduced'), labels: inducedLabels };

  resultsGrid.innerHTML = '';

  [ { probs: probsUninduced, config: uninducedConfig },
    { probs: probsInduced, config: inducedConfig }
  ].forEach(({ probs, config }) => {
    const card = document.createElement('div');
    card.className = 'result-card';

    let html = `<h3>${config.label}</h3>`;
    html += `<div class="cond">${config.cond}</div>`;

    const maxProb = Math.max(...probs);
    const predClass = probs.indexOf(maxProb);

    probs.forEach((p, i) => {
      const pct = (p * 100);
      const barClass = getBarClass(pct);
      const label = config.labels[i] || `Class ${i}`;
      html += `<div class="prob-row">
        <span class="prob-label">${label}</span>
        <div class="prob-bar-wrap">
          <div class="prob-bar ${barClass}" style="width:${Math.max(pct, 2)}%">${pct >= 20 ? (pct.toFixed(0) + '%') : ''}</div>
        </div>
        <span class="prob-pct">${pct.toFixed(1)}%</span>
      </div>`;
    });

    html += `<div class="predicted-class highlight">${t('predicted', config.labels[predClass], (maxProb * 100).toFixed(1))}</div>`;
    card.innerHTML = html;
    resultsGrid.appendChild(card);
  });

  resultsLoading.classList.remove('active');
  resultsLoading.style.display = 'none';
  resultsGrid.style.display = 'grid';
}

async function predict() {
  if (!modelsReady || !currentSeq) return;

  resultsCard.style.display = 'block';
  resultsLoading.classList.add('active');
  resultsLoading.style.display = '';
  resultsGrid.style.display = 'none';

  const muts = [];
  for (let i = 0; i < 253; i++) {
    if (currentSeq[i] !== WT_SEQ[i]) muts.push(`${WT_SEQ[i]}${i + SEQ_OFFSET}${currentSeq[i]}`);
  }
  const mutsEl = document.getElementById('results-mutations');
  const vLabel = t('variants');
  if (muts.length > 0) {
    mutsEl.innerHTML = `<span class="mutations-label">${vLabel}</span><span class="mutations-list">${muts.join(', ')}</span>`;
  } else {
    mutsEl.innerHTML = `<span class="mutations-label">${vLabel}</span><span class="mutations-list">${t('wildTypeLabel')}</span>`;
  }

  try {
    const [probsUninduced, probsInduced] = await Promise.all([
      runInference(uninducedSession, currentSeq),
      runInference(inducedSession, currentSeq),
    ]);
    renderResults(probsUninduced, probsInduced);
  } catch (err) {
    console.error('Prediction error:', err);
    showToast(t('predictionFailed'), 3000);
    resultsCard.style.display = 'none';
  }
}

predictBtn.addEventListener('click', predict);

function updatePredictButton() {
  const canPredict = modelsReady && currentSeq.length === 253;
  predictBtn.disabled = !canPredict;
  predictBtn.textContent = t('predict');
}

// ─── Toast ───
let toastTimeout;
function showToast(msg, duration) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), duration || 2000);
}

// ─── Init ───
currentBpr = calcBasesPerRow();
renderSequences();
updatePredictButton();
