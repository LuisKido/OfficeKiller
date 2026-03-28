# Office Killer — Game Design Document

> Version 0.1 | Fecha: 2026-03-25

---

## 1. Visión General

**Office Killer** es un juego idle/incremental de navegador pensado para los ratos libres de oficina: después del almuerzo, mientras esperas una reunión, o cuando simplemente no hay nada urgente que hacer. El ritmo es tranquilo, los números suben solos y siempre hay algo nuevo que desbloquear.

### Loop principal
```
Generas dinero → Compras departamentos → Los departamentos generan más dinero
→ Desbloqueas mejoras → Más dinero → ... y así infinitamente
```

---

## 2. Mecánicas Core

### 2.1 Moneda principal: lucas 💵
- Toda la economía gira en torno a una sola moneda: **lucas** (referencia chilena: 1 luca = $1.000 CLP).
- Las ganancias se expresan en **lucas/segundo** (ingresos pasivos).
- También existe el **clic manual** sobre el escritorio para generar dinero cuando el jugador quiere interactuar.
- Los números empiezan pequeños (1 luca, 5 lucas…) y van creciendo hasta millones de lucas.

### 2.2 Departamentos (Buildings)
Cada departamento es una "estructura" que puedes comprar varias veces. Cuantas más unidades tienes, mayor es su producción. El precio sube con cada compra (multiplicador × 1.15 por unidad).

| Departamento | Descripción | Producción base/seg | Precio inicial |
|---|---|---|---|
| **Freelancer** | El propio jugador trabajando solo | 0.1 lucas/s | 10 lucas |
| **Ventas** | Cierra tratos con clientes | 0.5 lucas/s | 100 lucas |
| **RRHH** | Contrata gente, mejora productividad | 2 lucas/s | 500 lucas |
| **IT** | Automatiza procesos internos | 10 lucas/s | 2.000 lucas |
| **Marketing** | Atrae más clientes | 40 lucas/s | 8.000 lucas |
| **Finanzas** | Optimiza los flujos de caja | 150 lucas/s | 30.000 lucas |
| **Legal** | Protege contratos, evita multas | 500 lucas/s | 100.000 lucas |
| **Dirección** | Coordina toda la empresa | 2.000 lucas/s | 400.000 lucas |
| **Sede Central** | Oficina de lujo, marca empleadora | 7.500 lucas/s | 1.500.000 lucas |
| **Multinacional** | Expansión global | 30.000 lucas/s | 10.000.000 lucas |

### 2.3 Atributos por Departamento
Cada departamento, al alcanzar ciertos umbrales de cantidad, desbloquea **atributos** que multiplican la producción de toda la empresa o de otros departamentos concretos.

| Departamento | Atributo clave | Efecto de ejemplo |
|---|---|---|
| Ventas | `Presión comercial` | +10% a ingresos de Marketing |
| RRHH | `Cultura de empresa` | +5% a producción global por cada 10 empleados |
| IT | `Automatización` | Elimina el coste de mantenimiento de un departamento de nivel bajo |
| Marketing | `Reconocimiento de marca` | Multiplica ganancias por clic ×2 |
| Finanzas | `Inversión inteligente` | Reduce precios de compra futuros en 5% |
| Legal | `Blindaje corporativo` | Evita penalizaciones (mecánica de eventos negativos futura) |
| Dirección | `Visión estratégica` | +1% a todas las lucas/s por cada departamento distinto que poseas |

### 2.4 Mejoras (Upgrades)
Las mejoras son compras únicas (no repetibles) que se desbloquean al cumplir condiciones. Ejemplos:

| ID | Nombre | Condición de desbloqueo | Efecto |
|---|---|---|---|
| U01 | Café de la oficina | Comprar 1 Freelancer | ×2 producción Freelancer |
| U02 | CRM básico | Comprar 10 Ventas | ×2 producción Ventas |
| U03 | Onboarding digital | Comprar 10 RRHH | ×2 producción RRHH |
| U04 | Servidor propio | Comprar 25 IT | ×3 producción IT |
| U05 | Campaña viral | Comprar 50 Marketing | ×2 producción Marketing + ×1.5 Ventas |
| U06 | Auditoría fiscal | Poseer 100M lucas totales | ×2 producción Finanzas |
| U07 | IPO | Poseer 5 Multinacionales | ×10 a producción global |

### 2.5 Prestige (Reinicio con beneficios) — Futuro v0.3
Al alcanzar un umbral de riqueza total, el jugador puede "vender la empresa" y empezar de cero, obteniendo **Acciones** (moneda prestige). Las Acciones otorgan multiplicadores permanentes.

---

