// ── Árbol de Investigación ────────────────────────────────────────────────────
// Cada nodo cuesta recursos (no lucas) y da un efecto permanente.
// Los nodos tienen prerequisitos: se desbloquean solo si sus padres están comprados.
//
// Efectos disponibles:
//   { type: 'global_mult',  value }  → multiplica todos los ingresos
//   { type: 'dept_mult',    dept, value } → multiplica un departamento
//   { type: 'click_mult',   value }  → multiplica ingresos por clic
//   { type: 'res_rate',     value }  → multiplica generación de recursos
//   { type: 'offline_mult', value }  → multiplica ingresos offline (sobre el cap de horas)

const RESEARCH_TREE = [

  // ══════════════════════════════════════════════════════════
  //  RAMA 1: AUTOMATIZACIÓN (IT → código → tickets)
  // ══════════════════════════════════════════════════════════
  {
    id: 'R01', row: 0, col: 0,
    name: 'Scripts básicos',
    icon: '⚙️',
    description: '+10% producción global.',
    requires: [],
    cost: [{ resource: 'codigo', amount: 80 }],
    effect: { type: 'global_mult', value: 1.10 },
  },
  {
    id: 'R02', row: 1, col: 0,
    name: 'Automatización IT',
    icon: '🤖',
    description: '+25% producción de IT.',
    requires: ['R01'],
    cost: [{ resource: 'codigo', amount: 200 }, { resource: 'tickets', amount: 100 }],
    effect: { type: 'dept_mult', dept: 'it', value: 1.25 },
  },
  {
    id: 'R03', row: 2, col: 0,
    name: 'CI/CD Corporativo',
    icon: '🔄',
    description: '+20% producción global.',
    requires: ['R02'],
    cost: [{ resource: 'codigo', amount: 500 }, { resource: 'tickets', amount: 300 }],
    effect: { type: 'global_mult', value: 1.20 },
  },
  {
    id: 'R04', row: 3, col: 0,
    name: 'IA Interna',
    icon: '🧠',
    description: '+50% producción de IT y Freelancer.',
    requires: ['R03'],
    cost: [{ resource: 'codigo', amount: 1200 }, { resource: 'tickets', amount: 800 }],
    effect: { type: 'dept_mult', dept: 'it', value: 1.50 },
  },

  // ══════════════════════════════════════════════════════════
  //  RAMA 2: VENTAS & MARKETING (contratos → campañas)
  // ══════════════════════════════════════════════════════════
  {
    id: 'R05', row: 0, col: 1,
    name: 'Embudo de ventas',
    icon: '🔽',
    description: '+20% producción de Ventas.',
    requires: [],
    cost: [{ resource: 'contratos', amount: 60 }],
    effect: { type: 'dept_mult', dept: 'ventas', value: 1.20 },
  },
  {
    id: 'R06', row: 1, col: 1,
    name: 'Branding corporativo',
    icon: '🎨',
    description: '+25% producción de Marketing.',
    requires: ['R05'],
    cost: [{ resource: 'contratos', amount: 150 }, { resource: 'campanas', amount: 100 }],
    effect: { type: 'dept_mult', dept: 'marketing', value: 1.25 },
  },
  {
    id: 'R07', row: 2, col: 1,
    name: 'Campaña viral',
    icon: '📱',
    description: '+30% producción global.',
    requires: ['R06'],
    cost: [{ resource: 'campanas', amount: 400 }, { resource: 'contratos', amount: 300 }],
    effect: { type: 'global_mult', value: 1.30 },
  },
  {
    id: 'R08', row: 3, col: 1,
    name: 'Expansión de mercado',
    icon: '🌎',
    description: '+50% producción de Ventas y Marketing.',
    requires: ['R07'],
    cost: [{ resource: 'campanas', amount: 900 }, { resource: 'acuerdos', amount: 200 }],
    effect: { type: 'dept_mult', dept: 'marketing', value: 1.50 },
  },

  // ══════════════════════════════════════════════════════════
  //  RAMA 3: GESTIÓN & FINANZAS (reportes → estrategias)
  // ══════════════════════════════════════════════════════════
  {
    id: 'R09', row: 0, col: 2,
    name: 'Contabilidad ágil',
    icon: '📒',
    description: '+20% producción de Finanzas.',
    requires: [],
    cost: [{ resource: 'reportes', amount: 50 }],
    effect: { type: 'dept_mult', dept: 'finanzas', value: 1.20 },
  },
  {
    id: 'R10', row: 1, col: 2,
    name: 'Planificación estratégica',
    icon: '♟️',
    description: '+25% producción de Dirección.',
    requires: ['R09'],
    cost: [{ resource: 'reportes', amount: 150 }, { resource: 'estrategias', amount: 80 }],
    effect: { type: 'dept_mult', dept: 'direccion', value: 1.25 },
  },
  {
    id: 'R11', row: 2, col: 2,
    name: 'Auditoría de procesos',
    icon: '🔍',
    description: '×2 velocidad de generación de recursos.',
    requires: ['R10'],
    cost: [{ resource: 'reportes', amount: 400 }, { resource: 'documentos', amount: 250 }],
    effect: { type: 'res_rate', value: 2.0 },
  },
  {
    id: 'R12', row: 3, col: 2,
    name: 'Holding corporativo',
    icon: '🏦',
    description: '+40% producción global.',
    requires: ['R11'],
    cost: [{ resource: 'estrategias', amount: 600 }, { resource: 'proyectos', amount: 300 }],
    effect: { type: 'global_mult', value: 1.40 },
  },

  // ══════════════════════════════════════════════════════════
  //  RAMA 4: TALENTO (cvs → documentos)
  // ══════════════════════════════════════════════════════════
  {
    id: 'R13', row: 0, col: 3,
    name: 'Onboarding exprés',
    icon: '🚀',
    description: '+20% producción de RRHH.',
    requires: [],
    cost: [{ resource: 'cvs', amount: 60 }],
    effect: { type: 'dept_mult', dept: 'rrhh', value: 1.20 },
  },
  {
    id: 'R14', row: 1, col: 3,
    name: 'Marco legal sólido',
    icon: '⚖️',
    description: '+25% producción de Legal.',
    requires: ['R13'],
    cost: [{ resource: 'cvs', amount: 150 }, { resource: 'documentos', amount: 100 }],
    effect: { type: 'dept_mult', dept: 'legal', value: 1.25 },
  },
  {
    id: 'R15', row: 2, col: 3,
    name: 'Cultura corporativa',
    icon: '🎯',
    description: '+2× ingresos por clic.',
    requires: ['R14'],
    cost: [{ resource: 'cvs', amount: 350 }, { resource: 'documentos', amount: 250 }],
    effect: { type: 'click_mult', value: 2.0 },
  },
  {
    id: 'R16', row: 3, col: 3,
    name: 'Sede insignia',
    icon: '🏢',
    description: '+50% producción de Sede Central.',
    requires: ['R15'],
    cost: [{ resource: 'proyectos', amount: 400 }, { resource: 'acuerdos', amount: 300 }],
    effect: { type: 'dept_mult', dept: 'sede', value: 1.50 },
  },

  // ══════════════════════════════════════════════════════════
  //  NODOS CRUCE (requieren 2 ramas)
  // ══════════════════════════════════════════════════════════
  {
    id: 'R17', row: 4, col: 1,
    name: 'Sinergia Tech-Ventas',
    icon: '🤝',
    description: '+50% producción global.',
    requires: ['R04', 'R08'],
    cost: [{ resource: 'codigo', amount: 800 }, { resource: 'campanas', amount: 600 }, { resource: 'acuerdos', amount: 400 }],
    effect: { type: 'global_mult', value: 1.50 },
  },
  {
    id: 'R18', row: 4, col: 2,
    name: 'Empresa 360°',
    icon: '🌐',
    description: '+60% producción global.',
    requires: ['R12', 'R16'],
    cost: [{ resource: 'estrategias', amount: 900 }, { resource: 'proyectos', amount: 700 }, { resource: 'acuerdos', amount: 500 }],
    effect: { type: 'global_mult', value: 1.60 },
  },
];

