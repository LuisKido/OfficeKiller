// ── Pool de misiones ─────────────────────────────────────────────────────────
// Tier 1: disponibles desde el inicio
// Tier 2: se desbloquean con totalEarned >= 5.000
// Tier 3: se desbloquean con totalEarned >= 200.000
const MISSIONS_POOL = [

  // ── TIER 1 ───────────────────────────────────────────────────────────────
  {
    id: 'M01', tier: 1,
    name: 'Primer Sprint',
    description: 'El equipo necesita entregar algo. Ponete a trabajar y genera código.',
    requirements: [{ resource: 'codigo', amount: 50 }],
    reward: 200,
  },
  {
    id: 'M02', tier: 1,
    name: 'El primer cliente',
    description: 'Ventas consiguió una reunión. Formaliza los contratos antes de que se arrepientan.',
    requirements: [{ resource: 'contratos', amount: 30 }],
    reward: 400,
  },
  {
    id: 'M03', tier: 1,
    name: 'Cartera de talentos',
    description: 'RRHH necesita candidatos antes del congelo de contrataciones.',
    requirements: [{ resource: 'cvs', amount: 40 }],
    reward: 600,
  },
  {
    id: 'M04', tier: 1,
    name: 'Apaga el incendio',
    description: 'IT tiene una fila de tickets sin resolver. Ahh, el clásico lunes.',
    requirements: [{ resource: 'tickets', amount: 50 }],
    reward: 800,
  },
  {
    id: 'M05', tier: 1,
    name: 'Campaña de lanzamiento',
    description: 'Marketing quiere hacer ruido. Necesita campañas listas para mañana.',
    requirements: [{ resource: 'campanas', amount: 25 }],
    reward: 1000,
  },
  {
    id: 'M06', tier: 1,
    name: 'Cierre de mes',
    description: 'Finanzas necesita reportes para cerrar el mes. No vale inventarlos.',
    requirements: [{ resource: 'reportes', amount: 20 }],
    reward: 1200,
  },
  {
    id: 'M07', tier: 1,
    name: 'Propuesta técnica + comercial',
    description: 'El cliente quiere ver código real y un contrato firmado.',
    requirements: [{ resource: 'codigo', amount: 80 }, { resource: 'contratos', amount: 40 }],
    reward: 2500,
  },
  {
    id: 'M08', tier: 1,
    name: 'Papeleo de incorporación',
    description: 'Legal necesita los documentos antes de que el nuevo entre el lunes.',
    requirements: [{ resource: 'documentos', amount: 30 }],
    reward: 3000,
  },

  // ── TIER 2 ───────────────────────────────────────────────────────────────
  {
    id: 'M09', tier: 2,
    name: 'Auditoría interna',
    description: 'Alguien externo va a revisar los libros. Reportes y documentos impecables.',
    requirements: [{ resource: 'reportes', amount: 80 }, { resource: 'documentos', amount: 60 }],
    reward: 12000,
  },
  {
    id: 'M10', tier: 2,
    name: 'App corporativa',
    description: 'El CEO vio una app en una conferencia. Ahora quiere una igual. Para ayer.',
    requirements: [{ resource: 'tickets', amount: 100 }, { resource: 'codigo', amount: 150 }],
    reward: 20000,
  },
  {
    id: 'M11', tier: 2,
    name: 'Expansión de cartera',
    description: 'El equipo de ventas llenó la pipeline. Entrega todos los contratos.',
    requirements: [{ resource: 'contratos', amount: 120 }],
    reward: 15000,
  },
  {
    id: 'M12', tier: 2,
    name: 'Plan estratégico anual',
    description: 'Dirección necesita las estrategias antes de la reunión de directorio.',
    requirements: [{ resource: 'estrategias', amount: 40 }],
    reward: 25000,
  },
  {
    id: 'M13', tier: 2,
    name: 'Reclutamiento masivo',
    description: 'La empresa crece. RRHH necesita CVs y Dirección un plan.',
    requirements: [{ resource: 'cvs', amount: 150 }, { resource: 'estrategias', amount: 30 }],
    reward: 35000,
  },
  {
    id: 'M14', tier: 2,
    name: 'Campaña multicanal',
    description: 'Marketing quiere estar en todos lados al mismo tiempo.',
    requirements: [{ resource: 'campanas', amount: 100 }, { resource: 'contratos', amount: 80 }],
    reward: 40000,
  },
  {
    id: 'M15', tier: 2,
    name: 'Reestructuración',
    description: 'El restructuring exige nuevas estrategias y reportes sólidos.',
    requirements: [{ resource: 'estrategias', amount: 60 }, { resource: 'reportes', amount: 100 }],
    reward: 55000,
  },
  {
    id: 'M16', tier: 2,
    name: 'Blindaje legal',
    description: 'Los abogados quieren documentos. Muchos. Sin excusas.',
    requirements: [{ resource: 'documentos', amount: 120 }, { resource: 'reportes', amount: 80 }],
    reward: 70000,
  },

  // ── TIER 3 ───────────────────────────────────────────────────────────────
  {
    id: 'M17', tier: 3,
    name: 'Proyecto insignia',
    description: 'La sede lanzará su proyecto más ambicioso. Todo el equipo movilizado.',
    requirements: [{ resource: 'proyectos', amount: 30 }, { resource: 'estrategias', amount: 80 }],
    reward: 200000,
  },
  {
    id: 'M18', tier: 3,
    name: 'Acuerdo internacional',
    description: 'La multinacional cerró algo grande. Contratos y acuerdos ratificados.',
    requirements: [{ resource: 'acuerdos', amount: 40 }, { resource: 'contratos', amount: 200 }],
    reward: 350000,
  },
  {
    id: 'M19', tier: 3,
    name: 'Preparación IPO',
    description: 'La empresa va a cotizar en bolsa. Proyectos, acuerdos y reportes impecables.',
    requirements: [
      { resource: 'acuerdos', amount: 25 },
      { resource: 'proyectos', amount: 60 },
      { resource: 'reportes', amount: 200 },
    ],
    reward: 600000,
  },
  {
    id: 'M20', tier: 3,
    name: 'Superapp',
    description: 'IT quiere construir la próxima superapp. Tickets, código y proyectos.',
    requirements: [
      { resource: 'tickets', amount: 300 },
      { resource: 'codigo', amount: 400 },
      { resource: 'proyectos', amount: 20 },
    ],
    reward: 500000,
  },
  {
    id: 'M21', tier: 3,
    name: 'Fusión corporativa',
    description: 'Se viene una fusión. Acuerdos y estrategias en perfecto orden.',
    requirements: [{ resource: 'acuerdos', amount: 60 }, { resource: 'estrategias', amount: 150 }],
    reward: 800000,
  },
  {
    id: 'M22', tier: 3,
    name: 'Expansión continental',
    description: 'La multinacional entra a tres mercados nuevos esta semana.',
    requirements: [{ resource: 'acuerdos', amount: 80 }, { resource: 'proyectos', amount: 100 }],
    reward: 1200000,
  },
  {
    id: 'M23', tier: 3,
    name: 'Megacampaña global',
    description: 'Marketing y la multinacional juntos. El ruido se escucha en otro continente.',
    requirements: [{ resource: 'campanas', amount: 200 }, { resource: 'acuerdos', amount: 50 }],
    reward: 1000000,
  },
  {
    id: 'M24', tier: 3,
    name: 'Cumbre ejecutiva',
    description: 'Dirección organiza la cumbre del año. Todo tiene que estar listo.',
    requirements: [
      { resource: 'estrategias', amount: 100 },
      { resource: 'proyectos', amount: 80 },
      { resource: 'acuerdos', amount: 40 },
    ],
    reward: 1500000,
  },
  {
    id: 'M25', tier: 3,
    name: 'Conquista total',
    description: 'La empresa domina el mercado. Demostrá que tenés todo.',
    requirements: [
      { resource: 'acuerdos', amount: 150 },
      { resource: 'proyectos', amount: 150 },
      { resource: 'estrategias', amount: 150 },
    ],
    reward: 5000000,
  },
];

