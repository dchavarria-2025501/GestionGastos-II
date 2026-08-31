# GestionGastos-II

Sistema de autenticacion JWT con control de roles (admin / user), construido como monorepo:

- `apps/backend`: API REST (Node.js + Express + TypeScript + JWT + bcrypt + PostgreSQL).
- `apps/frontend`: Aplicacion Angular (standalone components).

## Arranque rapido (leer primero)

Este proyecto **no incluye `node_modules`** (son cientos de MB de dependencias
que no se comprimen bien y cada quien debe instalar segun su sistema operativo).
Por eso, **al abrir el proyecto en tu editor vas a ver errores/subrayados rojos
en todos los archivos**: es normal, significa que faltan instalar las
dependencias, no que el codigo este mal. Esos errores desaparecen apenas
corras `pnpm install` (paso 1 de Backend y paso 1 de Frontend, abajo).

El archivo `apps/backend/.env` **ya viene incluido y configurado** con
`DB_PASSWORD=admin`. **Ya no necesitas crear la base de datos en pgAdmin4**:
el backend la crea sola (junto con la tabla) la primera vez que arranca,
siempre que el servicio de PostgreSQL este corriendo en tu computadora y el
usuario/contraseña del `.env` coincidan con los de esa computadora.

Orden exacto para levantar todo desde cero:

1. Asegurate de que el servicio de PostgreSQL este corriendo (basta con
   tener pgAdmin4 instalado y su servidor activo; no hace falta crear
   ninguna base de datos a mano).
2. `cd apps/backend && pnpm install && pnpm run dev` (esto crea la base de
   datos y la tabla automaticamente) y luego, en cualquier momento,
   `pnpm run seed` para crear el usuario admin.
3. En otra terminal: `cd apps/frontend && pnpm install && pnpm start`
4. Abrir `http://localhost:4200` y entrar con `admin@gestiongastos.com` / `Admin123!`

Si cambias de computadora y el usuario/contraseña de PostgreSQL son
distintos ahi, solo ajusta `DB_USER` y `DB_PASSWORD` en `apps/backend/.env`
para que coincidan con esa maquina — el resto (crear la base de datos y la
tabla) lo hace el backend solo.

## Requisitos

- Node.js 18+
- pnpm (`npm install -g pnpm` si no lo tienes)
- PostgreSQL (probado con pgAdmin4)

## 1. Base de datos (PostgreSQL / pgAdmin4)

**Ya no necesitas crear nada a mano.** El backend, al arrancar:

1. Se conecta a PostgreSQL y revisa si existe la base de datos configurada
   en `DB_NAME` (por defecto `gestor_gastos_db`). Si no existe, la crea.
2. Crea la tabla `usuarios` si todavia no existe.

Lo unico que necesitas de tu lado es tener el servicio de PostgreSQL
corriendo (con pgAdmin4 instalado normalmente ya esta) y que `DB_USER` /
`DB_PASSWORD` en `apps/backend/.env` coincidan con los de esa instalacion
de PostgreSQL. Si quieres ver la estructura creada, el script de referencia
esta en `apps/backend/src/db/schema.sql`.

Datos que guarda la tabla `usuarios`: `id`, `nombre`, `email`, `password_hash`
(contraseña encriptada con bcrypt, nunca en texto plano), `role` y `created_at`
(hora de creacion del usuario).

## 2. Backend

```bash
cd apps/backend
pnpm install     # instala dependencias (aqui desaparecen los errores del editor)
pnpm run seed    # crea el usuario admin (el .env ya viene configurado)
pnpm run dev     # levanta la API en http://localhost:3000
```

El `.env` ya esta incluido en este proyecto con `DB_PASSWORD=admin`. Si tu
PostgreSQL usa otro usuario/contraseña/puerto, ajusta `apps/backend/.env`
directamente (no hace falta copiar `.env.example`, es solo referencia).

Variables de entorno relevantes (`apps/backend/.env`):

| Variable         | Descripcion                                             |
|-------------------|---------------------------------------------------------|
| `DB_HOST`          | Host de PostgreSQL (ej. `localhost`)                    |
| `DB_PORT`           | Puerto de PostgreSQL (ej. `5432`)                        |
| `DB_NAME`           | Nombre de la base de datos: `gestor_gastos_db`           |
| `DB_USER`           | Usuario de PostgreSQL (ej. `postgres`)                    |
| `DB_PASSWORD`       | Contraseña de ese usuario en tu pgAdmin4                  |
| `JWT_SECRET`        | Clave para firmar los tokens (obligatoria, sin valor por defecto) |
| `JWT_EXPIRES_IN`    | Vigencia del token (ej. `1h`)                              |
| `ADMIN_NOMBRE`      | Nombre del usuario admin que crea `pnpm run seed`         |
| `ADMIN_EMAIL`       | Email del usuario admin que crea `pnpm run seed`          |
| `ADMIN_PASSWORD`    | Password del usuario admin que crea `pnpm run seed`       |