// ── Lógica ──────────────────────────────────────────────────────────────────

function getResearchNode(id) {
  return RESEARCH_TREE.find(n => n.id === id);
}

// ¿Están todos los requisitos comprados?
function isResearchUnlocked(id, s) {
  const node = getResearchNode(id);
  if (!node) return false;
  return node.requires.every(req => (s.research || []).includes(req));
}

// ¿Se pueden pagar los recursos?
function canAffordResearch(id, s) {
  const node = getResearchNode(id);
  if (!node) return false;
  return node.cost.every(c => (s.resources[c.resource] || 0) >= c.amount);
}

// Investiga un nodo: descuenta recursos y lo marca como comprado
function buyResearch(id) {
  if ((state.research || []).includes(id)) return;
  if (!isResearchUnlocked(id, state)) return;
  if (!canAffordResearch(id, state)) return;

  const node = getResearchNode(id);
  for (const c of node.cost) {
    state.resources[c.resource] -= c.amount;
  }
  state.research.push(id);
  state.moneyPerSecond = calculateIncome(state);

  ui.renderResearch();
  ui.renderResources();
  ui.updateHeader();
  checkAchievements(state);
  addNews(`🔬 Investigación completada: ${node.name}`);
}

// Multiplicador global de investigación
function getResearchGlobalMult(s) {
  let mult = 1;
  for (const id of (s.research || [])) {
    const node = getResearchNode(id);
    if (node && node.effect.type === 'global_mult') mult *= node.effect.value;
  }
  return mult;
}

// Multiplicador de departamento por investigación
function getResearchDeptMult(deptId, s) {
  let mult = 1;
  for (const id of (s.research || [])) {
    const node = getResearchNode(id);
    if (node && node.effect.type === 'dept_mult' && node.effect.dept === deptId) {
      mult *= node.effect.value;
    }
  }
  return mult;
}

// Multiplicador de clic por investigación
function getResearchClickMult(s) {
  let mult = 1;
  for (const id of (s.research || [])) {
    const node = getResearchNode(id);
    if (node && node.effect.type === 'click_mult') mult *= node.effect.value;
  }
  return mult;
}

// Multiplicador de velocidad de recursos por investigación
function getResearchResMult(s) {
  let mult = 1;
  for (const id of (s.research || [])) {
    const node = getResearchNode(id);
    if (node && node.effect.type === 'res_rate') mult *= node.effect.value;
  }
  return mult;
}
