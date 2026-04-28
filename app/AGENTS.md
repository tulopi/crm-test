# Guía para IAs (TRAMICRM / Angular)

Documento de referencia para implementar UI y componentes en este proyecto. **Antes de crear o modificar componentes visuales**, revisa esta guía y los archivos enlazados.

## Stack

- **Angular** ~20, **TypeScript** ~5.8, **Angular Material** + **CDK**
- Estilos: **SCSS** (`inlineStyleLanguage: scss` en `angular.json`)
- **Prefijo de selector:** `app` (p. ej. `app-mi-widget`)
- **SSR:** configurado en el proyecto; evita APIs solo de navegador sin protección de plataforma cuando corresponda

## Autenticación (MCRM)

- **Sin registro público:** la ruta y la UI de sign-up fueron retiradas; no reintroducir flujo de alta en cliente salvo requisito de negocio.
- **Login:** pantalla en `src/app/auth/login/` (`LoginComponent`, selector `app-login`): **correo**, **extensión** (obligatoria) y **contraseña**; sin OAuth. Conectar `onSubmit()` a la API cuando exista backend.
- **Rutas de auth:** prefijo URL **`/auth`** (hijo `''` = login, más `forgot-password`, `reset-password`, `lock-screen`, `confirm-email`, `logout`). Shell con `<router-outlet>` en `src/app/auth/auth-layout/` (`AuthLayoutComponent`). Las URLs antiguas bajo `/authentication` redirigen a `/auth` (misma jerarquía de hijos).
- El **menú lateral** lista **Inicio** (raíz `/`); el resto de entradas se añaden en `src/app/common/sidebar/sidebar.component.html` hacia rutas bajo `features/` o `auth/` según el producto.

## Modo oscuro (obligatorio en UI nueva)

El tema claro/oscuro lo controla `CustomizerSettingsService` (`src/app/customizer-settings/`): en oscuro añade la clase **`dark-theme`** al `body` (ver `isDark()` en el servicio). Los estilos globales de oscuro viven en [`src/_dark.scss`](src/_dark.scss) y dependen de esa clase.

Los tokens semánticos de marca (texto, superficies) se definen en [`src/_tokens.scss`](src/_tokens.scss) para `:root` y se **redefinen** bajo la misma clase `.dark-theme` (no dupliques paletas en componentes salvo casos puntuales).

**Siempre** al implementar vistas o componentes nuevos:

1. **Probar con el conmutador de tema** del customizer (icono de sol/luna) antes de dar por cerrada la tarea.
2. **Colores:** preferir `var(--text-primary)`, `var(--text-secondary)`, `var(--surface-card)`, `var(--daxaColor)`, etc. (ver `_tokens.scss`) y utilidades del kit (`text-body`, `text-black`, `text-daxa`, …) en lugar de hex fijos.
3. **Angular Material M3 y `body.dark-theme`:** `mat.theme()` está aplicado en **`html`** con sistema **claro**. La clase **`dark-theme`** está solo en **`body`**. Los `mat-form-field`, labels flotantes y textos que dependan de `--mat-sys-on-surface` pueden quedar ilegibles si no heredan tokens oscuros. En este proyecto, **`_dark.scss`** ya redefine bajo `.dark-theme` variables **`--mat-sys-*`** (superficie / `on-surface` / outline) y refuerza **`.mat-mdc-form-field`** (incl. `--mat-form-field-outlined-*` / MDC). **Antes de añadir overrides locales**, revisa si basta con ampliar `_dark.scss`; si creas una pantalla nueva con muchos `mat-*`, comprueba contraste en oscuro.
4. **Utilidades `text-*` en el mismo elemento:** varias usan `color: … !important` en [`_utilities.scss`](src/_utilities.scss). **Gana la regla que aparece más abajo en el fichero**, no el orden de las clases en el HTML. Ejemplo que falló: `text-daxa` + `text-body` en un `<a>` — `text-body` anulaba el enlace y casi no se veía en oscuro. **No mezclar** dos utilidades de color contradictorias; usa una sola (`text-daxa` para enlace de acento, o solo tokens en SCSS).
5. **Etiquetas sobre fondos de tarjeta en auth:** `text-black` bajo `.dark-theme` se invierte en [`_dark.scss`](src/_dark.scss) a texto claro; si algo sigue ilegible, preferir **`color: var(--text-primary)`** en SCSS del bloque (p. ej. `.daxa-form .main-label`) en lugar de forzar hex.
6. **Superficies tipo tarjeta / formulario aislado:** inyectar `public themeService: CustomizerSettingsService` y, cuando la pieza lo necesite, `[class.component-dark-theme]="themeService.isDark()"` (p. ej. formularios auth: [`login.component.html`](src/app/auth/login/login.component.html)). **`card-borderd-theme`** y **`rtl-enabled`** ya están en el `div` raíz de [`app.html`](src/app/app.html): aplican a **descendientes** (no hace falta repetirlos en cada `mat-card` del área principal).
7. **`mat-card` dentro del shell (home, features, etc.):** usar el mismo patrón que 404 / errores: clases **`daxa-card`**, **`border-radius`**, **`bg-white`**, **`border-none`**, **`d-block`** (y utilidades de texto como **`text-black`** en títulos). Sin **`daxa-card`**, Material queda fuera de [`_typography.scss`](src/_typography.scss) y el modo oscuro del body no armoniza con cabecera / barra lateral. Referencia: [`inicio.component.html`](src/app/features/inicio/inicio.component.html), [`not-found.component.html`](src/app/common/not-found/not-found.component.html).
8. **SCSS del componente:** si necesitas reglas que solo apliquen en oscuro, anidar bajo `:host-context(.dark-theme)` o reutilizar selectores que ya existan en `_dark.scss` / `_ui-kit.scss` para no duplicar paletas.
9. **Material:** usar componentes `mat-*` estándar; si el contraste falla en oscuro, revisar primero tokens en `_dark.scss` (apartado anterior) antes de parches con `::ng-deep`.
10. **No** dejar bloques con fondo claro hardcodeado (`#fff`, etc.) sin contraparte visible cuando `body.dark-theme` esté activo; preferir `bg-white` (remapeada en oscuro en `_dark.scss`) o `var(--surface-card)`.

