const ui = {

  // ── Header ────────────────────────────────────────────────
  updateHeader() {
    document.getElementById('balance-display').textContent = formatLucas(state.money);
    document.getElementById('income-display').textContent  = formatLucas(state.moneyPerSecond) + '/s';
    document.getElementById('total-display').textContent   = formatLucas(state.totalEarned);
    document.getElementById('click-income').textContent    = '+' + formatLucas(calculateClickIncome(state));

    // Prestige: muestra/oculta botón y stat de acciones
    const prestigeBtn  = document.getElementById('btn-prestige');
    const prestigeStat = document.getElementById('prestige-stat');
    if (prestigeBtn)  prestigeBtn.style.display  = canPrestige(state) ? '' : 'none';
    if (prestigeStat) {
      prestigeStat.style.display = state.prestigeShares > 0 ? '' : 'none';
      const el = document.getElementById('prestige-mult-display');
      if (el) el.textContent = '×' + getPrestigeMultiplier(state).toFixed(2);
    }
  },

  // ── Departamentos ─────────────────────────────────────────
  renderDepartments() {
    const container  = document.getElementById('departments-list');
    const globalMult = getGlobalMultiplier(state.upgrades);
    container.innerHTML = '';

    for (const dept of DEPARTMENTS) {
      const unlocked = dept.id === 'freelancer' || state.totalEarned >= dept.basePrice * 0.5;
      if (!unlocked) continue;

      const qty        = state.departments[dept.id];
      const cap        = getDeptCap(dept.id, state);
      const price      = getDeptPrice(dept, qty);
      const canAfford  = state.money >= price && qty < cap;
      const atCap      = qty >= cap;
      const expandMult  = getExpandMult(dept.id, state);
      const deptIncome  = qty * dept.baseProduction * getDeptMultiplier(dept.id, state.upgrades) * expandMult * globalMult;

      // Ingreso que se ganará al comprar 1 unidad más
      const prestigeMult  = 1 + ((state.prestigeShares || 0) * 0.05);
      const incomePerUnit = dept.baseProduction * getDeptMultiplier(dept.id, state.upgrades) * expandMult * globalMult * prestigeMult;

      // Expansión — solo mostrar botón cuando el dpto está al tope
      const expandLv     = state.deptExpansions[dept.id] || 0;
      const canExpand    = expandLv < EXPAND_MAX_LV;
      const expandCost   = canExpand ? getExpandCost(dept, expandLv) : null;
      const nextMult     = canExpand ? EXPAND_MULT[expandLv + 1] : null;
      const nextCap      = canExpand ? DEPT_CAPS[expandLv + 1] : null;
      const showExpBtn   = canExpand && atCap;         // solo visible al llegar al tope
      const canBuyExp    = showExpBtn && state.money >= expandCost;

      // Barra de cap
      const capPct   = Math.min(100, (qty / cap) * 100);
      const capClass = capPct >= 100 ? 'at-cap' : capPct >= 80 ? 'near-cap' : '';

      const card = document.createElement('div');
      card.className = 'dept-card' + (canAfford ? ' can-afford' : '');
      card.innerHTML = `
        <div class="dept-icon">${dept.icon}</div>
        <div class="dept-info">
          <div class="dept-name">${dept.name}</div>
          <div class="dept-desc">${dept.description}</div>
          ${qty > 0 ? `<div class="dept-prod">
            ▲ ${formatLucas(deptIncome)}/s
            ${expandLv > 0 ? `<span class="dept-expand-badge">×${expandMult.toFixed(1)}</span>` : ''}
          </div>` : ''}
          <div class="dept-cap-row">
            <div class="dept-cap-track">
              <div class="dept-cap-fill ${capClass}" style="width:${capPct.toFixed(1)}%"></div>
            </div>
            <span class="dept-cap-label">${qty}/${cap}</span>
            ${showExpBtn ? `
              <button class="btn-expand ${canBuyExp ? 'ready' : ''}"
                      data-action="buy-expansion"
                      data-id="${dept.id}"
                      title="Expande hasta ${nextCap} unidades"
                      ${canBuyExp ? '' : 'disabled'}>
                ${gi('lock-open')} ×${nextMult.toFixed(1)}
                <span class="btn-expand-detail">${formatLucas(expandCost)} · hasta ${nextCap}</span>
              </button>` : canExpand ? `
              <span class="dept-expand-hint">${gi('lock')} Llena para ×${nextMult.toFixed(1)}</span>` : `
              <span class="dept-expand-lv" style="color:#f59e0b">MAX ×${expandMult.toFixed(1)}</span>`}
          </div>
        </div>
        <div class="dept-right">
          <span class="dept-qty">${qty}</span>
          <button class="btn-buy"
                  data-action="buy-dept"
                  data-id="${dept.id}"
                  ${canAfford && !atCap ? '' : 'disabled'}>
            ${atCap ? 'Cap. máx.' : formatLucas(price)}
            ${!atCap ? `<span class="btn-buy-delta">+${formatLucas(incomePerUnit)}/s</span>` : ''}
          </button>
        </div>
      `;
      container.appendChild(card);
    }
  },

  // ── Mejoras ───────────────────────────────────────────────
  renderUpgrades() {
    const container = document.getElementById('upgrades-list');
    container.innerHTML = '';
    let visible = 0;

    for (const upg of UPGRADES_DATA) {
      if (state.upgrades.includes(upg.id)) continue;   // ya comprada
      if (!upg.condition(state)) continue;              // condición no cumplida
      visible++;

      const canAfford = state.money >= upg.cost;
      const card = document.createElement('div');
      card.className = 'upgrade-card' + (canAfford ? ' can-afford' : '');
      card.innerHTML = `
        <span class="upg-icon">${upg.icon}</span>
        <div class="upg-info">
          <div class="upg-name">${upg.name}</div>
          <div class="upg-desc">${upg.description}</div>
        </div>
        <button class="btn-buy-upg"
                onclick="buyUpgrade('${upg.id}')"
                ${canAfford ? '' : 'disabled'}>
          ${formatLucas(upg.cost)}
        </button>
      `;
      container.appendChild(card);
    }

    document.getElementById('upgrades-section').style.display = visible > 0 ? '' : 'none';
  },

  // ── Banner de progreso offline ───────────────────────────
  showOfflineBanner(seconds, earned) {
    const hours   = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    const notif = document.getElementById('notifications');
    notif.innerHTML = `
      <div id="offline-banner">
        <span>${gi('clock')} Bienvenido de vuelta. En <strong>${timeStr}</strong>
              tu empresa generó <strong>${formatLucas(earned)}</strong></span>
        <button class="close-banner" onclick="this.parentElement.parentElement.innerHTML=''">${gi('x','gi-sm')}</button>
      </div>
    `;
  },

  // ── Texto flotante al hacer clic ─────────────────────────
  addFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  },

  // ── Barra de recursos ────────────────────────────────────
  renderResources() {
    const bar = document.getElementById('resource-bar');
    if (!bar) return;

    const active = RESOURCES.filter(r => (state.departments[r.dept] || 0) > 0);
    if (active.length === 0) {
      bar.classList.remove('visible');
      return;
    }
    bar.classList.add('visible');

    bar.innerHTML = active.map(res => {
      const current = state.resources[res.id] || 0;
      const cap     = getResourceCap(res.id, state);
      const pct     = Math.min(100, (current / cap) * 100);
      const rate    = (res.ratePerUnit * (state.departments[res.dept] || 0)).toFixed(2);
      return `
        <div class="res-item">
          <span class="res-icon" data-tooltip="${res.tooltip}" data-rate="+${rate}/s">${res.icon}</span>
          <div class="res-info">
            <span class="res-name">${res.name}</span>
            <div class="res-bar-track">
              <div class="res-bar-fill" style="width:${pct.toFixed(1)}%"></div>
            </div>
            <span class="res-count">${formatNum(Math.floor(current))} / ${formatNum(cap)}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  // ── Misiones activas ─────────────────────────────────────
  renderMissions() {
    const section = document.getElementById('missions-section');
    const list    = document.getElementById('missions-list');
    if (!section || !list) return;

    if (state.activeMissions.length === 0) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';

    list.innerHTML = state.activeMissions.map(id => {
      const m = getMissionById(id);
      if (!m) return '';

      const canComplete = canCompleteMission(id, state);
      const reqsHtml = m.requirements.map(req => {
        const res  = RESOURCES.find(r => r.id === req.resource);
        const have = Math.floor(state.resources[req.resource] || 0);
        const met  = have >= req.amount;
        const tip  = res ? (res.tooltip || res.name) : '';
        return `
          <span class="req-item ${met ? 'met' : ''}" ${tip ? `data-tooltip="${tip}"` : ''}>
            ${res ? res.icon : ''}
            <strong>${formatNum(req.amount)}</strong>
            <span class="req-have">(${formatNum(have)})</span>
          </span>
        `;
      }).join('');

      return `
        <div class="mission-card ${canComplete ? 'can-complete' : ''}">
          <div class="mission-header">
            <span class="mission-name">${m.name}</span>
            <span class="mission-tier">T${m.tier}</span>
          </div>
          <p class="mission-desc">${m.description}</p>
          <div class="mission-reqs">${reqsHtml}</div>
          <div class="mission-footer">
            <span class="mission-reward">${gi('trophy')} +${formatLucas(m.reward)}</span>
            <button class="btn-complete"
                    onclick="completeMission('${m.id}')"
                    ${canComplete ? '' : 'disabled'}>
              Completar
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  // ── Investigación ─────────────────────────────────────
  renderResearch() {
    const grid = document.getElementById('research-grid');
    if (!grid) return;

    const byRow = {};
    for (const node of RESEARCH_TREE) {
      if (!byRow[node.row]) byRow[node.row] = [];
      byRow[node.row].push(node);
    }

    const ROW_LABELS = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tecnologías cruzadas'];
    let html = '';
    for (const row of Object.keys(byRow).sort((a, b) => a - b)) {
      html += `<div class="research-row-label">${ROW_LABELS[row] || ('Tier ' + (+row + 1))}</div>`;
      const rowNodes = [...byRow[row]].sort((a, b) => a.col - b.col);
      for (const node of rowNodes) {
        const done       = (state.research || []).includes(node.id);
        const unlocked   = isResearchUnlocked(node.id, state);
        const affordable = canAffordResearch(node.id, state);

        let cls = 'research-node';
        if (done)            cls += ' done';
        else if (!unlocked)  cls += ' locked';
        else if (affordable) cls += ' available can-afford';
        else                 cls += ' available';

        const costsHtml = node.cost.map(c => {
          const res  = RESOURCES.find(r => r.id === c.resource);
          const have = Math.floor(state.resources[c.resource] || 0);
          const ok   = have >= c.amount;
          const tip  = res ? (res.tooltip || res.name) : '';
          return `<span class="rn-cost-item ${ok ? '' : 'missing'}" ${tip ? `data-tooltip="${tip}"` : ''}>${res ? res.icon : ''} ${formatNum(c.amount)}</span>`;
        }).join('');

        const clickAttr = (!done && unlocked) ? `onclick="buyResearch('${node.id}')"` : '';

        html += `
          <div class="${cls}" ${clickAttr}>
            ${done ? `<span class="rn-done-check">${gi('check','gi-sm')}</span>` : ''}
            <div class="rn-header">
              <span class="rn-icon">${node.icon}</span>
              <div class="rn-name">${node.name}</div>
            </div>
            <div class="rn-desc">${node.description}</div>
            ${!done ? `<div class="rn-cost">${costsHtml}</div>` : ''}
          </div>`;
      }
    }
    grid.innerHTML = html;
  },

  // ── Logros ───────────────────────────────────────────
  renderAchievements() {
    const grid    = document.getElementById('achievements-grid');
    const summary = document.querySelector('.achievements-summary');
    if (!grid) return;

    const total    = ACHIEVEMENTS.length;
    const unlocked = state.achievements.length;
    if (summary) summary.textContent = `${unlocked} / ${total} desbloqueados`;

    grid.innerHTML = ACHIEVEMENTS.map(ach => {
      const done = state.achievements.includes(ach.id);
      return `
        <div class="ach-card ${ach.rarity} ${done ? '' : 'locked'}">
          <span class="ach-icon">${done ? ach.icon : gi('lock')}</span>
          <div class="ach-info">
            <div class="ach-name">${done ? ach.name : '???'}</div>
            <div class="ach-desc">${done ? ach.description : 'Aún no desbloqueado.'}</div>
            <div class="ach-rarity">${ach.rarity}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  // ── Toast de logro ────────────────────────────────────
  showAchievementToast(ach) {
    const container = document.getElementById('achievement-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `achievement-toast ${ach.rarity}`;
    toast.innerHTML = `
      <span class="toast-icon">${ach.icon}</span>
      <div class="toast-body">
        <div class="toast-label">${gi('trophy')} Logro desbloqueado</div>
        <div class="toast-name">${ach.name}</div>
        <div class="toast-desc">${ach.description}</div>
      </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 380);
    }, 4000);
  },
};
