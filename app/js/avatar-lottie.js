// ── Avatar dotLottie Controller ──────────────────────────────
// Usa el web component <dotlottie-wc> para animar el avatar.
// Requiere: app/assets/avatar.lottie
// Fallback: si no existe, el SVG original sigue visible.

const AvatarLottie = (() => {
  let player     = null;   // elemento <dotlottie-wc>
  let ready      = false;
  let stateTimer = null;

  const ASSET_PATH = 'assets/avatar.lottie';
  const SPEED = { idle: 1, click: 2.5, earn: 2, prestige: 0.7 };

  // ── Init ────────────────────────────────────────────────────
  async function init() {
    const exists = await _fileExists(ASSET_PATH);
    console.log('[AvatarLottie] archivo existe:', exists);
    if (!exists) {
      console.info('[AvatarLottie] assets/avatar.lottie no encontrado — usando SVG fallback');
      return;
    }
    _loadAnimation();
  }

  function _loadAnimation() {
    const container = document.getElementById('avatar-character');
    if (!container) return;

    // Ocultar SVG estático
    const svg = container.querySelector('.character-svg');
    if (svg) svg.style.display = 'none';

    // Crear el web component
    player = document.createElement('dotlottie-wc');
    player.setAttribute('src', ASSET_PATH);
    player.setAttribute('autoplay', '');
    player.setAttribute('loop', '');
    player.style.cssText = 'width:100%;height:100%;display:block;';
    container.insertBefore(player, container.firstChild);

    // El web component dispara 'ready' cuando está listo
    player.addEventListener('ready', () => {
      ready = true;
      _patchAvatarGlobals();
      console.info('[AvatarLottie] ✓ Animación cargada');
    });

    // Fallback si falla
    player.addEventListener('error', () => {
      console.warn('[AvatarLottie] Error cargando animación — usando SVG fallback');
      if (svg) svg.style.display = '';
      player.remove();
      player = null;
    });

    console.log('[AvatarLottie] <dotlottie-wc> insertado');
  }

  // ── Control de estados ──────────────────────────────────────
  function setState(state) {
    if (!player) return;
    clearTimeout(stateTimer);

    const speed = SPEED[state] || 1;
    try { player.setSpeed?.(speed); } catch (_) {}

    const container = document.getElementById('avatar-character');
    if (container) container.setAttribute('data-state', state);

    if (state !== 'idle') {
      const duration = state === 'prestige' ? 3000 : state === 'earn' ? 800 : 500;
      stateTimer = setTimeout(() => setState('idle'), duration);
    }
  }

  function onPrestige() { setState('prestige'); }

  // ── Patch funciones globales de compra ──────────────────────
  function _patchAvatarGlobals() {
    const patch = (name, state, coins) => {
      const orig = window[name];
      if (typeof orig !== 'function') return;
      window[name] = function(...args) {
        const r = orig.apply(this, args);
        setState(state);
        Avatar.spawnCoinParticles(coins);
        return r;
      };
    };
    patch('buyDepartment',   'earn', 2);
    patch('buyUpgrade',      'earn', 3);
    patch('buyExpansion',    'earn', 4);
    patch('buyResearch',     'earn', 3);
    patch('completeMission', 'earn', 5);

    const desk = document.getElementById('desk');
    if (desk) desk.addEventListener('click', () => {
      setState('click');
      Avatar.spawnCoinParticles(1);
    });

    const confirmBtn = document.querySelector('.btn-prestige-confirm');
    if (confirmBtn) confirmBtn.addEventListener('click', () => setTimeout(onPrestige, 200));
  }

  // ── Helper ──────────────────────────────────────────────────
  async function _fileExists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  return { init, setState, onPrestige };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que el web component esté definido
  const tryInit = (attempts = 0) => {
    if (customElements.get('dotlottie-wc')) {
      AvatarLottie.init();
    } else if (attempts < 20) {
      setTimeout(() => tryInit(attempts + 1), 200);
    } else {
      console.warn('[AvatarLottie] Web component dotlottie-wc no registrado tras 20 intentos');
    }
  };
  setTimeout(tryInit, 300);
});
