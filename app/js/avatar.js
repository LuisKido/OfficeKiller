// ── Avatar Controller ────────────────────────────────────────
// Maneja animaciones del personaje cartoon (data-state attribute).
// Solo lee el estado del juego, nunca lo modifica.

const Avatar = (() => {
  let el = null;
  let timer = null;

  function init() {
    el = document.getElementById('avatar-character');
    if (!el) return;

    // Reaccionar al clic en el desk (el avatar es el área de clic)
    const desk = document.getElementById('desk');
    if (desk) {
      desk.addEventListener('click', () => {
        setState('click');
        spawnCoinParticles(1);
      });
    }

    // Parchear funciones globales de compra para animar el avatar
    _patchGlobals();
  }

  function _patchGlobals() {
    const patch = (name, earnState, coins) => {
      const orig = window[name];
      if (typeof orig !== 'function') return;
      window[name] = function(...args) {
        const result = orig.apply(this, args);
        setState(earnState);
        spawnCoinParticles(coins);
        return result;
      };
    };
    patch('buyDepartment',   'earn', 2);
    patch('buyUpgrade',      'earn', 3);
    patch('buyExpansion',    'earn', 4);
    patch('buyResearch',     'earn', 3);
    patch('completeMission', 'earn', 5);
  }

  function setState(newState) {
    if (!el) return;
    clearTimeout(timer);
    el.setAttribute('data-state', newState);
    // Propagar al controlador Lottie si está activo
    if (typeof AvatarLottie !== 'undefined') AvatarLottie.setState(newState);

    const duration = newState === 'prestige' ? 1400 : newState === 'earn' ? 700 : 480;
    if (newState !== 'idle') {
      timer = setTimeout(() => el.setAttribute('data-state', 'idle'), duration);
    }
  }

  // Monedas CSS que vuelan desde el avatar al hacer clic/comprar
  function spawnCoinParticles(count = 1) {
    const desk = document.getElementById('desk');
    if (!desk) return;
    const rect = desk.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.3;

    const emojis = ['🪙', '💰', '✨', '💵'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const coin = document.createElement('div');
        coin.className = 'coin-particle';
        coin.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const dx = (Math.random() - 0.5) * 80;
        coin.style.setProperty('--dx', dx + 'px');
        coin.style.left = (cx + (Math.random() - 0.5) * 30) + 'px';
        coin.style.top  = cy + 'px';
        coin.style.fontSize = (14 + Math.random() * 8) + 'px';
        coin.style.animationDuration = (0.7 + Math.random() * 0.6) + 's';
        document.body.appendChild(coin);
        setTimeout(() => coin.remove(), 1400);
      }, i * 70);
    }
  }

  function onPrestige() {
    setState('prestige');
    for (let i = 0; i < 10; i++) {
      setTimeout(() => spawnCoinParticles(2), i * 100);
    }
  }

  return { init, setState, onPrestige, spawnCoinParticles };
})();
