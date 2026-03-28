# Office Killer — Arquitectura Técnica

> Version 0.1 | Fecha: 2026-03-25

---

## 1. Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Lenguaje | JavaScript (ES2022) | Sin instalación, soporte universal en navegadores de empresa |
| Markup | HTML5 | Estructura semántica simple |
| Estilos | CSS3 + variables CSS | Temas fáciles, sin procesador de CSS |
| Persistencia | `localStorage` | Sin backend, sin cuentas, portátil |
| Build | Ninguno (archivos planos) | Se abre con doble clic o desde servidor local |

No se usarán frameworks ni bundlers en v0.1 para mantener el proyecto liviano y ejecutable directamente desde el sistema de archivos.

---

## 2. Estructura de Archivos

```
OfficeKiller/
├── docs/
│   ├── GDD.md               ← Diseño del juego
│   ├── ARCHITECTURE.md      ← Este documento
│   └── CHANGELOG.md         ← Historial de versiones
├── src/
│   ├── index.html           ← Punto de entrada
│   ├── css/
│   │   ├── main.css         ← Estilos globales y layout
│   │   ├── departments.css  ← Cards de departamentos
│   │   └── upgrades.css     ← Panel de mejoras
│   ├── js/
│   │   ├── main.js          ← Inicialización y game loop
│   │   ├── state.js         ← Estado global del juego
│   │   ├── departments.js   ← Datos y lógica de departamentos
│   │   ├── upgrades.js      ← Datos y lógica de mejoras
│   │   ├── economy.js       ← Cálculo de ingresos y precios
│   │   ├── ui.js            ← Renderizado y actualización del DOM
│   │   ├── save.js          ← Guardar / cargar / limpiar
│   │   └── news.js          ← Sistema de noticias de empresa
│   └── assets/
│       ├── icons/           ← Iconos SVG de departamentos
│       └── fonts/           ← Tipografías opcionales
└── README.md
```

---

## 3. Estado Global del Juego (`state.js`)

El estado es un único objeto plano, fácil de serializar a JSON para `localStorage`.

```js
const GameState = {
  // Economía
  money: 0,               // Balance actual (lucas)
  totalEarned: 0,         // Total histórico ganado (lucas) — para desbloqueos
  moneyPerSecond: 0,      // Calculado, no almacenado (derivado)
  moneyPerClick: 1,       // Ganancia base por clic manual (1 luca)

  // Departamentos: { [id]: cantidad }
  departments: {
    freelancer: 0,
    ventas: 0,
    rrhh: 0,
    it: 0,
    marketing: 0,
    finanzas: 0,
    legal: 0,
    direccion: 0,
    sede: 0,
    multinacional: 0,
  },

  // Mejoras compradas: Set serializado como array
  upgrades: [],

  // Meta
  lastSaved: null,        // Timestamp ISO para calcular offline progress
  lastTick: null,         // Timestamp del último tick procesado
  totalClicks: 0,
  playTimeSeconds: 0,
  version: '0.1.0',
};
```

---

## 4. Game Loop

El loop principal corre a **10 ticks por segundo (100ms)**. Esto permite fluidez sin sobrecargar la CPU.

```
setInterval (100ms)
  └─► economy.tick()
        ├─ currentIncome = calculateIncome(state)   // €/s × 0.1
        ├─ state.money += currentIncome
        ├─ state.totalEarned += currentIncome
        └─► ui.updateHeader()                        // Solo header, no re-render completo

setInterval (1000ms)
  └─► ui.updateAll()        // Re-render de botones (precios, cantidades)
      save.autosave()       // Guardar si han pasado 30 segundos

window beforeunload
  └─► save.save()           // Guardar al cerrar pestaña
```

**Nota sobre rendimiento**: el DOM solo se actualiza selectivamente. El header (balance + €/s) se refresca cada 100ms, pero los botones de departamentos solo se actualizan cada segundo para evitar reflows costosos.

---

## 5. Módulo de Economía (`economy.js`)

