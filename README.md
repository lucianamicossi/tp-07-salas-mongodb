# Trabajo práctico 07 – Salas con MongoDB

## 1. Punto de partida y nombre de la copia.

Este proyecto parte del Trabajo práctico 06 – Salas de estudio modular.

La copia del proyecto se denomina `tp-07-salas-mongodb`.

El objetivo de este trabajo es incorporar una base de datos MongoDB Atlas y un modelo Mongoose para realizar operaciones de persistencia mediante scripts de consola, manteniendo el funcionamiento web desarrollado en la unidad anterior.

La aplicación web conserva las reservas en memoria. Las operaciones de conexión, creación y consulta en MongoDB se realizan mediante programas independientes.

Por lo tanto, las reservas creadas desde el formulario web no se guardan automáticamente en MongoDB y los registros almacenados en la base de datos no aparecen necesariamente en las vistas web.

## 2. Versiones utilizadas y confirmación del uso de Atlas Free (M0).

Versiones verificadas en el entorno de desarrollo:

- **Node.js:** v24.11.1
- **npm:** 11.6.2
- **Express:** 5.2.1
- **Mongoose:** 9.11.2
- **EJS:** 6.0.1
- **Morgan:** 1.12.1
- **Prettier:** 3.9.9
- **ESLint:** 10.11.0
- **@eslint/js:** 10.0.1

La base de datos utilizada es MongoDB Atlas. El proyecto se configura mediante variables de entorno para mantener la URI de conexión fuera del código fuente.

## 3. Pasos desde una descarga nueva: 

### 3.1. Instalar dependencias

Clonar o descargar el repositorio del TP-07 y abrir una terminal en la carpeta del proyecto:

npm install

### 3.2. Preparar el clúster gratuito, usuario e IP permitida

1. Crear una cuenta en MongoDB Atlas o ingresar a una cuenta existente.
2. Crear un clúster gratuito M0.
3. Crear un usuario de base de datos con nombre de usuario y contraseña propios.
4. En Network Access, autorizar la dirección IP pública desde la cual se realizará la conexión.
5. Obtener la cadena de conexión correspondiente al clúster.
6. Configurar la URI localmente, sin publicarla en el repositorio.

La dirección IP autorizada debe actualizarse si cambia la IP pública utilizada. No se recomienda habilitar el acceso desde cualquier dirección IP como solución permanente.

### 3.3. Copiar la plantilla de entorno y ejecutar.

El proyecto utiliza una plantilla `.env.example`. Crear una copia local:

Copy-Item .env.example .env

Completar el archivo `.env` con los valores correspondientes al entorno local. Debe incluir, como mínimo, la variable `MONGODB_URI` con la cadena de conexión de Atlas.

No deben publicarse la contraseña, la URI completa ni otros secretos.

### 3.4. Ejecutar los scripts de MongoDB

Comprobar la conexión:

node --env-file=.env scripts/comprobar-conexion.js

Crear una reserva de prueba:

node --env-file=.env scripts/crear-reserva.js

Listar las reservas almacenadas:

node --env-file=.env scripts/listar-reservas.js

El script de creación inserta un registro nuevo cada vez que se ejecuta. Para evitar duplicados, no ejecutarlo repetidamente sin necesidad.

### 3.5. Ejecutar los controles de calidad

Aplicar el formato:

npm run format

Comprobar el formato y ejecutar ESLint:

npm run check

Los controles incluyen los archivos JavaScript de `src` y `scripts`.

### 3.6. Iniciar la aplicación web

npm start

Por defecto, el servidor se inicia en `http://localhost:3000`, salvo que se configure otro puerto mediante `PORT`.

## 4. Diagnóstico de conexión y DNS

La conexión a MongoDB Atlas requiere resolver el nombre del clúster, alcanzar el servidor y utilizar credenciales válidas.

Durante el diagnóstico pueden distinguirse estos problemas:

