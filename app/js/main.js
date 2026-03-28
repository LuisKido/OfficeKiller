const TICK_MS = 100;
let autosaveTimer = 0;

// ── Tab switching para móvil ────────────────────────────────
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ['panel-left', 'panel-right'].forEach(id => {
        document.getElementById(id)
          .classList.toggle('tab-active', id === targetId);
      });
    });
  });
}

// ── Tabs internas del panel derecho ────────────────────────
function initRightTabs() {
  const btns = document.querySelectorAll('.rtab-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.rtab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.rtab).classList.add('active');
    });
  });
}

// Actualiza el badge del tab Empresa (mejoras + misiones completables)
function updateTabBadge() {
  const btn = document.querySelector('.rtab-btn[data-rtab="rtab-empresa"]');
  if (!btn) return;
  const upgradeCount = UPGRADES_DATA.filter(
    u => !state.upgrades.includes(u.id) && u.condition(state)
  ).length;
  const missionCount = state.activeMissions.filter(
    id => canCompleteMission(id, state)
  ).length;
  const count = upgradeCount + missionCount;
  let badge = btn.querySelector('.rtab-badge');
  if (count > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'rtab-badge';
      btn.appendChild(badge);
    }
    badge.textContent = count;
  } else if (badge) {
    badge.remove();
  }
  // Badge antiguo del tab móvil (por si acaso)
  const mobileBtn = document.querySelector('.tab-btn[data-tab="panel-right"]');
  if (!mobileBtn) return;
  let mobileBadge = mobileBtn.querySelector('.tab-badge');
  if (count > 0) {
    if (!mobileBadge) {
      mobileBadge = document.createElement('span');
      mobileBadge.className = 'tab-badge';
      mobileBtn.appendChild(mobileBadge);
    }
    mobileBadge.textContent = count;
  } else if (mobileBadge) {
    mobileBadge.remove();
  }
}

function init() {
  // Cargar partida guardada (calcula progreso offline si aplica)
  const offlineData = loadGame();

  // Inicializar misiones (rellena slots activos)
  initMissions(state);

  // Render inicial
  ui.renderDepartments();
  ui.renderUpgrades();
  ui.renderResources();
  ui.renderMissions();
  ui.renderAchievements();
  ui.renderResearch();
  ui.updateHeader();

  // Banner de progreso offline
  if (offlineData) {
    ui.showOfflineBanner(offlineData.offlineSeconds, offlineData.offlineEarned);
  }

  // Primera noticia de empresa
  addNews('🏢 Bienvenido a la empresa. Eres el único empleado. Por ahora.');
  scheduleNews();
  // Inicializar tabs móvil
  initTabs();
  // Inicializar tabs internas del panel derecho
  initRightTabs();
  // ── Clic en el escritorio ───────────────────────────────
  document.getElementById('desk').addEventListener('click', (e) => {
    const income = calculateClickIncome(state);
    state.money       += income;
    state.totalEarned += income;
    state.totalClicks++;

    ui.updateHeader();
    ui.addFloatingText(e.clientX, e.clientY, '+' + formatLucas(income));
    checkAchievements(state);

    // Animación del icono
    const icon = document.getElementById('desk-icon');
    icon.classList.remove('bounce');
    // Forzar reflow para reiniciar animación si se hace clic rápido
    void icon.offsetWidth;
    icon.classList.add('bounce');
  });

  // ── Botones del header ─────────────────────────────────
  document.getElementById('btn-save').addEventListener('click', () => {
    saveGame();
    addNews('💾 Partida guardada manualmente.');
  });

  document.getElementById('btn-prestige').addEventListener('click', showPrestigeModal);
  document.getElementById('btn-reset').addEventListener('click', resetGame);

  // ── Loop de ingresos (100ms) ───────────────────────────
  setInterval(() => {
    const income = state.moneyPerSecond * (TICK_MS / 1000);
    state.money       += income;
    state.totalEarned += income;
    state.playTimeSeconds += TICK_MS / 1000;
    tickResources(state, TICK_MS / 1000);
    ui.updateHeader();

    autosaveTimer += TICK_MS / 1000;
    if (autosaveTimer >= 30) {
      saveGame();
      autosaveTimer = 0;
    }
  }, TICK_MS);

  // ── Refresco de UI (1s) — recalcula ingresos y re-renderiza ──
  setInterval(() => {
    state.moneyPerSecond = calculateIncome(state);
    ui.renderDepartments();
    ui.renderUpgrades();
    ui.renderResources();
    ui.renderMissions();
    ui.renderResearch();
    checkAchievements(state);
    updateTabBadge();
  }, 1000);

  // Guardar al cerrar pestaña
  window.addEventListener('beforeunload', saveGame);
}

document.addEventListener('DOMContentLoaded', init);
