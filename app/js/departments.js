// Definición de los 10 departamentos del juego
const DEPARTMENTS = [
  {
    id: 'freelancer',
    name: 'Freelancer',
    icon: '🧑‍💻',
    description: 'Tú mismo, solo ante el teclado.',
    basePrice: 10,
    baseProduction: 0.1,
  },
  {
    id: 'ventas',
    name: 'Ventas',
    icon: '🤝',
    description: 'Cierra tratos con clientes.',
    basePrice: 100,
    baseProduction: 0.5,
  },
  {
    id: 'rrhh',
    name: 'RRHH',
    icon: '👥',
    description: 'Contrata gente, mejora productividad.',
    basePrice: 500,
    baseProduction: 2,
  },
  {
    id: 'it',
    name: 'IT',
    icon: '💻',
    description: 'Automatiza procesos internos.',
    basePrice: 2000,
    baseProduction: 10,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📣',
    description: 'Atrae más clientes.',
    basePrice: 8000,
    baseProduction: 40,
  },
  {
    id: 'finanzas',
    name: 'Finanzas',
    icon: '💵',
    description: 'Optimiza los flujos de caja.',
    basePrice: 30000,
    baseProduction: 150,
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: '⚖️',
    description: 'Protege contratos, evita multas.',
    basePrice: 100000,
    baseProduction: 500,
  },
  {
    id: 'direccion',
    name: 'Dirección',
    icon: '🏛️',
    description: 'Coordina toda la empresa.',
    basePrice: 400000,
    baseProduction: 2000,
  },
  {
    id: 'sede',
    name: 'Sede Central',
    icon: '🏢',
    description: 'Oficina de lujo, marca empleadora.',
    basePrice: 1500000,
    baseProduction: 7500,
  },
  {
    id: 'multinacional',
    name: 'Multinacional',
    icon: '🌍',
    description: 'Expansión global.',
    basePrice: 10000000,
    baseProduction: 30000,
  },
];

// ── Expansión de departamentos ────────────────────────────────────────────
// Cap de unidades por nivel de expansión
const DEPT_CAPS      = [25, 50, 100, 200];
const EXPAND_MAX_LV  = 3;

// Multiplicador de producción del DPTO al alcanzar ese nivel de expansión
// índice = nivel de expansión actual (0 = sin expandir)
const EXPAND_MULT      = [1, 1.5, 2.5, 4.0];

// Multiplicadores de precio de expansión sobre el precio base del dept
const EXPAND_COST_MULT = [0, 50, 200, 800]; // índice = nivel al que sube

function getDeptCap(deptId, s) {
  const lv = (s.deptExpansions && s.deptExpansions[deptId]) || 0;
  return DEPT_CAPS[lv];
}

function getExpandMult(deptId, s) {
  const lv = (s.deptExpansions && s.deptExpansions[deptId]) || 0;
  return EXPAND_MULT[lv];
}

function getExpandCost(dept, currentLevel) {
  if (currentLevel >= EXPAND_MAX_LV) return Infinity;
  return Math.floor(dept.basePrice * EXPAND_COST_MULT[currentLevel + 1]);
}

function buyDepartment(deptId) {
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  if (!dept) return;

  const qty = state.departments[deptId];
  const cap = getDeptCap(deptId, state);
  if (qty >= cap) return;

  const price = getDeptPrice(dept, qty);
  if (state.money < price) return;

  state.money -= price;
  state.departments[deptId]++;
  state.moneyPerSecond = calculateIncome(state);

  ui.renderDepartments();
  ui.renderUpgrades();
  ui.updateHeader();
  checkAchievements(state);
}

function buyExpansion(deptId) {
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  if (!dept) return;

  const currentLv = (state.deptExpansions[deptId] || 0);
  if (currentLv >= EXPAND_MAX_LV) return;

  // Solo se puede expandir cuando el departamento está al tope
  const qty = state.departments[deptId];
  const cap = getDeptCap(deptId, state);
  if (qty < cap) return;

  const cost = getExpandCost(dept, currentLv);
  if (state.money < cost) return;

  state.money -= cost;
  state.deptExpansions[deptId] = currentLv + 1;

  const newCap  = getDeptCap(deptId, state);
  const newMult = EXPAND_MULT[currentLv + 1];
  state.moneyPerSecond = calculateIncome(state);
  ui.renderDepartments();
  ui.updateHeader();
  checkAchievements(state);
  addNews(`🔓 ${dept.name} expandido → hasta ${newCap} unidades · producción ×${newMult.toFixed(1)}`);
}