Endpoints principales:

| Metodo | Ruta                  | Descripcion                          | Protegido |
|--------|-----------------------|---------------------------------------|-----------|
| POST   | /api/auth/register    | Registro de usuario (rol "user")     | No        |
| POST   | /api/auth/login       | Login, devuelve JWT                  | No        |
| GET    | /api/auth/profile     | Datos del usuario autenticado         | Si        |
| GET    | /api/users            | Listar usuarios                       | Si (admin)|
| PUT    | /api/users/:id        | Editar usuario                        | Si (admin)|
| DELETE | /api/users/:id        | Eliminar usuario                      | Si (admin)|

El payload del JWT incluye `userId`, `email` y `role`.

## 3. Frontend

```bash
cd apps/frontend
pnpm install     # instala dependencias (aqui desaparecen los errores del editor)
pnpm start       # levanta Angular en http://localhost:4200
```

Rutas disponibles: `/login`, `/register`, `/dashboard`, `/profile`, `/admin/dashboard`.

- `AuthGuard` protege las rutas privadas.
- `RoleGuard` restringe `/admin/dashboard` solo a usuarios con rol `admin`.
- Un `HttpInterceptor` adjunta automaticamente el token JWT en cada peticion.
- El navbar cambia dinamicamente segun el estado de sesion y el rol.
- La URL del API no esta quemada en el codigo: se configura en
  `apps/frontend/src/environments/environment.ts` (produccion) y
  `environment.development.ts` (desarrollo).

### Sesion vencida / inactividad

- Si el usuario esta inactivo 15 minutos, o si el backend responde que el
  token vencio o es invalido, aparece automaticamente un aviso con el mensaje
  **"La sesión expiró o venció por mostrar inactividad"** y un boton
  **"Ir al login"** que limpia la sesion y regresa a la pantalla de inicio de sesion.
- Logica en `apps/frontend/src/app/core/services/session.service.ts`,
  `core/interceptors/auth.interceptor.ts` y
  `shared/session-expired-modal/`.

### Logo de la empresa (Login)

- La pantalla de login ya tiene el espacio y el estilo reservados para el logo.
- Para mostrarlo, coloca el archivo en
  `apps/frontend/src/assets/logo/logo.png` (ver `assets/logo/README.txt`).
  Mientras no exista el archivo, se muestra un recuadro con el texto "LOGO".

## 4. Usuario administrador de prueba

Tras correr `pnpm run seed` en el backend (con los valores por defecto de `.env.example`):

- Email: `admin@gestiongastos.com`
- Password: `Admin123!`

Cambia `ADMIN_PASSWORD` en tu `.env` antes de usar esto fuera de un entorno local/academico.

## 5. Dashboard dinamico (ingresos y gastos)

El grafico y el balance del dashboard ya no son datos fijos: se calculan a partir
de una tabla real `movimientos` en PostgreSQL. Desde el sidebar, los botones
"Ingresos", "Gastos", "Impuestos" y "Fondo Emergencia" abren un formulario para
agregar un movimiento (descripcion + monto). Mientras el usuario no tenga
ningun movimiento registrado, se muestran los valores de ejemplo del diseño
original; en cuanto agrega el primero, el grafico y el balance reflejan sus
datos reales. "Reportes" y "Mi Tarjeta" siguen mostrando "Proximamente
Disponible", ya que todavia no son modulos reales.

## 6. Foto de perfil

Desde "Mi perfil", el boton "Cambiar foto" permite subir una imagen (se
redimensiona en el navegador antes de enviarla) que se guarda en la base de
datos (columna `avatar_data` de `usuarios`) y se muestra tanto en el perfil
como en el avatar del dashboard.

## 7. Notas de seguridad

- Las contraseñas se almacenan siempre con hash `bcrypt` (nunca en texto plano).
- El backend no arranca si falta `JWT_SECRET` o cualquier variable de conexion
  a la base de datos: no hay valores por defecto "quemados" en el codigo.
