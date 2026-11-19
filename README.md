# ModelToys

Tienda React + Vite y tres microservicios Java 21 con Gateway WebFlux, JWT RS256, MySQL 8.4 y Docker Compose. Conserva las pantallas, imágenes y estilos originales. Catálogo, carrito, usuarios, foro y órdenes ahora se guardan en el backend.

## Arrancar

Requisitos: Docker con Compose, Python 3 y OpenSSL. Java 21, Maven y Node se necesitan para pruebas/desarrollo desde el host.

En CachyOS, si faltan Docker/Compose:

```sh
sudo pacman -S --needed docker docker-compose
sudo systemctl start docker
sudo usermod -aG docker takazu
```

Después de agregar el grupo, vuelve a iniciar tu sesión de usuario para que se apliquen los permisos. El grupo Docker tiene privilegios administrativos sobre sus contenedores.

Desde la raíz del proyecto:

```sh
python scripts/preparar-entorno.py
docker compose up -d --build --wait
docker compose ps
```

Si `.env` ya existe, el generador lo conserva y termina sin sobrescribirlo. Completa variables faltantes según `.env.example`. La interfaz queda en **http://localhost:8088**, las APIs en **http://localhost:8080/api**. MySQL publica solo `127.0.0.1:3306`; los servicios de negocio no exponen puertos al host.

El generador crea contraseñas aleatorias y claves RSA 3072 en `.env`, permisos 600 e ignorado por Git. No compartas ni subas este archivo. Para un administrador, completa `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_NAME` y `ADMIN_BOOTSTRAP_PASSWORD` (mínimo 12 caracteres, máximo 72 bytes), luego recrea usuarios:

```sh
docker compose up -d --force-recreate ms-usuarios
```

Cada entorno define su propia cuenta de demostración en `.env`. El bootstrap crea el administrador al iniciar si su correo aún no existe.

Para detener y conservar los datos, usa `docker compose stop`. El volumen `mysql_data` conserva MySQL y los scripts de inicialización se ejecutan al crear un volumen nuevo.

## Desplegar en EC2

Con la instancia en ejecución, configura `.env` en la raíz del proyecto y deja `VITE_API_URL=` para que el frontend envíe las solicitudes al mismo origen. Permite HTTP TCP 80 en el grupo de seguridad y levanta la aplicación.

```sh
docker compose -f compose.yaml -f compose.aws.yaml up -d --build --wait
docker compose -f compose.yaml -f compose.aws.yaml ps
curl -f http://localhost/api/productos
```

La tienda se abre en `http://<IP_PUBLICA>/`. Nginx envía `/api` al Gateway. En una ejecución local, abre Swagger UI en `http://localhost:8080/swagger-ui.html`.

## Probar cada etapa

```sh
# Desde backend/: registro/login/seguridad, luego tienda, administración, Gateway.
mvn -pl ms-usuarios clean verify
mvn -pl ms-carrito clean verify
mvn -pl ms-admin clean verify
mvn -pl gateway clean verify
mvn clean verify
```

Por defecto las suites de persistencia usan H2 en modo MySQL. Para probar MySQL real, desde la raíz y con el contenedor iniciado:

```sh
python scripts/probar-usuarios-mysql.py
python scripts/probar-usuarios-mysql.py --servicio ms-carrito
python scripts/probar-integracion.py
```

Los dos primeros crean bases exclusivas de pruebas y las conservan. El último recorre los servicios reales por Gateway, crea datos de demostración y los conserva: usuario, publicaciones y órdenes pendientes. Si hay administrador configurado en `.env`, comprueba también las operaciones administrativas y da de baja lógica al usuario de prueba. No realiza cobros.

Frontend, desde `frontend/`:

```sh
npm ci
npm run lint
npm run test:run
npm run build
npm run dev
```

Vite sirve en 5173 y envía `/api` a Gateway 8080. Nginx usa ese mismo contrato en Docker. No se necesitan tokens ni contraseñas en variables Vite.

## Demostración para DUOC

1. Abre 8088, revisa categorías, filtros y preventas.
2. Registra un piloto. Revisa su perfil y publica una consulta en el foro.
3. Agrega productos, cambia cantidades y registra una orden con RUT válido, por ejemplo `12.345.678-5`. El backend determina el total.
4. Revisa el historial y su estado `Pendiente de pago`.
5. Cierra sesión e ingresa con el administrador configurado localmente. Edita un precio/disponibilidad, exporta CSV y revisa usuarios/órdenes.
6. Muestra las pruebas y explica que cada servicio verifica JWT y que admin comunica por HTTP, sin compartir bases.

## Alcance

No hay pasarela de pago ni facturación: se registran órdenes pendientes. Stock representa la disponibilidad booleana existente en React; no se inventaron unidades físicas. JWT solo en memoria: recargar requiere ingresar de nuevo. Los JWT previos a una baja pueden seguir autorizando carrito hasta expirar; no hay revocación distribuida. No se importaron los datos de negocio guardados por versiones antiguas en localStorage; retira conscientemente las antiguas claves `usuarios_db`/`usuario_sesion` de tu navegador si contienen contraseñas.

Pruebas realizadas en el proyecto: `mvn clean verify` (12 pruebas), suites MySQL (7 de usuarios y 2 de carrito), 20 pruebas React, compilación de producción y recorrido HTTP integrado. El script integrado comprueba también checkout concurrente y CORS.
