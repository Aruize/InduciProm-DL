const WT_SEQ = "AAGAAACCAATTGTCCATATTGCATCAGACATTGCCGTCACTGCGTCTTTTACTGGCTCTTCTCGCTAACCAAACCGGTAACCCCGCTTATTAAAAGCATTCTGTAACAAAGCGGGACCAAAGCCATGACAAAAACGCGTAACAAAAGTGTCTATAATCACGGCAGAAAAGTCCACATTGATTATTTGCACGGCGTCACACTTTGCTATGCCATAGCATTTTTATCCATAAGATTAGCGGATACTACCTGACG";

const BASES = ['A', 'C', 'G', 'T'];
const BASE_COLORS = { A: 'var(--base-A)', C: 'var(--base-C)', G: 'var(--base-G)', T: 'var(--base-T)' };
const BASE_CLASS = { A: 'base-A', C: 'base-C', G: 'base-G', T: 'base-T' };

let currentSeq = WT_SEQ;
let diffPositions = new Set();
let currentBpr = 50;
const SEQ_OFFSET = 30;
const REGIONS = [
  { name: 'araO2', start: 31, end: 48, color: "#FFD700", label: "araO\u2082" },
  { name: 'Pc', start: 129, end: 209, color: "#48E7EA", label: "Pc" },
  { name: 'araO1', start: 166, end: 209, color: "#C0C0C0", label: "araO\u2081" },
  { name: 'CRP', start: 210, end: 233, color: "#F895FF", label: "CRP" },
  { name: 'araI1', start: 242, end: 260, color: "#90EE90", label: "araI\u2081" },
  { name: 'araI2', start: 263, end: 280, color: "#FF951C", label: "araI\u2082" },
  { name: '35box', start: 277, end: 282, color: "#ADD8E6", label: "-35 box" },
];
const WT_HIDDEN = new Set(['Pc']);
const MUT_HIDDEN = new Set();
let uninducedSession = null;
let inducedSession = null;
let modelsReady = false;
