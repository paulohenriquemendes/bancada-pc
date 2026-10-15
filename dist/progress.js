// Only accept known case IDs and valid progress from browser storage.
function readProgress(raw, caseData) {
  const clean = { best: {}, current: 0, runs: {} };
  let data;
  try { data = JSON.parse(raw); } catch { return clean; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return clean;
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  const caseKey = key => /^(0|[1-9]\d*)$/.test(key) && Number(key) < caseData.length;
  if (record(data.best)) for (const [key, score] of Object.entries(data.best)) {
    if (caseKey(key) && Number.isInteger(score) && score >= 0 && score <= 1000) clean.best[key] = score;
  }
  if (Number.isInteger(data.current) && data.current >= 0 && data.current < caseData.length) clean.current = data.current;
  if (record(data.runs)) for (const [key, run] of Object.entries(data.runs)) {
    if (!caseKey(key) || !record(run)) continue;
    const c = caseData[Number(key)];
    const indices = (value, length) => Array.isArray(value) ? [...new Set(value.filter(n => Number.isInteger(n) && n >= 0 && n < length))] : [];
    const tests = indices(run.tests, c.tests.length);
    const wrong = indices(run.wrong, c.options.length).filter(n => n !== c.answer);
    const hint = run.hint === true;
    const diagnosed = run.diagnosed === true && tests.length >= 2;
    const solved = run.solved === true && diagnosed;
    clean.runs[key] = {
      tests, wrong, hint, diagnosed, solved,
      penalty: wrong.length * 150 + (hint ? 100 : 0),
      power: solved ? true : Number(key) === 0 ? false : typeof run.power === 'boolean' ? run.power : c.on
    };
  }
  return clean;
}
