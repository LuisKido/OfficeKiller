// Mejoras únicas que se desbloquean al cumplir condiciones
const UPGRADES_DATA = [
  {
    id: 'U01',
    name: 'Café de la oficina',
    icon: '<i data-lucide="coffee" class="gi"></i>',
    description: '×2 producción de Freelancer.',
    cost: 50,
    condition: (s) => s.departments.freelancer >= 1,
    effect: { type: 'dept_multiplier', target: 'freelancer', value: 2 },
  },
  {
    id: 'U10',
    name: 'Doble monitor',
    icon: '<i data-lucide="monitor" class="gi"></i>',
    description: '×2 ganancias por clic.',
    cost: 200,
    condition: (s) => s.departments.freelancer >= 5,
    effect: { type: 'click_multiplier', target: 'click', value: 2 },
  },
  {
    id: 'U08',
    name: 'Standing desk',
    icon: '<i data-lucide="armchair" class="gi"></i>',
    description: '×3 producción de Freelancer.',
    cost: 500,
    condition: (s) => s.departments.freelancer >= 10,
    effect: { type: 'dept_multiplier', target: 'freelancer', value: 3 },
  },
  {
    id: 'U02',
    name: 'CRM básico',
    icon: '<i data-lucide="bar-chart-2" class="gi"></i>',
    description: '×2 producción de Ventas.',
    cost: 1000,
    condition: (s) => s.departments.ventas >= 10,
    effect: { type: 'dept_multiplier', target: 'ventas', value: 2 },
  },
  {
    id: 'U09',
    name: 'Happy Hour de Ventas',
    icon: '<i data-lucide="beer" class="gi"></i>',
    description: '×2 producción de Ventas.',
    cost: 5000,
    condition: (s) => s.departments.ventas >= 25,
    effect: { type: 'dept_multiplier', target: 'ventas', value: 2 },
  },
  {
    id: 'U03',
    name: 'Onboarding digital',
    icon: '<i data-lucide="clipboard-list" class="gi"></i>',
    description: '×2 producción de RRHH.',
    cost: 5000,
    condition: (s) => s.departments.rrhh >= 10,
    effect: { type: 'dept_multiplier', target: 'rrhh', value: 2 },
  },
  {
    id: 'U04',
    name: 'Servidor propio',
    icon: '<i data-lucide="server" class="gi"></i>',
    description: '×3 producción de IT.',
    cost: 50000,
    condition: (s) => s.departments.it >= 25,
    effect: { type: 'dept_multiplier', target: 'it', value: 3 },
  },
  {
    id: 'U11',
    name: 'Analítica de datos',
    icon: '<i data-lucide="trending-up" class="gi"></i>',
    description: '×2 producción de Marketing.',
    cost: 80000,
    condition: (s) => s.departments.marketing >= 10,
    effect: { type: 'dept_multiplier', target: 'marketing', value: 2 },
  },
  {
    id: 'U05',
    name: 'Campaña viral',
    icon: '<i data-lucide="megaphone" class="gi"></i>',
    description: '×3 producción de Marketing.',
    cost: 400000,
    condition: (s) => s.departments.marketing >= 50,
    effect: { type: 'dept_multiplier', target: 'marketing', value: 3 },
  },
  {
    id: 'U12',
    name: 'Fondo de inversión',
    icon: '<i data-lucide="piggy-bank" class="gi"></i>',
    description: '×2 producción de Finanzas.',
    cost: 500000,
    condition: (s) => s.departments.finanzas >= 10,
    effect: { type: 'dept_multiplier', target: 'finanzas', value: 2 },
  },
  {
    id: 'U06',
    name: 'Auditoría fiscal',
    icon: '<i data-lucide="search" class="gi"></i>',
    description: '×3 producción de Finanzas.',
    cost: 2000000,
    condition: (s) => s.totalEarned >= 100000000,
    effect: { type: 'dept_multiplier', target: 'finanzas', value: 3 },
  },
  {
    id: 'U07',
    name: 'IPO',
    icon: '<i data-lucide="rocket" class="gi"></i>',
    description: '×10 producción global. ¡La empresa cotiza en bolsa!',
    cost: 50000000,
    condition: (s) => s.departments.multinacional >= 5,
    effect: { type: 'global_multiplier', target: 'global', value: 10 },
  },

  // ── Departamentos sin upgrade (Legal, Dirección, Sede, Multinacional) ──
  {
    id: 'U13',
    name: 'Bufete de socios',
    icon: '<i data-lucide="scale" class="gi"></i>',
    description: '×2 producción de Legal.',
    cost: 1500000,
    condition: (s) => s.departments.legal >= 10,
    effect: { type: 'dept_multiplier', target: 'legal', value: 2 },
  },
  {
    id: 'U14',
    name: 'Sala de directorio',
    icon: '<i data-lucide="presentation" class="gi"></i>',
    description: '×2 producción de Dirección.',
    cost: 6000000,
    condition: (s) => s.departments.direccion >= 10,
    effect: { type: 'dept_multiplier', target: 'direccion', value: 2 },
  },
  {
    id: 'U15',
    name: 'Certificación ISO',
    icon: '<i data-lucide="badge-check" class="gi"></i>',
    description: '×3 producción de Sede Central.',
    cost: 25000000,
    condition: (s) => s.departments.sede >= 10,
    effect: { type: 'dept_multiplier', target: 'sede', value: 3 },
  },
  {
    id: 'U16',
    name: 'Adquisición corporativa',
    icon: '<i data-lucide="globe-2" class="gi"></i>',
    description: '×3 producción de Multinacional.',
    cost: 200000000,
    condition: (s) => s.departments.multinacional >= 10,
    effect: { type: 'dept_multiplier', target: 'multinacional', value: 3 },
  },

  // ── Upgrades de clic (progresión) ──
  {
    id: 'U17',
    name: 'Teclado mecánico',
    icon: '<i data-lucide="keyboard" class="gi"></i>',
    description: '×3 ganancias por clic.',
    cost: 2000,
    condition: (s) => s.totalClicks >= 100,
    effect: { type: 'click_multiplier', target: 'click', value: 3 },
  },
  {
    id: 'U18',
    name: 'Setup gamer-office',
    icon: '<i data-lucide="monitor-dot" class="gi"></i>',
    description: '×5 ganancias por clic.',
    cost: 500000,
    condition: (s) => s.totalClicks >= 1000,
    effect: { type: 'click_multiplier', target: 'click', value: 5 },
  },
  {
    id: 'U19',
    name: 'El trono del CEO',
    icon: '<i data-lucide="crown" class="gi"></i>',
    description: '×10 ganancias por clic.',
    cost: 20000000,
    condition: (s) => s.totalClicks >= 5000,
    effect: { type: 'click_multiplier', target: 'click', value: 10 },
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
