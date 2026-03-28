// ── Sistema de Notificaciones del Lobby ─────────────────────

const NotifSystem = (() => {
  const MAX_MESSAGES = 30;
  let messages  = [];
  let unread    = 0;
  let panelOpen = false;
  let toastTimer = null;

  const NEWS_ICONS = ['📰','💼','📣','⚠️','🎉','☕','💡','🔧','📊','🏆'];

  function init() {
    _patchAddNews();
    // DOM ya está listo (init() se llama desde DOMContentLoaded + setTimeout)
    _bindUI();
  }

  function _patchAddNews() {
    const orig = window.addNews;
    if (typeof orig !== 'function') return;
    window.addNews = function(text) {
      orig(text);
      _receive(text);
    };
  }

  function _receive(text) {
    const icon = NEWS_ICONS[Math.floor(Math.random() * NEWS_ICONS.length)];
    messages.unshift({ text, icon, time: _timeLabel(), read: panelOpen });
    if (messages.length > MAX_MESSAGES) messages.pop();

    if (panelOpen) {
      _renderList();
    } else {
      unread++;
      _updateBadge();
      _showToast(text);
    }
  }

  // ── Badge ──────────────────────────────────────────────────
  function _updateBadge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    if (unread > 0) {
      badge.textContent = unread > 9 ? '9+' : unread;
      badge.style.display = 'flex';
      badge.classList.remove('badge-pulse');
      void badge.offsetWidth;
      badge.classList.add('badge-pulse');
    } else {
      badge.style.display = 'none';
    }
  }

  // ── Toast ──────────────────────────────────────────────────
  function _showToast(text) {
    const toast = document.getElementById('notif-toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.classList.remove('toast-hide');
    toast.classList.add('toast-show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('toast-show');
      toast.classList.add('toast-hide');
    }, 3000);
  }

  // ── Modal ──────────────────────────────────────────────────
  function _openPanel() {
    const panel = document.getElementById('notif-panel');
    if (!panel) return;
    panelOpen = true;
    unread    = 0;
    messages.forEach(m => m.read = true);
    _updateBadge();
    _renderList();
    panel.classList.add('notif-panel-open');
    clearTimeout(toastTimer);
    const toast = document.getElementById('notif-toast');
    if (toast) { toast.classList.remove('toast-show'); toast.classList.add('toast-hide'); }
  }

  function _closePanel() {
    const panel = document.getElementById('notif-panel');
    if (!panel) return;
    panelOpen = false;
    panel.classList.remove('notif-panel-open');
    // Marcar todo como leído y limpiar contador al cerrar
    unread = 0;
    messages.forEach(m => m.read = true);
    _updateBadge();
  }

  function _renderList() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    if (messages.length === 0) {
      list.innerHTML = `
        <div class="notif-empty-state">
          <span class="notif-empty-icon">📭</span>
          <p>Sin noticias todavía</p>
          <small>Los eventos de tu empresa aparecerán aquí</small>
        </div>`;
      return;
    }

    // Separar no leídas de leídas
    const unreadMsgs = messages.filter(m => !m.read);
    const readMsgs   = messages.filter(m => m.read);

    let html = '';

    if (unreadMsgs.length > 0) {
      html += `<div class="notif-section-label">Nuevas <span class="notif-count-badge">${unreadMsgs.length}</span></div>`;
      html += unreadMsgs.map(m => _itemHTML(m, true)).join('');
    }

    if (readMsgs.length > 0) {
      if (unreadMsgs.length > 0) {
        html += `<div class="notif-section-label notif-section-read">Anteriores</div>`;
      }
      html += readMsgs.map(m => _itemHTML(m, false)).join('');
    }

    list.innerHTML = html;
  }

  function _itemHTML(m, isUnread) {
    return `
      <div class="notif-item ${isUnread ? 'notif-unread' : ''}">
        <div class="notif-icon-wrap">${m.icon}</div>
        <div class="notif-body">
          <p class="notif-text">${m.text}</p>
          <span class="notif-time">${m.time}</span>
        </div>
        ${isUnread ? '<span class="notif-new-dot"></span>' : ''}
      </div>`;
  }

  // ── Bind — DOM ya cargado cuando se llama ─────────────────
  function _bindUI() {
    const btnBell  = document.getElementById('btn-notif');
    const btnClose = document.getElementById('btn-notif-close');
    if (btnBell)  btnBell.addEventListener('click',  () => panelOpen ? _closePanel() : _openPanel());
    if (btnClose) btnClose.addEventListener('click', _closePanel);
  }

  function _timeLabel() {
    const d = new Date();
    return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => NotifSystem.init(), 50);
});
