const NEWS_POOL = [
  'El de IT dice que el servidor caído no es culpa suya.',
  'RRHH anuncia team building. Nadie está contento.',
  'Ventas ha cerrado un deal. ¡Celebración con pizza!',
  'El microondas de la cocina ha explotado. Otra vez.',
  'La reunión de las 9 se postergó para las 10. La de las 10, para las 11.',
  'Alguien comió tu almuerzo del refrigerador. Hay un memorándum al respecto.',
  'IT instaló una actualización sin avisar. Todos perdieron el trabajo no guardado.',
  'RRHH añadió 3 formularios obligatorios nuevos. Incluyen uno de confirmación.',
  'El jefe llegó con una nueva visión estratégica. PowerPoint de 87 diapositivas.',
  'Café gratis hoy en la oficina. Productividad histórica.',
  'El WiFi tiene velocidad de 2003. IT dice que es lo esperado.',
  'Nueva política: corbata en videollamadas. Solo la parte de arriba.',
  'El proyector de la sala B no funciona. Quinta semana consecutiva.',
  'Finanzas rechazó el gasto de los lápices. No está en el presupuesto Q3.',
  'Marketing cambió el eslogan de la empresa. Décima vez este año.',
  'Alguien dejó el Caps Lock activado en el servidor de correo. Todo llegó gritando.',
  'La impresora solo funciona si le das tres golpes y susurras su nombre.',
  'Se cancela el viernes casual. Ya nadie recuerda qué era el casual.',
  'El nuevo colaborador lleva tres semanas en onboarding. Aún no tiene acceso al correo.',
  'Reunión para planificar la reunión de planificación. Duró dos horas.',
  'Alguien dejó comida de dos semanas en el refrigerador. RRHH abrió investigación.',
  'El sistema ERP lleva tres días caído. Productividad igual que siempre.',
  'La silla del jefe tiene ruedas nuevas. Reunión de celebración programada.',
  'IT bloqueó YouTube pero olvidaron TikTok. Nadie dice nada.',
  'Ventas prometió algo que Operations no puede hacer. Reunión de emergencia.',
];

let newsPool = [...NEWS_POOL].sort(() => Math.random() - 0.5);
let newsIdx  = 0;

function addNews(text) {
  const feed = document.getElementById('news-feed');
  if (!feed) return;

  const item = document.createElement('div');
  item.className = 'news-item';
  item.textContent = text;
  feed.prepend(item);

  // Mantener máximo 7 noticias visibles
  while (feed.children.length > 7) {
    feed.removeChild(feed.lastChild);
  }
}

function scheduleNews() {
  function showNext() {
    if (newsIdx >= newsPool.length) {
      newsPool = [...NEWS_POOL].sort(() => Math.random() - 0.5);
      newsIdx  = 0;
    }
    addNews(newsPool[newsIdx++]);
    setTimeout(showNext, 22000 + Math.random() * 20000);
  }
  setTimeout(showNext, 6000);
}