- **DNS:** el nombre del clúster no se resuelve.
- **Red:** el servidor no es accesible desde la red utilizada.
- **Lista de acceso:** la IP pública no está autorizada en Atlas.
- **Autenticación:** el usuario, la contraseña o la URI no son correctos.
- **Configuración:** falta `MONGODB_URI` o tiene un formato incorrecto.

En Windows PowerShell se pueden utilizar los siguientes comandos para investigar problemas de DNS y conectividad:

nslookup cluster0.hprxnnu.mongodb.net

Para consultar los registros SRV utilizados por las conexiones `mongodb+srv://`:

nslookup -type=SRV _mongodb._tcp.cluster0.hprxnnu.mongodb.net

Para comprobar la resolución DNS mediante PowerShell:

Resolve-DnsName -Type SRV _mongodb._tcp.cluster0.hprxnnu.mongodb.net

Para comprobar la conectividad TCP al puerto habitual de MongoDB:

Test-NetConnection cluster0-shard-00-00.hprxnnu.mongodb.net -Port 27017

El último comando utiliza un nombre de ejemplo de nodo del clúster. Si no coincide con el nombre real proporcionado por Atlas, debe sustituirse por el host correspondiente.

Si se modifican los resolutores DNS, registrar en esta sección cuáles se utilizaron, qué error motivó el cambio y el resultado obtenido. No se deben declarar cambios de DNS que no se hayan realizado o comprobado.

La conexión funcional se verifica finalmente mediante `scripts/comprobar-conexion.js`.

## 5. Mapa de archivos y explicación de esquema, modelo y colección

La estructura relevante del proyecto es:

tp-07-salas-mongodb/
├── .env
├── .env
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
│
├── scripts/
│   ├── comprobar-conexion.js
│   ├── crear-reserva.js
│   └── listar-reservas.js
│
├── src/
│   ├── index.js
│   ├── app.js
│   │
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   │
│   ├── modelos/
│   │   └── reserva.js
│   │
│   ├── rutas/
│   │   └── reservas.js
│   │
│   ├── controladores/
│   │   └── reservas.js
│   │
│   ├── servicios/
│   │   └── reservas.js
│   │
│   └── middleware/
│       ├── solicitudes.js
│       └── reservas.js
│
├── public/
│   └── css/
│       └── estilos.css
│
└── views/
    ├── layouts/
    │   └── main.ejs
    │
    ├── reservas/
    │   ├── detalle.ejs
    │   ├── lista.ejs
    │   └── nueva.ejs
    │
    ├── inicio.ejs
    └── no-encontrado.ejs


La estructura representa los archivos principales del proyecto; las carpetas `public` y `views` conservan los recursos estáticos y las vistas de la aplicación anterior.

### Responsabilidades principales

- `src/config/entorno.js`: lee y valida la configuración del entorno y la URI de MongoDB.
- `src/config/base-datos.js`: establece y finaliza la conexión con MongoDB mediante Mongoose.
- `src/modelos/reserva.js`: define el esquema y el modelo de reserva.
- `scripts/comprobar-conexion.js`: comprueba la conexión con la base de datos.
- `scripts/crear-reserva.js`: inserta una reserva de prueba.
- `scripts/listar-reservas.js`: consulta y muestra las reservas persistidas.
- `src/index.js` y `src/app.js`: mantienen el arranque y la configuración de Express.
-  `Rutas, controladores, servicios y middleware `: conservan las responsabilidades de la aplicación web.

Los scripts de consola importan `../src/config/base-datos` y `../src/modelos/reserva`. El módulo de conexión importa `./entorno`. El proyecto mantiene CommonJS mediante `require` y `module.exports`.

## 6. Campos y reglas

| Campo        | Tipo     | Reglas |

| `estudiante` | String   | Obligatorio; elimina espacios exteriores mediante `trim`. 
| `email`      | String   | Obligatorio; elimina espacios exteriores y debe contener `@`. 
| `sala`       | String   | Obligatoria; valores permitidos:`Sala Norte`, `Sala Sur`, `Sala Multimedia`

