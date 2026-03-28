// ── Sistema de Prestige ──────────────────────────────────────────────────────
// Al llegar a 1B lucas (totalEarned), el jugador puede reiniciar a cambio de
// "Acciones" que dan un multiplicador de ingresos permanente.
//
// Fórmula de acciones: floor(sqrt(totalEarned / 1e9))
//   - 1B  lucas → 1 acción   (×1.05)
//   - 4B  lucas → 2 acciones (×1.10)
//   - 9B  lucas → 3 acciones (×1.15)
//   - 25B lucas → 5 acciones (×1.25)
//
// Cada acción da +5% de multiplicador permanente sobre todos los ingresos.

const PRESTIGE_THRESHOLD = 1_000_000_000; // 1B lucas para habilitar el botón

// Devuelve las acciones que se ganarían con el prestige ahora
function getPrestigeSharesToEarn(s) {
  if (s.totalEarned < PRESTIGE_THRESHOLD) return 0;
  return Math.max(1, Math.floor(Math.sqrt(s.totalEarned / 1e9)));
}

// ¿Está disponible el prestige?
function canPrestige(s) {
  return s.totalEarned >= PRESTIGE_THRESHOLD;
}

// Multiplicador total de ingresos por acciones acumuladas
function getPrestigeMultiplier(s) {
  return 1 + ((s.prestigeShares || 0) * 0.05);
}

// Abre el modal de confirmación
function showPrestigeModal() {
  const toEarn  = getPrestigeSharesToEarn(state);
  const newTotal = (state.prestigeShares || 0) + toEarn;
  const newMult  = 1 + newTotal * 0.05;
  document.getElementById('prestige-to-earn').textContent  = toEarn;
  document.getElementById('prestige-new-mult').textContent = '×' + newMult.toFixed(2);
  document.getElementById('prestige-modal').style.display  = 'flex';
}

// Ejecuta el prestige
function performPrestige() {
  if (!canPrestige(state)) return;

  const sharesToAdd = getPrestigeSharesToEarn(state);
  state.prestigeCount++;
  state.prestigeShares      += sharesToAdd;
  state.prestigeSharesTotal += sharesToAdd;

  // ── Resetear progreso ────────────────────────────────────────────────────
  state.money          = 0;
  state.totalEarned    = 0;
  state.moneyPerClick  = 1;
  state.moneyPerSecond = 0;

  for (const dept of DEPARTMENTS) {
    state.departments[dept.id]    = 0;
    state.deptExpansions[dept.id] = 0;
  }
  state.upgrades = [];

  for (const res of RESOURCES) {
    state.resources[res.id] = 0;
  }

  state.activeMissions    = [];
  state.completedMissions = [];

  // Rellenar misiones desde cero
  initMissions(state);
  state.moneyPerSecond = calculateIncome(state);

  saveGame();

  const mult = getPrestigeMultiplier(state);
  addNews(`🌟 ¡Prestige #${state.prestigeCount}! +${sharesToAdd} acción${sharesToAdd !== 1 ? 'es' : ''}. Bono permanente: ×${mult.toFixed(2)}`);

  ui.renderDepartments();
  ui.renderUpgrades();
  ui.renderResources();
  ui.renderMissions();
  ui.renderAchievements();
  ui.updateHeader();
  checkAchievements(state);

  document.getElementById('prestige-modal').style.display = 'none';
}