## 3. Progresión y Balanceo

### 3.1 Curva de costos
El costo del n-ésimo edificio del mismo tipo se calcula así:
```
Precio(n) = PrecioBase × 1.15^(cantidadActual)
```

### 3.2 Hitos de desbloqueo
- Cada departamento se desbloquea cuando el jugador tiene **al menos el 50% del precio base** en su balance acumulado históricamente (no el balance actual).
- Esto evita que comprar cosas bloquee el progreso visual.

### 3.3 Tiempo estimado de primera sesión
| Hito | Tiempo estimado (idle puro) |
|---|---|
| Primer empleado de Ventas | ~1 min |
| Primer IT | ~10 min |
| Primer Multinacional | ~4–6 horas |

---

## 4. Interfaz de Usuario (UI)

```
┌──────────────────────────────────────────────────────────────┐
│  OFFICE KILLER       💰 Balance: 1.234 lucas  📈 12,5 lucas/s │
├─────────────────┬────────────────────────────────────────────┤
│                 │  DEPARTAMENTOS                              │
│   [ESCRITORIO]  │  ┌──────────────┐  ┌──────────────┐       │
│                 │  │ 🤝 Ventas  x5│  │ 💻 IT     x2│       │
│   Clic para     │  │ +2.5 lcs/s  │  │ +20 lcs/s   │        │
│   ganar dinero  │  │ Precio: 158 │  │ Precio: 3k  │        │
│                 │  └──────────────┘  └──────────────┘       │
│   [Noticias     │                                             │
│    de empresa]  │  MEJORAS DISPONIBLES                       │
│                 │  [☕ Café de oficina — 50 lucas]            │
│                 │                                             │
└─────────────────┴────────────────────────────────────────────┘
```

### Paneles principales
1. **Panel izquierdo** — Escritorio animado (el "clicker"), noticias de empresa (flavor text)
2. **Panel derecho** — Lista de departamentos disponibles para comprar
3. **Panel central/inferior** — Mejoras disponibles, logros
4. **Header** — Balance actual + €/s en tiempo real

### Notificaciones / Flavor text
Mensajes aleatorios que aparecen en el "feed de empresa" para dar ambiente:
- *"El de IT dice que el servidor caído no es culpa suya."*
- *"RRHH anuncia team building. Nadie está contento."*
- *"Ventas ha cerrado un deal. ¡Celebración con pizza!"*
- *"El microondas de la cocina ha explotado. Otra vez."*

---

## 5. Sistemas Secundarios (Roadmap)

| Versión | Sistema | Descripción |
|---|---|---|
| v0.2 | **Logros** | 50 logros por hitos de cantidad, dinero, tiempo jugado |
| v0.2 | **Estadísticas** | Panel con tiempo jugado, total ganado, clics totales |
| v0.3 | **Prestige / Acciones** | Reinicio con multiplicadores permanentes |
| v0.3 | **Eventos de empresa** | Inspección fiscal, fuga de talento, bonificación anual |
| v0.4 | **Árbol tecnológico** | IT desbloquea automatizaciones en cadena |
| v0.5 | **Modo multijugador asíncrono** | Comparativa de empresa con amigos (ranking offline) |

---

## 6. Estética y Tono

- **Visual**: Pixel art o flat design limpio, paleta cálida de oficina (beis, azul corporativo, verde dinero).
- **Tono**: Humor de oficina, autocrítico, absurdo pero familiar.
- **Sin presión**: El juego avanza solo. No hay penalización por no jugar.
- **Apto para pantalla compartida**: Los números son discretos, no llaman la atención en una pantalla de oficina.

---

## 7. Tecnología

- **Frontend**: HTML5 + CSS3 + JavaScript vanilla (sin dependencias, fácil de abrir en cualquier navegador de empresa)
- **Moneda**: `lucas` — se muestra siempre como número entero redondeado; se usan sufijos (k, M, B) a partir de 1.000 lucas para mantener legibilidad
- **Persistencia**: `localStorage` — el progreso se guarda automáticamente cada 30 segundos y al cerrar la pestaña
- **Offline progress**: Al volver a abrir el juego, se calculan las ganancias offline (máximo 8 horas)
- **Sin servidor**: Todo corre en el navegador, sin backend, sin instalación

---

## 8. Métricas de Éxito (v0.1)

- [ ] El juego arranca sin errores en Chrome, Firefox y Edge
- [ ] El dinero sube de forma visible y motivadora
- [ ] Se pueden comprar al menos 5 departamentos distintos
- [ ] El progreso se guarda y recupera correctamente
- [ ] Las mejoras se desbloquean y aplican bien
