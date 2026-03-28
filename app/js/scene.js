// ── Scene Manager ────────────────────────────────────────────
// Maneja la escena visual del lobby:
//   1. Edificios CSS que crecen con los departamentos
//   2. Partículas PixiJS de monedas (si PixiJS cargó)
//   3. Inicialización del avatar
//
// Solo LEE el estado del juego. Nunca lo modifica.

const Scene = (() => {

  // Configuración visual de cada departamento
  const BUILDING_CONFIG = {
    freelancer:   { color: '#60a5fa', roofColor: '#2563eb', maxH: 60,  width: 28, label: '🏠' },
    ventas:       { color: '#34d399', roofColor: '#059669', maxH: 85,  width: 32, label: '📊' },
    rrhh:         { color: '#fbbf24', roofColor: '#d97706', maxH: 110, width: 34, label: '👥' },
    it:           { color: '#818cf8', roofColor: '#4f46e5', maxH: 140, width: 36, label: '💻' },
    marketing:    { color: '#f472b6', roofColor: '#db2777', maxH: 120, width: 34, label: '📣' },
    finanzas:     { color: '#a78bfa', roofColor: '#7c3aed', maxH: 160, width: 38, label: '🏦' },
    legal:        { color: '#94a3b8', roofColor: '#475569', maxH: 150, width: 36, label: '⚖️'  },
    direccion:    { color: '#fb923c', roofColor: '#ea580c', maxH: 190, width: 40, label: '🏢' },
    sede:         { color: '#38bdf8', roofColor: '#0284c7', maxH: 220, width: 44, label: '🏛️' },
    multinacional:{ color: '#4ade80', roofColor: '#16a34a', maxH: 260, width: 50, label: '🌐' },
  };

  // Orden de aparición en el skyline (izquierda → derecha)
  const DEPT_ORDER = [
    'freelancer', 'ventas', 'rrhh', 'it',
    'marketing', 'finanzas', 'legal',
    'direccion', 'sede', 'multinacional',
  ];

  let pixiApp = null;
  let coinEmitter = null;
  let buildingEls = {};
  let lastDeptState = {};
  let sceneReady = false;

  // ── Inicializar escena completa ───────────────────────────
  async function init() {
    buildCSSScene();
    await initPixi();
    Avatar.init();
    patchPrestige();
    sceneReady = true;

    // Primer render de edificios
    updateBuildings();

    // Actualizar edificios cada segundo
    setInterval(updateBuildings, 1000);
  }

  // ── Escena CSS: skyline de edificios ─────────────────────
  function buildCSSScene() {
    const container = document.getElementById('css-cityscape');
    if (!container) return;

    DEPT_ORDER.forEach(id => {
      const cfg = BUILDING_CONFIG[id];
      const wrapper = document.createElement('div');
      wrapper.id = 'bld-' + id;
      wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        width: ${cfg.width}px;
      `;

      // Label emoji encima
      const lbl = document.createElement('div');
      lbl.className = 'bld-label';
      lbl.textContent = cfg.label;
      lbl.style.cssText = `
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.4s;
        margin-bottom: 2px;
        text-shadow: 0 1px 4px rgba(0,0,0,0.5);
      `;
      lbl.id = 'bld-label-' + id;

      // Bloque del edificio
      const bld = document.createElement('div');
      bld.className = 'css-building';
      bld.id = 'bld-body-' + id;
      bld.style.cssText = `
        width: 100%;
        height: 0px;
        background: ${cfg.color};
        border-radius: 6px 6px 0 0;
        transition: height 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        box-shadow: inset -4px 0 8px rgba(0,0,0,0.15), inset 4px 0 8px rgba(255,255,255,0.1);
      `;

      // Tejado / azotea
      const roof = document.createElement('div');
      roof.style.cssText = `
        position: absolute;
        top: -6px;
        left: -2px;
        right: -2px;
        height: 8px;
        background: ${cfg.roofColor};
        border-radius: 5px 5px 0 0;
      `;
      bld.appendChild(roof);

      // Ventanas (grid)
      const windows = document.createElement('div');
      windows.className = 'css-building-windows';
      windows.id = 'bld-wins-' + id;
      bld.appendChild(windows);

      wrapper.appendChild(lbl);
      wrapper.appendChild(bld);
      container.appendChild(wrapper);

      buildingEls[id] = { bld, lbl, windows };
    });
  }

  // Actualizar alturas de edificios según estado del juego
  function updateBuildings() {
    if (typeof state === 'undefined') return;

    DEPT_ORDER.forEach(id => {
      const qty = (state.departments && state.departments[id]) || 0;
      const cfg = BUILDING_CONFIG[id];
      const els = buildingEls[id];
      if (!els) return;

      const prevQty = lastDeptState[id] || 0;
      const targetH = qty === 0 ? 0 : Math.min(cfg.maxH, 12 + qty * (cfg.maxH / 30));

      // Solo actualizar si cambió
      if (qty !== prevQty) {
        els.bld.style.height = targetH + 'px';
        els.lbl.style.opacity = qty > 0 ? '1' : '0';

        // Regenerar ventanas al cambiar tamaño
        if (qty > 0) buildWindows(els.windows, qty, targetH, cfg.width);

        // Animación de aparición al comprar primera unidad
        if (prevQty === 0 && qty > 0) {
          els.bld.style.transition = 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          Avatar.setState('earn');
        }

        lastDeptState[id] = qty;
      }
    });
  }

  // Generar ventanas del edificio
  function buildWindows(container, qty, height, width) {
    const cols = Math.max(1, Math.floor(width / 10));
    const rows = Math.max(1, Math.floor(height / 14));
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const total = cols * rows;
    for (let i = 0; i < total; i++) {
      const win = document.createElement('div');
      win.className = 'css-window' + (Math.random() > 0.35 ? ' lit' : '');
      win.style.cssText = 'height: 8px; border-radius: 2px;';
      container.appendChild(win);
    }
  }

  // ── PixiJS: partículas de monedas ────────────────────────
  async function initPixi() {
    const canvas = document.getElementById('pixi-canvas');
    if (!canvas || !window.PIXI) {
      console.log('[Scene] PixiJS no disponible, usando fallback CSS.');
      return;
    }

    try {
      pixiApp = new PIXI.Application();
      await pixiApp.init({
        canvas,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
        resizeTo: document.getElementById('panel-left'),
      });
      coinEmitter = new CoinEmitter(pixiApp);
      console.log('[Scene] PixiJS listo.');
    } catch (e) {
      console.warn('[Scene] PixiJS error:', e.message);
      pixiApp = null;
    }
  }

  // Disparar una ráfaga de monedas en posición dada
  function burstCoins(x, y, count = 3) {
    if (coinEmitter) {
      coinEmitter.burst(x, y, count);
    }
  }

  // ── Patch prestige para animación ───────────────────────
  function patchPrestige() {
    // Observa el modal de prestige para detectar confirmación
    const modal = document.getElementById('prestige-modal');
    if (!modal) return;
    const confirmBtn = modal.querySelector('.btn-prestige-confirm');
    if (!confirmBtn) return;

    confirmBtn.addEventListener('click', () => {
      setTimeout(() => Avatar.onPrestige(), 200);
    });
  }

  return { init, updateBuildings, burstCoins };
})();

// ── Coin Emitter (PixiJS) ────────────────────────────────────
class CoinEmitter {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    app.stage.addChild(this.container);
  }

  burst(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this._spawnCoin(x, y), i * 60);
    }
  }

  _spawnCoin(x, y) {
    const coin = new PIXI.Graphics();
    coin.circle(0, 0, 7).fill({ color: 0xfbbf24 });
    coin.circle(0, 0, 5).fill({ color: 0xfcd34d });

    coin.x = x + (Math.random() - 0.5) * 40;
    coin.y = y;
    coin.alpha = 1;
    this.container.addChild(coin);

    const vx = (Math.random() - 0.5) * 3;
    const vy = -(3 + Math.random() * 3);
    let life = 0;
    const maxLife = 45;

    const tick = () => {
      life++;
      coin.x += vx;
      coin.y += vy + life * 0.08;
      coin.alpha = 1 - life / maxLife;
      coin.scale.set(1 - life / maxLife * 0.3);

      if (life >= maxLife) {
        this.app.ticker.remove(tick);
        coin.destroy();
      }
    };

    this.app.ticker.add(tick);
  }
}

// ── Sheet handle: cerrar bottom sheet al hacer clic ─────────
document.addEventListener('DOMContentLoaded', () => {
  Scene.init();

  // Cerrar el sheet al pulsar el handle
  const handle = document.getElementById('sheet-handle');
  if (handle) {
    handle.addEventListener('click', () => {
      const right = document.getElementById('panel-right');
      const left  = document.getElementById('panel-left');
      if (!right || !left) return;
      right.classList.remove('tab-active');
      left.classList.add('tab-active');
      // Sincronizar botones del nav inferior
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === 'panel-left');
      });
    });
  }
});
