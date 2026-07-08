const LANG_STORAGE_KEY = 'gfp-lang';

const TRANSLATIONS = {
  en: {
    title: 'GFP Expression Predictor',
    appTitle: 'Expression Predictor',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    promoter: 'Promoter',
    promoterBad: 'L-arabinose (pBAD)',
    promoterRha: 'L-rhamnose (rhaBAD) \u2014 Coming soon',
    modelStatus: 'Model Status',
    uninduced: 'UNINDUCED (0% L-arabinose)',
    induced: 'INDUCED (0.2% L-arabinose)',
    sequence: 'Sequence',
    wildType: 'Wild Type',
    clickHint: '(click a base to mutate or write the mutations below)',
    reset: 'Reset',
    mutations: 'Mutations',
    mutationPlaceholder: 'e.g. A81T, G132C, T229A',
    apply: 'Apply',
    batchPrediction: 'Batch prediction for multiple variants \u2014 coming soon',
    mutatedSequence: 'Mutated Sequence',
    predict: 'Predict GFP Expression',
    results: 'Prediction Results',
    runningInference: 'Running inference...',
    variants: 'Variants',
    wildTypeLabel: 'Wild type',
    uninducedExpr: 'UNINDUCED EXPRESSION',
    inducedExpr: 'INDUCED EXPRESSION',
    condUninduced: '- L-arabinose',
    condInduced: '+ L-arabinose',
    predicted: 'Predicted: {0} ({1}% confidence)',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    optimalFinder: 'Optimal Variant Finder (Random Search)',
    minMutations: 'Min mutations',
    maxMutations: 'Max mutations',
    variantsToFind: 'Variants to find (max 10)',
    bindingSites: 'Binding sites',
    randomAnySite: 'Random (any site)',
    customPosRange: 'Custom position range',
    posRangePlaceholder: 'e.g. 30-45, 50-200',
    uninducedShort: 'Uninduced',
    lowExprConf: 'Low expression confidence',
    minMaxRange: 'min 0.5 \u2014 max 1',
    inducedShort: 'Induced',
    highExprConf: 'High expression confidence',
    findOptimal: 'Find Optimal Variants',
    enterRange: 'Enter a position range or disable custom range.',
    negPositions: 'Negative positions not allowed.',
    invalidRange: 'Invalid range format. Use e.g. 30-45, 50-200.',
    noPositions: 'No valid positions selected.',
    findingOptimal: 'Finding optimal variants...',
    noOptimalFound: 'No optimal variants found. Please select a less restrictive configuration (more positions, lower thresholds, wider mutation range).',
    notAllVariants: 'Could not find all requested variants. Try limiting the variant range (fewer positions or mutations) for a faster search.',
    unindLow: 'Unind Low',
    indHigh: 'Ind High',
    previousSearches: 'Previous searches',
    search: 'Search',
    enterMutation: 'Enter at least one mutation.',
    formatHint: 'use format like A81T',
    posOutOfRange: 'position out of range ({0}-{1})',
    expectedFound: 'expected {0} at position {1}, found {2}',
    modelLoadError: 'Failed to load one or both models. Check console for details.',
    predictionFailed: 'Prediction failed. Check console.',
    mutationSingle: 'mutation',
    mutationPlural: 'mutations',
    license: '\u00a9 2026 Aruize. Licensed under the MIT License.',
    disclaimer: '<strong>Disclaimer:</strong> This tool provides computational predictions only and is not a substitute for experimental validation. All predicted outcomes must be verified through laboratory experimentation. Do not treat any predictions as confirmed experimental results.',
  },
  es: {
    title: 'GFP Expression Predictor',
    appTitle: 'Expression Predictor',
    themeDark: 'Modo Oscuro',
    themeLight: 'Modo Claro',
    promoter: 'Promotor',
    promoterBad: 'L-arabinosa (pBAD)',
    promoterRha: 'L-ramnosa (rhaBAD) \u2014 Pr\u00f3ximamente',
    modelStatus: 'Estado del Modelo',
    uninduced: 'NO INDUCIDO (0% L-arabinosa)',
    induced: 'INDUCIDO (0.2% L-arabinosa)',
    sequence: 'Secuencia',
    wildType: 'Secuencia Silvestre',
    clickHint: '(haz clic en una base para mutar o escribe las mutaciones abajo)',
    reset: 'Restablecer',
    mutations: 'Mutaciones',
    mutationPlaceholder: 'ej. A81T, G132C, T229A',
    apply: 'Aplicar',
    batchPrediction: 'Predicci\u00f3n por lotes para m\u00faltiples variantes \u2014 pr\u00f3ximamente',
    mutatedSequence: 'Secuencia Mutada',
    predict: 'Predecir Expresi\u00f3n de GFP',
    results: 'Resultados de la Predicci\u00f3n',
    runningInference: 'Ejecutando inferencia...',
    variants: 'Variantes',
    wildTypeLabel: 'Tipo silvestre',
    uninducedExpr: 'EXPRESI\u00d3N NO INDUCIDA',
    inducedExpr: 'EXPRESI\u00d3N INDUCIDA',
    condUninduced: '- L-arabinosa',
    condInduced: '+ L-arabinosa',
    predicted: 'Predicho: {0} ({1}% confianza)',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    optimalFinder: 'Buscador de Variantes \u00d3ptimas (B\u00fasqueda Aleatoria)',
    minMutations: 'Mutaciones m\u00edn.',
    maxMutations: 'Mutaciones m\u00e1x.',
    variantsToFind: 'Variantes a encontrar (m\u00e1x 10)',
    bindingSites: 'Sitios de uni\u00f3n',
    randomAnySite: 'Aleatorio (cualquier sitio)',
    customPosRange: 'Rango de posici\u00f3n personalizado',
    posRangePlaceholder: 'ej. 30-45, 50-200',
    uninducedShort: 'No inducido',
    lowExprConf: 'Confianza de expresi\u00f3n baja',
    minMaxRange: 'm\u00edn 0.5 \u2014 m\u00e1x 1',
    inducedShort: 'Inducido',
    highExprConf: 'Confianza de expresi\u00f3n alta',
    findOptimal: 'Encontrar Variantes \u00d3ptimas',
    enterRange: 'Introduce un rango de posici\u00f3n o desactiva el rango personalizado.',
    negPositions: 'No se permiten posiciones negativas.',
    invalidRange: 'Formato de rango inv\u00e1lido. Usa ej. 30-45, 50-200.',
    noPositions: 'No se seleccionaron posiciones v\u00e1lidas.',
    findingOptimal: 'Buscando variantes \u00f3ptimas...',
    noOptimalFound: 'No se encontraron variantes \u00f3ptimas. Selecciona una configuraci\u00f3n menos restrictiva (m\u00e1s posiciones, umbrales m\u00e1s bajos, rango de mutaciones m\u00e1s amplio).',
    notAllVariants: 'No se pudieron encontrar todas las variantes solicitadas. Intenta limitar el rango de variantes (menos posiciones o mutaciones) para una b\u00fasqueda m\u00e1s r\u00e1pida.',
    unindLow: 'No inducido Bajo',
    indHigh: 'Inducido Alto',
    previousSearches: 'B\u00fasquedas anteriores',
    search: 'B\u00fasqueda',
    enterMutation: 'Introduce al menos una mutaci\u00f3n.',
    formatHint: 'usa formato como A81T',
    posOutOfRange: 'posici\u00f3n fuera de rango ({0}-{1})',
    expectedFound: 'se esperaba {0} en la posici\u00f3n {1}, se encontr\u00f3 {2}',
    modelLoadError: 'Error al cargar uno o ambos modelos. Revisa la consola para m\u00e1s detalles.',
    predictionFailed: 'Error en la predicci\u00f3n. Revisa la consola.',
    mutationSingle: 'mutaci\u00f3n',
    mutationPlural: 'mutaciones',
    license: '\u00a9 2026 Aruize. Licenciado bajo la Licencia MIT.',
    disclaimer: '<strong>Aviso:</strong> Esta herramienta proporciona solo predicciones computacionales y no sustituye la validaci\u00f3n experimental. Todos los resultados predichos deben ser verificados mediante experimentaci\u00f3n de laboratorio. No trates ninguna predicci\u00f3n como resultados experimentales confirmados.',
  },
  eu: {
    title: 'GFP Expression Predictor',
    appTitle: 'Expression Predictor',
    themeDark: 'Modu Iluna',
    themeLight: 'Modu Argia',
    promoter: 'Promotorea',
    promoterBad: 'L-arabinosa (pBAD)',
    promoterRha: 'L-ramnosa (rhaBAD) \u2014 Laster',
    modelStatus: 'Modeloaren Egoera',
    uninduced: 'INDUZITU GABE (0% L-arabinosa)',
    induced: 'INDUZITUA (0.2% L-arabinosa)',
    sequence: 'Sekuentzia',
    wildType: 'Sekuentzia Basatia',
    clickHint: '(egin klik base batean mutatzeko edo idatzi mutazioak behean)',
    reset: 'Berrezarri',
    mutations: 'Mutazioak',
    mutationPlaceholder: 'adib. A81T, G132C, T229A',
    apply: 'Aplikatu',
    batchPrediction: 'Mutazio sorten iragarpena \u2014 laster',
    mutatedSequence: 'Sekuentzia Mutatua',
    predict: 'GFP Adierazpena Iragarri',
    results: 'Iragarpenaren Emaitzak',
    runningInference: 'Inferentzia exekutatzen...',
    variants: 'Aldaerak',
    wildTypeLabel: 'Sekuentzia basatia',
    uninducedExpr: 'INDUZITU GABEKO ADIERAZPENA',
    inducedExpr: 'INDUZITUKO ADIERAZPENA',
    condUninduced: '- L-arabinosa',
    condInduced: '+ L-arabinosa',
    predicted: 'Iragarpena: {0} ({1}% konfiantza)',
    low: 'Baxua',
    medium: 'Ertaina',
    high: 'Altua',
    optimalFinder: 'Aldaera Optimoen Bilatzailea (Bilaketa Aleatorioa)',
    minMutations: 'Mutazio min.',
    maxMutations: 'Mutazio max.',
    variantsToFind: 'Aurkitzeko aldaerak (gehienez 10)',
    bindingSites: 'Lotura guneak',
    randomAnySite: 'Aleatorioa (edozein gune)',
    customPosRange: 'Posizio-tarte pertsonalizatua',
    posRangePlaceholder: 'adib. 30-45, 50-200',
    uninducedShort: 'Induzitu gabe',
    lowExprConf: 'Adierazpen baxuko konfiantza',
    minMaxRange: 'min 0.5 \u2014 max 1',
    inducedShort: 'Induzitua',
    highExprConf: 'Adierazpen altuko konfiantza',
    findOptimal: 'Aurkitu Aldaera Optimoak',
    enterRange: 'Sartu posizio-tarte bat edo desgaitu tarte pertsonalizatua.',
    negPositions: 'Ez da onartzen posizio negatiborik.',
    invalidRange: 'Tarte formatu baliogabea. Erabili adib. 30-45, 50-200.',
    noPositions: 'Ez da posizio baliogarririk hautatu.',
    findingOptimal: 'Aldaera optimoak bilatzen...',
    noOptimalFound: 'Ez da aldaera optimorik aurkitu. Mesedez, hautatu hain murriztatzailea ez den konfigurazio bat (posizio gehiago, atalase-maila baxuagoak, mutazio-tarte zabalagoa).',
    notAllVariants: 'Ezin izan dira eskatutako aldaera guztiak aurkitu. Saiatu aldera-tartea mugatzen (posizio edo mutazio gutxiago) bilaketa azkarragoa izateko.',
    unindLow: 'Induzitu gabe Baxua',
    indHigh: 'Induzitu Altua',
    previousSearches: 'Aurreko bilaketak',
    search: 'Bilaketa',
    enterMutation: 'Sartu gutxienez mutazio bat.',
    formatHint: 'erabili A81T bezalako formatua',
    posOutOfRange: 'posizioa tartetik kanpo ({0}-{1})',
    expectedFound: '{0} espero zen {1} posizioan, {2} aurkitu da',
    modelLoadError: 'Ezin izan dira modeloak kargatu. Ikusi kontsola xehetasunetarako.',
    predictionFailed: 'Iragarpenak huts egin du. Ikusi kontsola.',
    mutationSingle: 'mutazioa',
    mutationPlural: 'mutazioak',
    license: '\u00a9 2026 Aruize. MIT Lizentziarekin Lizentziatua.',
    disclaimer: '<strong>Oharra:</strong> Tresna honek iragarpen konputazionalak baino ez ditu ematen eta ez du baliozkotze esperimentalaren ordezkoa. Aurreikusitako emaitza guztiak laborategiko esperimentazioaren bidez egiaztatu behar dira. Ez tratatu iragarpenak baieztatutako emaitza esperimental gisa.',
  }
};

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';

function t(key, ...args) {
  const lang = TRANSLATIONS[currentLang];
  let str = lang && lang[key] ? lang[key] : (TRANSLATIONS['en'][key] || key);
  if (args.length > 0) {
    args.forEach((arg, i) => {
      str = str.replace(`{${i}}`, arg);
    });
  }
  return str;
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyLanguage();
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key === 'title') {
      document.title = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    el.value = t(el.dataset.i18nValue);
  });
  document.title = t('title');
  if (typeof themeToggle !== 'undefined' && themeToggle) {
    const theme = getTheme();
    themeToggle.textContent = theme === 'dark' ? t('themeLight') : t('themeDark');
  }
  if (typeof updatePredictButton === 'function') updatePredictButton();
  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = currentLang;
}
