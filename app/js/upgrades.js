// Mejoras únicas que se desbloquean al cumplir condiciones
const UPGRADES_DATA = [
  {
    id: 'U01',
    name: 'Café de la oficina',
    icon: '☕',
    description: '×2 producción de Freelancer.',
    cost: 50,
    condition: (s) => s.departments.freelancer >= 1,
    effect: { type: 'dept_multiplier', target: 'freelancer', value: 2 },
  },
  {
    id: 'U10',
    name: 'Doble monitor',
    icon: '🖥️',
    description: '×2 ganancias por clic.',
    cost: 200,
    condition: (s) => s.departments.freelancer >= 5,
    effect: { type: 'click_multiplier', target: 'click', value: 2 },
  },
  {
    id: 'U08',
    name: 'Standing desk',
    icon: '🪑',
    description: '×3 producción de Freelancer.',
    cost: 500,
    condition: (s) => s.departments.freelancer >= 10,
    effect: { type: 'dept_multiplier', target: 'freelancer', value: 3 },
  },
  {
    id: 'U02',
    name: 'CRM básico',
    icon: '📊',
    description: '×2 producción de Ventas.',
    cost: 1000,
    condition: (s) => s.departments.ventas >= 10,
    effect: { type: 'dept_multiplier', target: 'ventas', value: 2 },
  },
  {
    id: 'U09',
    name: 'Happy Hour de Ventas',
    icon: '🍻',
    description: '×2 producción de Ventas.',
    cost: 5000,
    condition: (s) => s.departments.ventas >= 25,
    effect: { type: 'dept_multiplier', target: 'ventas', value: 2 },
  },
  {
    id: 'U03',
    name: 'Onboarding digital',
    icon: '📋',
    description: '×2 producción de RRHH.',
    cost: 5000,
    condition: (s) => s.departments.rrhh >= 10,
    effect: { type: 'dept_multiplier', target: 'rrhh', value: 2 },
  },
  {
    id: 'U04',
    name: 'Servidor propio',
    icon: '🖧',
    description: '×3 producción de IT.',
    cost: 50000,
    condition: (s) => s.departments.it >= 25,
    effect: { type: 'dept_multiplier', target: 'it', value: 3 },
  },
  {
    id: 'U11',
    name: 'Analítica de datos',
    icon: '📈',
    description: '×2 producción de Marketing.',
    cost: 80000,
    condition: (s) => s.departments.marketing >= 10,
    effect: { type: 'dept_multiplier', target: 'marketing', value: 2 },
  },
  {
    id: 'U05',
    name: 'Campaña viral',
    icon: '📣',
    description: '×3 producción de Marketing.',
    cost: 400000,
    condition: (s) => s.departments.marketing >= 50,
    effect: { type: 'dept_multiplier', target: 'marketing', value: 3 },
  },
  {
    id: 'U12',
    name: 'Fondo de inversión',
    icon: '💰',
    description: '×2 producción de Finanzas.',
    cost: 500000,
    condition: (s) => s.departments.finanzas >= 10,
    effect: { type: 'dept_multiplier', target: 'finanzas', value: 2 },
  },
  {
    id: 'U06',
    name: 'Auditoría fiscal',
    icon: '🔍',
    description: '×3 producción de Finanzas.',
    cost: 2000000,
    condition: (s) => s.totalEarned >= 100000000,
    effect: { type: 'dept_multiplier', target: 'finanzas', value: 3 },
  },
  {
    id: 'U07',
    name: 'IPO',
    icon: '🚀',
    description: '×10 producción global. ¡La empresa cotiza en bolsa!',
    cost: 50000000,
    condition: (s) => s.departments.multinacional >= 5,
    effect: { type: 'global_multiplier', target: 'global', value: 10 },
  },
];

function buyUpgrade(upgradeId) {
  const upg = UPGRADES_DATA.find(u => u.id === upgradeId);
  if (!upg) return;
  if (state.upgrades.includes(upgradeId)) return;
  if (state.money < upg.cost) return;

  state.money -= upg.cost;
  state.upgrades.push(upgradeId);
  state.moneyPerSecond = calculateIncome(state);

  ui.renderDepartments();
  ui.renderUpgrades();
  ui.updateHeader();
  addNews(`✅ Mejora desbloqueada: ${upg.name}`);
}
