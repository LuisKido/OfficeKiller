// ── Definición de logros ────────────────────────────────────────────────────
// rarity: 'bronze' | 'silver' | 'gold' | 'diamond'

const ACHIEVEMENTS = [

  // ── DINERO ────────────────────────────────────────────────────────────────
  { id: 'A01', rarity: 'bronze', icon: '<i data-lucide="dollar-sign" class="gi"></i>', name: 'Primer sueldo',
    description: 'Gana 1.000 lucas en total.',
    condition: s => s.totalEarned >= 1000 },
  { id: 'A02', rarity: 'bronze', icon: '<i data-lucide="dollar-sign" class="gi"></i>', name: 'Algo de capital',
    description: 'Gana 10.000 lucas en total.',
    condition: s => s.totalEarned >= 10000 },
  { id: 'A03', rarity: 'silver', icon: '<i data-lucide="dollar-sign" class="gi"></i>', name: '¿Me la puede fiar?',
    description: 'Gana 100.000 lucas en total.',
    condition: s => s.totalEarned >= 100000 },
  { id: 'A04', rarity: 'silver', icon: '<i data-lucide="dollar-sign" class="gi"></i>', name: 'Millonario de papel',
    description: 'Gana 1.000.000 lucas en total.',
    condition: s => s.totalEarned >= 1000000 },
  { id: 'A05', rarity: 'gold', icon: '<i data-lucide="coins" class="gi"></i>', name: 'El Pato Donald',
    description: 'Gana 10.000.000 lucas en total.',
    condition: s => s.totalEarned >= 10000000 },
  { id: 'A06', rarity: 'gold', icon: '<i data-lucide="coins" class="gi"></i>', name: 'El Tío Rico',
    description: 'Gana 100.000.000 lucas en total.',
    condition: s => s.totalEarned >= 100000000 },
  { id: 'A07', rarity: 'diamond', icon: '<i data-lucide="gem" class="gi"></i>', name: 'Modo Dios Fiscal',
    description: 'Gana 1.000.000.000 lucas en total.',
    condition: s => s.totalEarned >= 1000000000 },

  // ── DEPARTAMENTOS — primeras compras ─────────────────────────────────────
  { id: 'A08', rarity: 'bronze', icon: '<i data-lucide="laptop" class="gi"></i>', name: 'Solo ante el teclado',
    description: 'Contrata tu primer Freelancer.',
    condition: s => s.departments.freelancer >= 1 },
  { id: 'A09', rarity: 'bronze', icon: '<i data-lucide="handshake" class="gi"></i>', name: 'Primer cliente',
    description: 'Crea el equipo de Ventas.',
    condition: s => s.departments.ventas >= 1 },
  { id: 'A10', rarity: 'bronze', icon: '<i data-lucide="users" class="gi"></i>', name: 'Recursos humanos™',
    description: 'Abre el departamento de RRHH.',
    condition: s => s.departments.rrhh >= 1 },
  { id: 'A11', rarity: 'bronze', icon: '<i data-lucide="monitor" class="gi"></i>', name: 'El servidor está caído',
    description: 'Crea el departamento de IT.',
    condition: s => s.departments.it >= 1 },
  { id: 'A12', rarity: 'silver', icon: '<i data-lucide="megaphone" class="gi"></i>', name: 'Presencia de marca',
    description: 'Abre el departamento de Marketing.',
    condition: s => s.departments.marketing >= 1 },
  { id: 'A13', rarity: 'silver', icon: '<i data-lucide="banknote" class="gi"></i>', name: 'Flujos de caja',
    description: 'Crea el departamento de Finanzas.',
    condition: s => s.departments.finanzas >= 1 },
  { id: 'A14', rarity: 'silver', icon: '<i data-lucide="scale" class="gi"></i>', name: 'Cláusula 14b',
    description: 'Abre el departamento Legal.',
    condition: s => s.departments.legal >= 1 },
  { id: 'A15', rarity: 'gold', icon: '<i data-lucide="landmark" class="gi"></i>', name: 'C-Level',
    description: 'Crea el departamento de Dirección.',
    condition: s => s.departments.direccion >= 1 },
  { id: 'A16', rarity: 'gold', icon: '<i data-lucide="building-2" class="gi"></i>', name: 'Sede corporativa',
    description: 'Inaugura la Sede Central.',
    condition: s => s.departments.sede >= 1 },
  { id: 'A17', rarity: 'diamond', icon: '<i data-lucide="globe" class="gi"></i>', name: 'Conquista global',
    description: 'Crea tu primera Multinacional.',
    condition: s => s.departments.multinacional >= 1 },

  // ── DEPARTAMENTOS — cantidades ────────────────────────────────────────────
  { id: 'A18', rarity: 'bronze', icon: '<i data-lucide="trending-up" class="gi"></i>', name: 'Equipo pequeño',
    description: 'Alcanza 10 unidades en cualquier departamento.',
    condition: s => Object.values(s.departments).some(q => q >= 10) },
  { id: 'A19', rarity: 'silver', icon: '<i data-lucide="trending-up" class="gi"></i>', name: 'Escalando',
    description: 'Alcanza 25 unidades en cualquier departamento.',
    condition: s => Object.values(s.departments).some(q => q >= 25) },
  { id: 'A20', rarity: 'gold', icon: '<i data-lucide="factory" class="gi"></i>', name: 'Empresa grande',
    description: 'Alcanza 50 unidades en cualquier departamento.',
    condition: s => Object.values(s.departments).some(q => q >= 50) },
  { id: 'A21', rarity: 'diamond', icon: '<i data-lucide="network" class="gi"></i>', name: 'Corporación total',
    description: 'Alcanza 100 unidades en cualquier departamento.',
    condition: s => Object.values(s.departments).some(q => q >= 100) },
  { id: 'A22', rarity: 'silver', icon: '<i data-lucide="building" class="gi"></i>', name: 'Empresa diversificada',
    description: 'Posee al menos 1 unidad de 5 departamentos distintos.',
    condition: s => Object.values(s.departments).filter(q => q >= 1).length >= 5 },
  { id: 'A23', rarity: 'gold', icon: '<i data-lucide="map" class="gi"></i>', name: 'Empresa completa',
    description: 'Posee al menos 1 unidad en todos los departamentos.',
    condition: s => Object.values(s.departments).every(q => q >= 1) },

  // ── EXPANSIÓN ─────────────────────────────────────────────────────────────
  { id: 'A24', rarity: 'bronze', icon: '<i data-lucide="lock-open" class="gi"></i>', name: 'Más espacio',
    description: 'Compra tu primera expansión de departamento.',
    condition: s => Object.values(s.deptExpansions).some(lv => lv >= 1) },
  { id: 'A25', rarity: 'silver', icon: '<i data-lucide="lock-open" class="gi"></i>', name: 'A toda máquina',
    description: 'Compra 5 expansiones en total.',
    condition: s => Object.values(s.deptExpansions).reduce((a, b) => a + b, 0) >= 5 },
  { id: 'A26', rarity: 'gold', icon: '<i data-lucide="lock-open" class="gi"></i>', name: 'Infraestructura sólida',
    description: 'Lleva un departamento al nivel máximo de expansión (3).',
    condition: s => Object.values(s.deptExpansions).some(lv => lv >= 3) },

  // ── MISIONES ─────────────────────────────────────────────────────────────
  { id: 'A27', rarity: 'bronze', icon: '<i data-lucide="clipboard-list" class="gi"></i>', name: 'Primera misión',
    description: 'Completa tu primera misión.',
    condition: s => s.completedMissions.length >= 1 },
  { id: 'A28', rarity: 'bronze', icon: '<i data-lucide="clipboard-list" class="gi"></i>', name: 'Gestor junior',
    description: 'Completa 5 misiones.',
    condition: s => s.completedMissions.length >= 5 },
  { id: 'A29', rarity: 'silver', icon: '<i data-lucide="clipboard-list" class="gi"></i>', name: 'Project Manager',
    description: 'Completa 10 misiones.',
    condition: s => s.completedMissions.length >= 10 },
  { id: 'A30', rarity: 'gold', icon: '<i data-lucide="trophy" class="gi"></i>', name: 'Empresario del año',
    description: 'Completa 25 misiones.',
    condition: s => s.completedMissions.length >= 25 },

  // ── CLICS ─────────────────────────────────────────────────────────────────
  { id: 'A31', rarity: 'bronze', icon: '<i data-lucide="mouse-pointer" class="gi"></i>', name: 'Dale al escritorio',
    description: 'Haz 100 clics.',
    condition: s => s.totalClicks >= 100 },
  { id: 'A32', rarity: 'silver', icon: '<i data-lucide="mouse-pointer" class="gi"></i>', name: 'Clic compulsivo',
    description: 'Haz 1.000 clics.',
    condition: s => s.totalClicks >= 1000 },
  { id: 'A33', rarity: 'gold', icon: '<i data-lucide="mouse-pointer" class="gi"></i>', name: 'Tendinitis laboral',
    description: 'Haz 5.000 clics.',
    condition: s => s.totalClicks >= 5000 },

  // ── TIEMPO JUGADO ─────────────────────────────────────────────────────────
  { id: 'A34', rarity: 'bronze', icon: '<i data-lucide="clock" class="gi"></i>', name: 'Media jornada',
    description: 'Juega durante 30 minutos.',
    condition: s => s.playTimeSeconds >= 1800 },
  { id: 'A35', rarity: 'silver', icon: '<i data-lucide="clock" class="gi"></i>', name: 'Jornada completa',
    description: 'Juega durante 2 horas.',
    condition: s => s.playTimeSeconds >= 7200 },
  { id: 'A36', rarity: 'gold',   icon: '<i data-lucide="clock" class="gi"></i>', name: 'Burn-out',
    description: 'Juega durante 8 horas acumuladas.',
    condition: s => s.playTimeSeconds >= 28800 },

  // ── PRESTIGE ──────────────────────────────────────────────────────────────────
  { id: 'A37', rarity: 'gold',    icon: '<i data-lucide="star" class="gi"></i>', name: 'Primer Rebirth',
    description: 'Haz tu primer prestige.',
    condition: s => (s.prestigeCount || 0) >= 1 },
  { id: 'A38', rarity: 'gold',    icon: '<i data-lucide="star" class="gi"></i>', name: 'Inversor serial',
    description: 'Haz prestige 5 veces.',
    condition: s => (s.prestigeCount || 0) >= 5 },
  { id: 'A39', rarity: 'diamond', icon: '<i data-lucide="sparkles" class="gi"></i>', name: 'Portfolio millonario',
    description: 'Acumula 10 acciones.',
    condition: s => (s.prestigeShares || 0) >= 10 },
];

// ── Lógica ──────────────────────────────────────────────────────────────────

function checkAchievements(s) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS) {
    if (s.achievements.includes(ach.id)) continue;
    try {
      if (ach.condition(s)) {
        s.achievements.push(ach.id);
        newlyUnlocked.push(ach);
      }
    } catch (_) { /* condición aún en estado incompleto */ }
  }
  if (newlyUnlocked.length) {
    newlyUnlocked.forEach(ach => ui.showAchievementToast(ach));
    ui.renderAchievements();
  }
}