| `fecha`      | String   | Obligatoria; elimina espacios exteriores. 
| `turno`      | String   | Obligatorio; valores permitidos: `Mañana`, `Tarde`, `Noche`. 
| `personas`   | Number   | Obligatorio; entero entre 1 y 6 inclusive. 
| `_id`        | ObjectId | Identificador generado por MongoDB/Mongoose. 

La validación del email es mínima: comprobar que contenga `@` no garantiza que la dirección exista ni que tenga un formato completo válido.

La fecha se almacena como texto. El esquema no comprueba que sea una fecha real, que utilice un formato específico o que corresponda a un día futuro.

Tampoco se comprueba la disponibilidad real de una sala para evitar superposiciones de reservas. Esas validaciones quedan fuera del alcance actual.

## 7. Matriz de pruebas con resultados y evidencia de persistencia entre procesos

Las siguientes pruebas se registran según los resultados obtenidos durante el desarrollo.

| Prueba                          | Resultado |

| `npm run format`                | Correcto; Prettier procesó `src` y `scripts`. 
| `npm run check`                 | Correcto; formato y ESLint finalizaron sin errores. 
| `scripts/comprobar-conexion.js` | Conexión con MongoDB Atlas comprobada. 
| `scripts/crear-reserva.js`      | Se creó una reserva y se obtuvo un `_id`. 
| `scripts/listar-reservas.js`    | Se recuperó la reserva creada. 
| GET `/`                         | Página principal comprobada. 
| GET `/estado`                   | Respuesta correcta; cuatro reservas iniciales en memoria.
| GET `/reservas`                 | Listado comprobado. 
| Formulario válido               | Redirección y creación en memoria comprobadas. 
| Formulario inválido             | Respuesta HTTP 400 comprobada. 
| Archivo CSS                     | Archivo estático accesible. 
| Ruta inexistente                | Página 404 comprobada. 

### Evidencia de persistencia entre procesos

Se ejecutó el script de creación y, posteriormente, el script de listado como procesos de consola separados. La reserva creada continuó disponible en MongoDB.

El registro de prueba incluyó estos valores:

- Estudiante: `Juan Perez`.
- Email de prueba: `juan.prueba@example.com`.
- Sala: `Sala Norte`.
- Fecha: `2026-10-25`.
- Turno: `Mañana`.
- Personas: `2`.
- `_id` observado: `6ad854e24f146155a47d1303`.

Este resultado permite comprobar que el documento no depende de la memoria del proceso que lo creó. El identificador y los datos deben coincidir con la evidencia real de la ejecución y de Atlas.

Las pruebas del formulario web son independientes: no modifican la colección de MongoDB.

## 8. Explicación de por qué el sitio continúa en memoria y qué se abordará en la unidad 8

La aplicación web conserva el comportamiento del TP-06: las cuatro reservas iniciales se cargan al iniciar el servidor y las reservas nuevas se mantienen en memoria durante esa ejecución.

La incorporación de MongoDB en este trabajo se limita a los scripts de consola. Por ese motivo, los documentos de la colección `reservas` no tienen por qué aparecer en las vistas web.

En la unidad 8 se podrá abordar la integración de la persistencia con la aplicación web, según la consigna correspondiente. Esa integración no forma parte del alcance de este TP-07.

## 9. Confirmación de que no se publican .env, credenciales ni datos personales

El repositorio no debe incluir:

- `.env`;
- contraseñas;
- URI de conexión con credenciales;
- datos personales reales o secretos;
- otros archivos que contengan credenciales.

Se utiliza `.env.example` como plantilla, sin valores secretos.

El archivo `.gitignore` debe excluir `.env`, `node_modules` y otros archivos locales que no deban publicarse.

Antes de subir el proyecto, revisar los archivos preparados para el commit y verificar que ninguna credencial haya quedado registrada en el historial de Git.

La URI de conexión, la contraseña del usuario de base de datos y otros secretos deben mantenerse fuera del README y del repositorio público.
