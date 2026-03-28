// Recursos generados pasivamente por cada departamento
const RESOURCES = [
  { id: 'codigo',      name: 'Código',      icon: '💾', dept: 'freelancer',    ratePerUnit: 0.2  },
  { id: 'contratos',   name: 'Contratos',   icon: '📝', dept: 'ventas',        ratePerUnit: 0.15 },
  { id: 'cvs',         name: 'CVs',         icon: '📄', dept: 'rrhh',          ratePerUnit: 0.15 },
  { id: 'tickets',     name: 'Tickets IT',  icon: '🎫', dept: 'it',            ratePerUnit: 0.2  },
  { id: 'campanas',    name: 'Campañas',    icon: '📣', dept: 'marketing',     ratePerUnit: 0.15 },
  { id: 'reportes',    name: 'Reportes',    icon: '📊', dept: 'finanzas',      ratePerUnit: 0.1  },
  { id: 'documentos',  name: 'Documentos',  icon: '⚖️', dept: 'legal',         ratePerUnit: 0.08 },
  { id: 'estrategias', name: 'Estrategias', icon: '♟️', dept: 'direccion',     ratePerUnit: 0.06 },
  { id: 'proyectos',   name: 'Proyectos',   icon: '🗂️', dept: 'sede',          ratePerUnit: 0.04 },
  { id: 'acuerdos',    name: 'Acuerdos',    icon: '🌐', dept: 'multinacional', ratePerUnit: 0.03 },
];

function getResourceCap(resourceId, s) {
  const res = RESOURCES.find(r => r.id === resourceId);
  if (!res) return 100;
  const qty = s.departments[res.dept] || 0;
  return Math.min(2000, 100 + qty * 20);
}

// Avanza los recursos en dt segundos, respetando cada cap
function tickResources(s, dt) {
  const resMult = getResearchResMult(s);
  for (const res of RESOURCES) {
    const qty = s.departments[res.dept] || 0;
    if (!qty) continue;
    const cap = getResourceCap(res.id, s);
    s.resources[res.id] = Math.min(cap, (s.resources[res.id] || 0) + qty * res.ratePerUnit * resMult * dt);
  }
}
