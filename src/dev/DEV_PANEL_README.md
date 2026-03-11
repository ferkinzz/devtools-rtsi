# Dev Panel

Panel interno de desarrollo. Solo disponible en `NODE_ENV=development`.

## Setup

1. Copia `src/dev/` a tu proyecto
2. Copia `app/dev/page.tsx` y `app/api/dev-data/route.ts`
3. Agrega el middleware (o fusiona con el tuyo)
4. Agrega `.dev/` a tu `.gitignore`

```gitignore
# Dev Panel data
.dev/
```

## Uso

Accede en: `http://localhost:3000/dev`

### Captura rápida (sidebar)
- `Enter` → crea una task
- `! texto` → crea una idea
- `#tag` → agrega tags automáticamente

### Tags disponibles
`#backend` `#ui` `#bug` `#feature` `#refactor` `#docs` `#perf` `#api`

## Datos

Se guardan en `.dev/data.json` en la raíz del proyecto. El archivo se crea automáticamente al primer uso.

## Protección en producción

Bloqueado por:
1. **Middleware** (`middleware.ts`) — redirige `/dev/*` y `/api/dev-data` en producción
2. **Redirect en page.tsx** — segunda capa de protección
3. **API route** — devuelve 404 si `NODE_ENV === "production"`

## Stack

- Next.js 15+ (App Router)
- React 18+
- Tailwind CSS
- Shadcn (preparado, sin dependencias duras)

## Estructura

```
src/dev/
  DevPanel.tsx              # Entry point
  types.ts                  # Tipos
  hooks/
    useDevStore.ts          # Estado + persistencia
  components/
    TaskBoard.tsx           # Tasks + ideas + filtros
    StickyNotes.tsx         # Notas sticky
    DecisionLog.tsx         # Log de decisiones (ADR)

app/dev/page.tsx            # Página
app/api/dev-data/route.ts   # API de persistencia
middleware.ts               # Bloqueo en producción
.dev/data.json              # Datos (auto-creado, en .gitignore)
```
