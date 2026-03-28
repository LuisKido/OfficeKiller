// Estado global del juego — único objeto mutable
const state = {
  money:           0,
  totalEarned:     0,
  moneyPerSecond:  0,   // derivado, no se guarda directamente
  moneyPerClick:   1,
  departments: {
    freelancer:   0,
    ventas:       0,
    rrhh:         0,
    it:           0,
    marketing:    0,
    finanzas:     0,
    legal:        0,
    direccion:    0,
    sede:         0,
    multinacional: 0,
  },
  upgrades:        [],  // IDs de mejoras compradas
  resources: {
    codigo:      0,
    contratos:   0,
    cvs:         0,
    tickets:     0,
    campanas:    0,
    reportes:    0,
    documentos:  0,
    estrategias: 0,
    proyectos:   0,
    acuerdos:    0,
  },
  activeMissions:    [],  // IDs de misiones en curso (máx 3)
  completedMissions: [],  // IDs de misiones completadas
  deptExpansions: {      // nivel de expansión por departamento (0–3)
    freelancer:   0,
    ventas:       0,
    rrhh:         0,
    it:           0,
    marketing:    0,
    finanzas:     0,
    legal:        0,
    direccion:    0,
    sede:         0,
    multinacional: 0,
  },
  achievements:      [],  // IDs de logros desbloqueados
  research:          [],  // IDs de nodos de investigación completados (permanentes)
  playTimeSeconds:      0,
  totalClicks:          0,
  prestigeCount:        0,  // veces que se hizo prestige
  prestigeShares:       0,  // acciones acumuladas (permanentes)
  prestigeSharesTotal:  0,  // total histórico (para logros)
  version:         '0.1.0',
};
