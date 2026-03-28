// Recursos generados pasivamente por cada departamento
const RESOURCES = [
  { id: 'codigo',      name: 'Código',      tooltip: 'Generado por Freelancers. Se usa en investigaciones de automatización.',      icon: '<i data-lucide="hard-drive" class="gi"></i>',    dept: 'freelancer',    ratePerUnit: 0.2  },
  { id: 'contratos',   name: 'Contratos',   tooltip: 'Generado por Ventas. Se usa en misiones comerciales e investigación.',         icon: '<i data-lucide="file-text" class="gi"></i>',   dept: 'ventas',        ratePerUnit: 0.15 },
  { id: 'cvs',         name: 'CVs',         tooltip: 'Generado por RRHH. Se usa en misiones de talento e investigación.',            icon: '<i data-lucide="file" class="gi"></i>',         dept: 'rrhh',          ratePerUnit: 0.15 },
  { id: 'tickets',     name: 'Tickets IT',  tooltip: 'Generado por IT. Se usa en proyectos de automatización e investigación.',      icon: '<i data-lucide="ticket" class="gi"></i>',      dept: 'it',            ratePerUnit: 0.2  },
  { id: 'campanas',    name: 'Campañas',    tooltip: 'Generado por Marketing. Se usa en misiones de branding e investigación.',     icon: '<i data-lucide="megaphone" class="gi"></i>',  dept: 'marketing',     ratePerUnit: 0.15 },
  { id: 'reportes',    name: 'Reportes',    tooltip: 'Generado por Finanzas. Se usa en auditorías e investigación estratégica.',    icon: '<i data-lucide="bar-chart-2" class="gi"></i>', dept: 'finanzas',      ratePerUnit: 0.1  },
  { id: 'documentos',  name: 'Documentos',  tooltip: 'Generado por Legal. Se usa en misiones legales e investigación de talento.',  icon: '<i data-lucide="file-check" class="gi"></i>',  dept: 'legal',         ratePerUnit: 0.08 },
  { id: 'estrategias', name: 'Estrategias', tooltip: 'Generado por Dirección. Se usa en planificación e investigación avanzada.',   icon: '<i data-lucide="target" class="gi"></i>',      dept: 'direccion',     ratePerUnit: 0.06 },
  { id: 'proyectos',   name: 'Proyectos',   tooltip: 'Generado por Sede Central. Se usa en investigaciones de nivel corporativo.',  icon: '<i data-lucide="layers" class="gi"></i>',      dept: 'sede',          ratePerUnit: 0.04 },
  { id: 'acuerdos',    name: 'Acuerdos',    tooltip: 'Generado por Multinacional. Recurso más escaso, para investigaciones élite.', icon: '<i data-lucide="network" class="gi"></i>',     dept: 'multinacional', ratePerUnit: 0.03 },
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
