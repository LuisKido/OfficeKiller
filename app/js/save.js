const SAVE_KEY = 'officeKillerSave';

function saveGame() {
  const data = {
    money:             state.money,
    totalEarned:       state.totalEarned,
    moneyPerClick:     state.moneyPerClick,
    departments:       { ...state.departments },
    upgrades:          [...state.upgrades],
    resources:         { ...state.resources },
    activeMissions:    [...state.activeMissions],
    completedMissions: [...state.completedMissions],
    deptExpansions:    { ...state.deptExpansions },
    achievements:      [...state.achievements],
    research:          [...state.research],
    playTimeSeconds:      state.playTimeSeconds,
    totalClicks:          state.totalClicks,
    prestigeCount:        state.prestigeCount,
    prestigeShares:       state.prestigeShares,
    prestigeSharesTotal:  state.prestigeSharesTotal,
    version:              state.version,
    lastSaved:         new Date().toISOString(),
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('No se pudo guardar la partida:', e);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return null;

    // ── Progreso offline ──────────────────────────────────────
    let offlineSeconds = 0;
    let offlineEarned  = 0;

    if (saved.lastSaved) {
      const elapsed = (Date.now() - new Date(saved.lastSaved).getTime()) / 1000;
      offlineSeconds = Math.min(Math.max(elapsed, 0), 8 * 3600);

      if (offlineSeconds > 60) {
        const tempDepts = Object.assign({ ...state.departments }, saved.departments || {});
        const tempState = {
          departments:    tempDepts,
          upgrades:       Array.isArray(saved.upgrades) ? saved.upgrades : [],
          prestigeShares: isFinite(saved.prestigeShares) ? Math.max(0, saved.prestigeShares) : 0,
        };
        const income  = calculateIncome(tempState);
        offlineEarned = income * offlineSeconds;
        saved.money       = (saved.money       || 0) + offlineEarned;
        saved.totalEarned = (saved.totalEarned || 0) + offlineEarned;

        // Recursos offline: acumular hasta el cap
        saved.resources = saved.resources || {};
        for (const res of RESOURCES) {
          const qty = tempDepts[res.dept] || 0;
          if (!qty) continue;
          const cap     = Math.min(2000, 100 + qty * 20);
          const current = saved.resources[res.id] || 0;
          saved.resources[res.id] = Math.min(cap, current + qty * res.ratePerUnit * offlineSeconds);
        }
      }
    }

    // ── Merge con validación ───────────────────────────────────
    state.money           = isFinite(saved.money)           ? Math.max(0, saved.money)           : 0;
    state.totalEarned     = isFinite(saved.totalEarned)     ? Math.max(0, saved.totalEarned)     : 0;
    state.moneyPerClick   = isFinite(saved.moneyPerClick) && saved.moneyPerClick > 0
                              ? saved.moneyPerClick : 1;
    state.playTimeSeconds = isFinite(saved.playTimeSeconds) ? Math.max(0, saved.playTimeSeconds) : 0;
    state.totalClicks     = isFinite(saved.totalClicks)     ? Math.max(0, saved.totalClicks)     : 0;

    // Solo aceptar IDs de mejoras que existen en UPGRADES_DATA
    state.upgrades = Array.isArray(saved.upgrades)
      ? saved.upgrades.filter(id => UPGRADES_DATA.some(u => u.id === id))
      : [];

    // Solo mergear claves de departamentos conocidos
    for (const dept of DEPARTMENTS) {
      const qty = saved.departments && saved.departments[dept.id];
      state.departments[dept.id] = (isFinite(qty) && qty >= 0) ? Math.floor(qty) : 0;
    }

    // Recursos
    for (const res of RESOURCES) {
      const val = saved.resources && saved.resources[res.id];
      const n   = parseFloat(val);
      state.resources[res.id] = (isFinite(n) && n >= 0) ? n : 0;
    }

    // Misiones — solo IDs válidos del pool
    state.activeMissions = Array.isArray(saved.activeMissions)
      ? saved.activeMissions.filter(id => MISSIONS_POOL.some(m => m.id === id))
      : [];
    state.completedMissions = Array.isArray(saved.completedMissions)
      ? saved.completedMissions.filter(id => MISSIONS_POOL.some(m => m.id === id))
      : [];

    // Expansiones de departamentos
    for (const dept of DEPARTMENTS) {
      const lv = saved.deptExpansions && saved.deptExpansions[dept.id];
      state.deptExpansions[dept.id] = (isFinite(lv) && lv >= 0) ? Math.min(3, Math.floor(lv)) : 0;
    }

    // Logros — solo IDs válidos
    state.achievements = Array.isArray(saved.achievements)
      ? saved.achievements.filter(id => ACHIEVEMENTS.some(a => a.id === id))
      : [];

    // Investigación — solo IDs válidos (persiste entre prestiges)
    state.research = Array.isArray(saved.research)
      ? saved.research.filter(id => RESEARCH_TREE.some(n => n.id === id))
      : [];

    // Prestige
    state.prestigeCount       = (isFinite(saved.prestigeCount)       && saved.prestigeCount       >= 0) ? Math.floor(saved.prestigeCount)       : 0;
    state.prestigeShares      = (isFinite(saved.prestigeShares)      && saved.prestigeShares      >= 0) ? Math.floor(saved.prestigeShares)      : 0;
    state.prestigeSharesTotal = (isFinite(saved.prestigeSharesTotal) && saved.prestigeSharesTotal >= 0) ? Math.floor(saved.prestigeSharesTotal) : 0;

    state.moneyPerSecond = calculateIncome(state);

    return offlineSeconds > 60 ? { offlineSeconds, offlineEarned } : null;

  } catch (e) {
    console.warn('No se pudo cargar la partida:', e);
    return null;
  }
}

function resetGame() {
  if (!confirm('¿Seguro que quieres reiniciar? Perderás todo el progreso.')) return;
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}
