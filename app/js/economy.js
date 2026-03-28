const PRICE_MULTIPLIER = 1.15;

// ── Formateadores ────────────────────────────────────────────

function formatNum(n) {
  if (!isFinite(n) || n < 0) return '0';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return (n / 1e9).toFixed(2)  + 'B';
  if (n >= 1e6)  return (n / 1e6).toFixed(2)  + 'M';
  if (n >= 1e3)  return (n / 1e3).toFixed(2)  + 'k';
  if (n >= 1)    return Math.floor(n).toString();
  if (n > 0)     return n.toFixed(2);
  return '0';
}

function formatLucas(n) {
  if (!isFinite(n) || n < 0) n = 0;
  const suffix = (Math.floor(n) === 1 && n < 2) ? 'luca' : 'lucas';
  return formatNum(n) + ' ' + suffix;
}

// ── Precios ──────────────────────────────────────────────────

function getDeptPrice(dept, quantity) {
  return Math.ceil(dept.basePrice * Math.pow(PRICE_MULTIPLIER, quantity));
}

// ── Multiplicadores ──────────────────────────────────────────

function getDeptMultiplier(deptId, purchasedUpgrades) {
  let mult = 1;
  for (const upg of UPGRADES_DATA) {
    if (
      purchasedUpgrades.includes(upg.id) &&
      upg.effect.type === 'dept_multiplier' &&
      upg.effect.target === deptId
    ) {
      mult *= upg.effect.value;
    }
  }
  return mult;
}

function getGlobalMultiplier(purchasedUpgrades) {
  let mult = 1;
  for (const upg of UPGRADES_DATA) {
    if (purchasedUpgrades.includes(upg.id) && upg.effect.type === 'global_multiplier') {
      mult *= upg.effect.value;
    }
  }
  return mult;
}

function getClickMultiplier(purchasedUpgrades) {
  let mult = 1;
  for (const upg of UPGRADES_DATA) {
    if (purchasedUpgrades.includes(upg.id) && upg.effect.type === 'click_multiplier') {
      mult *= upg.effect.value;
    }
  }
  return mult;
}

// ── Cálculo de ingresos ──────────────────────────────────────

function calculateIncome(s) {
  const globalMult    = getGlobalMultiplier(s.upgrades);
  const prestigeMult  = 1 + ((s.prestigeShares || 0) * 0.05);
  const researchGlob  = getResearchGlobalMult(s);
  let total = 0;
  for (const dept of DEPARTMENTS) {
    const qty = s.departments[dept.id] || 0;
    if (qty > 0) {
      total += qty * dept.baseProduction
             * getDeptMultiplier(dept.id, s.upgrades)
             * getExpandMult(dept.id, s)
             * getResearchDeptMult(dept.id, s);
    }
  }
  return total * globalMult * researchGlob * prestigeMult;
}

function calculateClickIncome(s) {
  const prestigeMult = 1 + ((s.prestigeShares || 0) * 0.05);
  return s.moneyPerClick * getClickMultiplier(s.upgrades) * getResearchClickMult(s) * prestigeMult;
}