// totalEarned mínimo para desbloquear cada tier
const TIER_UNLOCK = { 1: 0, 2: 5000, 3: 200000 };

function getMissionById(id) {
  return MISSIONS_POOL.find(m => m.id === id);
}

function canCompleteMission(missionId, s) {
  const mission = getMissionById(missionId);
  if (!mission) return false;
  return mission.requirements.every(req => (s.resources[req.resource] || 0) >= req.amount);
}

// Rellena activeMissions hasta 3 con misiones disponibles del pool
function refreshMissions(s) {
  const used = new Set([...s.activeMissions, ...s.completedMissions]);
  const available = MISSIONS_POOL.filter(
    m => !used.has(m.id) && s.totalEarned >= TIER_UNLOCK[m.tier]
  );
  while (s.activeMissions.length < 3 && available.length > 0) {
    s.activeMissions.push(available.shift().id);
  }
}

// Llamada al arrancar (tras loadGame)
function initMissions(s) {
  refreshMissions(s);
}

// ── Acción del jugador ────────────────────────────────────────────────────────
function completeMission(missionId) {
  if (!state.activeMissions.includes(missionId)) return;
  if (!canCompleteMission(missionId, state)) return;

  const mission = getMissionById(missionId);
  if (!mission) return;

  // Consumir recursos
  for (const req of mission.requirements) {
    state.resources[req.resource] = Math.max(
      0,
      (state.resources[req.resource] || 0) - req.amount
    );
  }

  // Dar recompensa
  state.money       += mission.reward;
  state.totalEarned += mission.reward;

  // Mover a completadas y rellenar slot
  state.activeMissions = state.activeMissions.filter(id => id !== missionId);
  state.completedMissions.push(missionId);
  refreshMissions(state);

  // Actualizar UI
  ui.renderMissions();
  ui.renderResources();
  ui.renderDepartments();
  ui.renderUpgrades();
  ui.updateHeader();
  addNews(`✅ Misión completada: "${mission.name}" — +${formatLucas(mission.reward)}`);
}
