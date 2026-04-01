const TICK_MS = 100;
let autosaveTimer = 0;

// ── Pre-caché de iconos SVG ─────────────────────────────────
// Renderiza cada icono una sola vez y guarda el SVG resultante.
// Esto evita el parpadeo en re-renders dinámicos: los templates usan
// strings SVG directamente en lugar de <i data-lucide> + createIcons().
const ICON_SVG = {};

function buildIconCache() {
  const tmp = document.createElement('div');
  tmp.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  document.body.appendChild(tmp);

  function render(name, extraClass) {
    const key = extraClass ? name + '|' + extraClass : name;
    if (ICON_SVG[key]) return;
    tmp.innerHTML = `<i data-lucide="${name}" class="gi${extraClass ? ' ' + extraClass : ''}"></i>`;
    lucide.createIcons({ rootNode: tmp });
    const svg = tmp.querySelector('svg');
    ICON_SVG[key] = svg ? svg.outerHTML : '';
  }

  // --- Iconos de los arrays de datos (extraer nombre del HTML almacenado) ---
  const allItems = [
    ...DEPARTMENTS, ...UPGRADES_DATA, ...RESOURCES,
    ...RESEARCH_TREE, ...ACHIEVEMENTS,
  ];
  for (const item of allItems) {
    if (!item.icon) continue;
    const m = item.icon.match(/data-lucide="([^"]+)"/);
    if (!m) continue;
    render(m[1]);
    // Sustituir el string HTML por el SVG pre-renderizado
    item.icon = ICON_SVG[m[1]] || item.icon;
  }

  // --- Iconos hardcodeados en ui.js ---
  [['lock-open'], ['lock'], ['clock'], ['x', 'gi-sm'],
   ['trophy'], ['check', 'gi-sm']].forEach(([n, c]) => render(n, c));

  document.body.removeChild(tmp);
}

// Devuelve el SVG pre-cacheado para uso en templates
function gi(name, extraClass) {
  const key = extraClass ? name + '|' + extraClass : name;
  return ICON_SVG[key] || '';
}

// ── Hold-to-buy en departamentos ────────────────────────────
function initHoldToBuy() {
  const list = document.getElementById('departments-list');
  if (!list) return;

  let holdTimer   = null;
  let repeatTimer = null;
  let activeBtn   = null;

  const stop = () => {
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
    holdTimer = repeatTimer = null;
    if (activeBtn) { activeBtn.classList.remove('holding'); activeBtn = null; }
  };

  list.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    e.preventDefault();

    const action = btn.dataset.action;
    const id     = btn.dataset.id;
    const fire   = () => {
      if (action === 'buy-dept')           buyDepartment(id);
      else if (action === 'buy-expansion') buyExpansion(id);
    };

    stop();
    activeBtn = btn;
    btn.classList.add('holding');
    fire();

    holdTimer = setTimeout(() => {
      repeatTimer = setInterval(fire, 150);
    }, 500);
  });

  document.addEventListener('pointerup',     stop);
  document.addEventListener('pointercancel', stop);
}

// ── Tooltip de recursos ────────────────────────────────────
function initResTooltip() {
  const tip = document.getElementById('res-tooltip');
  const bar = document.getElementById('resource-bar');
  if (!tip || !bar) return;

  document.addEventListener('mousemove', (e) => {
    const icon = e.target.closest('[data-tooltip]');
    if (!icon) { tip.style.display = 'none'; return; }

    tip.innerHTML = icon.dataset.tooltip +
      '<span class="tt-rate">' + (icon.dataset.rate || '') + '</span>';
    tip.style.display = 'block';

    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    let x = e.clientX - tw / 2;
    let y = e.clientY - th - 14;
    x = Math.max(8, Math.min(x, window.innerWidth  - tw - 8));
    if (y < 8) y = e.clientY + 20;
    tip.style.left = x + 'px';
    tip.style.top  = y + 'px';
  });

  document.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
}

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

  // Pre-renderizar todos los iconos SVG (elimina parpadeo en re-renders)
  buildIconCache();

  // Render inicial
  ui.renderDepartments();
  ui.renderUpgrades();
  ui.renderResources();
  ui.renderMissions();
  ui.renderAchievements();
  ui.renderResearch();
  ui.updateHeader();
  lucide.createIcons();  // solo para iconos estáticos del HTML

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
  // Tooltip de recursos
  initResTooltip();
  // Hold-to-buy en departamentos
  initHoldToBuy();
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
    // Sin lucide.createIcons(): todos los iconos dinámicos ya son SVG pre-cacheados
  }, 1000);

  // Guardar al cerrar pestaña
  window.addEventListener('beforeunload', saveGame);

  // ── Modal de bienvenida (una sola vez por usuario) ─────
  if (!localStorage.getItem('ok_welcome_seen')) {
    const wm = document.getElementById('welcome-modal');
    wm.style.display = 'flex';
    document.getElementById('btn-welcome-close').addEventListener('click', () => {
      wm.style.display = 'none';
      localStorage.setItem('ok_welcome_seen', '1');
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