## Convención de componentes

- Componentes **standalone**: `imports: [...]` en el decorador `@Component` (sin `NgModule` propio salvo excepciones del template).
- Ficheros habituales: `*.ts`, `*.html`, `*.scss` junto al TypeScript.
- Rutas y configuración de la app: `src/app/app.config.ts` (incluye `provideAnimationsAsync()` para Material/animaciones).

## Tema Angular Material (M3)

El tema global se define en `src/styles.scss` sobre `html` con `@include mat.theme(...)`:

- **Color:** `primary: mat.$rose-palette`, `tertiary: mat.$yellow-palette`
- **Tipografía del tema Material:** `Plus Jakarta Sans` (cuerpo), `Space Grotesk` (marca)
- **Density:** `0`

El sistema M3 que genera el mixin vive en **`html`** en modo claro; el modo oscuro de producto se aplica con **`body.dark-theme`** y variables en `_tokens.scss` + `_dark.scss` (ver sección **Modo oscuro**, punto 3).

Para nuevos usos de Material (`mat-button`, `mat-form-field`, tablas, etc.), **respeta el tema existente**; no sustituyas la paleta salvo requisito explícito. Guía oficial: [Theming](https://material.angular.dev/guide/theming).

## Tokens CSS de marca

Definidos en [`src/_tokens.scss`](src/_tokens.scss) (`:root` y bloque `.dark-theme`). En componentes, **prioriza** `var(--...)` en lugar de hex arbitrarios.

| Variable | Uso típico |
|----------|------------|
| `--fontFamily` / `--fontFamilyDisplay` | Tipografía UI / titulares |
| `--fontSize` | Tamaño base (16px) |
| `--color-primary` / `--daxaColor` | Primario rubí (CTA, enlaces de acento) |
| `--color-secondary` / `--primaryColor` | Secundario oro (legacy “primary” en utilidades) |
| `--text-primary`, `--text-secondary`, `--text-muted` | Jerarquía de texto |
| `--surface-page`, `--surface-card`, `--surface-muted` | Fondos y tarjetas |
| `--dangerColor`, `--infoColor`, `--warningColor`, `--successColor` | Estados |
| `--blackColor` | Texto principal (mapea a `--text-primary`) |
| `--whiteColor` | Texto sobre primario / alto contraste |
| `--bodyColor` | Texto secundario (mapea a `--text-muted`) |
| `--transition` | Transiciones |
| `--borderBoxShadow` | Sombras de tarjeta / contenedor |

**Fondo por defecto del body:** `var(--surface-page)` en `styles.scss`; en oscuro, tokens y `_dark.scss` actualizan superficies y texto.

## Estilos globales importados

Desde `src/styles.scss` se cargan (ficheros físicos con guion bajo en `src/`):

- `_tokens.scss` — paleta y variables semánticas (importado antes que el mixin `mat.theme`)
- `_utilities.scss` — utilidades
- `_ui-kit.scss` — kit de UI compartido
- `_typography.scss` — tipografía
- `_rtl.scss` — RTL
- `_dark.scss` — modo oscuro (incl. alineación M3 bajo `.dark-theme`)

Reutiliza clases y patrones de ahí antes de duplicar utilidades en un solo componente.

## CSS ya incluido en el build

En `angular.json`, `styles` incluye entre otros:

- `ngx-owl-carousel-o` (temas carousel)
- `remixicon` (iconos)

Puedes usar clases **Remix Icon** (`ri-*`) sin añadir otra librería de iconos salvo decisión de producto.

## Checklist: nuevo componente

1. Selector con prefijo **`app-`**.
2. Componente **standalone** con `imports` explícitos (Material, `CommonModule`, etc.).
3. Estilos en **SCSS** del componente; usar **`var(--...)`** según `_tokens.scss` (y la tabla de esta guía).
4. Cumplir la sección **Modo oscuro** (M3 + `body.dark-theme`, sin utilidades `text-*` contradictorias en el mismo nodo, prueba en el customizer).
5. Preferir **Angular Material** para controles estándar (formularios, diálogos, tablas) alineados con el tema M3.
6. No reintroducir utilidades que ya existan en `_utilities.scss` / `_ui-kit.scss`.
7. Animaciones: el proyecto ya provee animaciones asíncronas en `app.config.ts`; no desactives el paquete sin motivo.

## Rutas y features MCRM

- **Ruta raíz (`/`):** componente lazy `InicioComponent` en `src/app/features/inicio/` (definido en `app.routes.ts` con `loadComponent`). Incluye avisos de incidencias CRM y una tabla **agente / extensión** cuyos datos se mantienen en [`crm-agents.data.ts`](src/app/features/inicio/crm-agents.data.ts). La UI usa **`mat-card` con clase `daxa-card`** y utilidades del kit (ver sección **Modo oscuro**, punto 4).
- **`/auth`:** flujo de autenticación (layout + hijos) descrito arriba; enlaces internos deben usar **`/auth/...`** (p. ej. cabecera → `/auth/logout`).
- **Plantillas útiles del kit:** `coming-soon` (`src/app/common/coming-soon-page/`), `blank-page`, `internal-error`, y ruta comodín `**` → `NotFoundComponent`; el resto de rutas demo del template Daxa fue retirado de `app.routes.ts` y del árbol `src/app/`.
- **Menú lateral:** en `src/app/common/sidebar/sidebar.component.html` hay enlace a **Inicio** (`routerLink="/"`). Añade aquí más `routerLink` / paneles hacia otras `features/` o `auth/` según el producto.
- **`/perfil`:** pantalla **Agente** (`src/app/features/agente/`, `AgenteComponent`, selector `app-agente`). Formulario reactivo (Material), avatar, ajustes adicionales y bloque administrativo condicionado por permisos. Los datos de demo viven en `agente.data.ts` hasta existir API.
- **Permisos en perfil:** `AgentPermissionsService` (`src/app/features/agente/agent-permissions.service.ts`, `providedIn: 'root'`) expone señales `canEditAdminFields` y `canChangePassword` (por defecto `false`). Tras login, el flujo de auth debe llamar a `setFromSession({ ... })` (o en el futuro `loadFromApi`) para desbloquear contraseña y bloque administrativo según rol.

## Cabecera

- Textos de la barra superior en **español**; sin selector de idioma. Correo y notificaciones son menús vacíos de plantilla hasta conectar datos.
- El menú de usuario incluye **Perfil** (`/perfil`), **Ficha laboral**, **Academia**, **Buzón** y **Cerrar sesión** (`/auth/logout`). No se usa la ruta legacy **`/my-profile`**.

## Referencias de implementación (molde)

- Layout shell: `src/app/app.ts`, `src/app/app.html`, `src/app/app.scss`
- Cabecera / pie / barra lateral: `src/app/common/header/`, `src/app/common/footer/`, `src/app/common/sidebar/`