### 5.1 Cálculo de ingresos
```
// Resultado en lucas/segundo
ingresoTotal = Σ (cantidad[dept] × produccionBase[dept] × multiplicador[dept]) × multiplicadorGlobal
```

### 5.2 Formato de visualización de lucas
```js
// Sufijos: k = 1.000, M = 1.000.000, B = 1.000.000.000
formatLucas(n) → '1 luca' | '5 lucas' | '1.2k lucas' | '3.4M lucas'
// Singular/plural: 1 luca, 2+ lucas
```

### 5.3 Precio de compra
```
precio(dept, cantidadActual) = precioBase[dept] × 1.15 ^ cantidadActual  // en lucas
```

### 5.4 Multiplicadores
Los multiplicadores se recalculan cada vez que se compra un departamento o mejora:
- `multiplicador[dept]` — producto de todas las mejoras que afectan a ese dept
- `multiplicadorGlobal` — producto de mejoras/atributos que afectan a toda la empresa

---

## 6. Módulo de Departamentos (`departments.js`)

Cada departamento es un objeto con la siguiente forma:

```js
{
  id: 'ventas',
  name: 'Ventas',
  icon: '🤝',
  description: 'Cierra tratos con clientes.',
  basePrice: 100,
  baseProduction: 0.5,       // €/s con 1 unidad
  priceMultiplier: 1.15,
  milestones: [              // Atributos que se desbloquean por cantidad
    { quantity: 10, effect: 'ventas_presion_comercial' },
    { quantity: 25, effect: 'ventas_pipeline' },
    { quantity: 50, effect: 'ventas_expansion' },
  ],
  unlockCondition: (state) => state.totalEarned >= 50,  // 50% del precio base
}
```

---

## 7. Módulo de Mejoras (`upgrades.js`)

```js
{
  id: 'U01',
  name: 'Café de la oficina',
  description: 'El café lo cambia todo. ×2 producción Freelancer.',
  icon: '☕',
  cost: 50,
  condition: (state) => state.departments.freelancer >= 1,
  purchased: false,
  effect: { type: 'multiplier', target: 'freelancer', value: 2 },
}
```

---

## 8. Persistencia (`save.js`)

### Guardar
```js
localStorage.setItem('officeKillerSave', JSON.stringify({
  ...state,
  lastSaved: new Date().toISOString(),
}));
```

### Cargar (con offline progress)
```js
const raw = localStorage.getItem('officeKillerSave');
if (raw) {
  const saved = JSON.parse(raw);
  const secondsOffline = (Date.now() - new Date(saved.lastSaved)) / 1000;
  const cappedSeconds = Math.min(secondsOffline, 8 * 3600); // máx 8h
  saved.money += calculateIncome(saved) * cappedSeconds;
  Object.assign(state, saved);
}
```

### Seguridad
- Los datos de save se validan antes de aplicarlos (se comprueba que los valores sean numéricos y no `NaN` / `Infinity` maliciosos).
- No se ejecuta ningún código proveniente del save (no `eval`, no `Function()`).

---

## 9. Convenciones de Código

- **Sin clases**: Se usa el patrón módulo puro (objetos y funciones, sin `class`).
- **Inmutabilidad parcial**: Los datos de configuración (departamentos, mejoras) son `const` y no se mutan; el estado sí es mutable.
- **Nombrado**: `camelCase` para variables y funciones, `SCREAMING_SNAKE_CASE` para constantes de configuración.
- **Sin comentarios obvios**: Solo se comenta la lógica no evidente.

---

## 10. Hoja de Ruta de Versiones

| Versión | Feature principal |
|---|---|
| **v0.1** | Loop básico, 10 departamentos, mejoras, guardado local |
| **v0.2** | Logros, estadísticas, noticias de empresa, UI pulida |
| **v0.3** | Prestige (Sistema de Acciones), eventos aleatorios |
| **v0.4** | Árbol tecnológico IT, departamentos desbloqueables dinámicamente |
| **v0.5** | Ranking offline entre amigos (export/import de save como código) |
