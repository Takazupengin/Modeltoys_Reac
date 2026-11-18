# Despliegue de ModelToys en AWS

Arquitectura recomendada: **React en EC2 o S3 + Docker Compose**, o bien **todo el backend en una EC2**. Para una presentación sencilla se recomienda una EC2 para MySQL y los servicios Java, y S3 para el frontend React.

## Opciones

- **EC2 completa:** Docker Compose publica Gateway 8080 y opcionalmente frontend 8088.
- **EC2 + S3:** Gateway 8080 en EC2 y archivos React en S3.
- **Recomendada:** EC2 + S3, con el gateway protegido por el Security Group y CORS limitado al origen de S3.

MySQL nunca debe quedar público; el Compose mantiene el puerto 3306 enlazado solamente a localhost.

## 1. Crear la EC2

1. En AWS Academy abre EC2 y selecciona **Launch instance**.
2. Nombra la instancia `modeltoys-backend`.
3. Sistema operativo: Amazon Linux 2023 o Ubuntu 22.04.
4. Tipo: `t3.small` recomendado; como mínimo `t3.micro` si el lab lo permite.
5. Crea o reutiliza un par de claves `.pem`.
6. Security Group:
   - SSH TCP 22 desde tu IP.
   - HTTP TCP 8080 desde `0.0.0.0/0` para el gateway.
   - TCP 8088 opcional si usarás el frontend Docker.
   - No agregues TCP 3306.
7. Guarda una IP elástica y asígnala a la instancia.

## 2. Instalar Docker

Amazon Linux:

```bash
sudo dnf update -y
sudo dnf install docker -y
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
sudo dnf install docker-compose-plugin -y
```

En Ubuntu:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```

Cierra la sesión SSH y vuelve a entrar. Comprueba:

```bash
docker --version
docker compose version
```

## 3. Subir el proyecto

Desde tu computador:

```fish
scp -i "clave.pem" -r . ec2-user@<IP_ELASTICA>:~/Modeltoys_Reac
```

Para Ubuntu cambia `ec2-user` por `ubuntu`.

Si el proyecto está clonado con Git, sube el `.env` por separado y nunca lo incluyas en Git:

```fish
scp -i "clave.pem" .env ec2-user@<IP_ELASTICA>:~/Modeltoys_Reac/.env
```

En EC2, crea el `.env` si no existe:

```bash
cd ~/Modeltoys_Reac
python3 scripts/preparar-entorno.py
```

Añade al `.env` el origen permitido para CORS. Para frontend Docker:

```text
CORS_ALLOWED_ORIGINS=http://<IP_ELASTICA>:8088
```

Para frontend S3:

```text
CORS_ALLOWED_ORIGINS=http://<S3_WEBSITE_URL>
VITE_API_URL=http://<IP_ELASTICA>:8080
```

Completa también el administrador si quieres crear su cuenta al iniciar:

```text
ADMIN_BOOTSTRAP_EMAIL=admin@modeltoys.cl
ADMIN_BOOTSTRAP_PASSWORD=UnaClaveSegura123!
```

## 4. Levantar los contenedores

Para EC2 completa:

```bash
cd ~/Modeltoys_Reac
docker compose -f compose.yaml -f compose.aws.yaml up -d --build --wait
docker compose -f compose.yaml -f compose.aws.yaml ps
```

Comprueba desde EC2:

```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8088/
```

Comprueba desde tu navegador:

```text
http://<IP_ELASTICA>:8088
http://<IP_ELASTICA>:8080/swagger-ui.html
```

## 5. Publicar React en S3

1. Abre S3 y crea un bucket público único.
2. Activa **Static website hosting**.
3. Index document: `index.html`.
4. Error document: `index.html`.
5. Genera el frontend con `VITE_API_URL` apuntando al gateway:

```fish
cd /home/takazu/Documentos/Modeltoys_Reac
VITE_API_URL=http://<IP_ELASTICA>:8080 npm --prefix frontend run build
```

6. Sube todo el contenido de `frontend/dist` al bucket.
7. Desbloquea bloqueo público y añade una política que permita `s3:GetObject` al público.

Después añade la URL exacta del sitio S3 a `CORS_ALLOWED_ORIGINS` y recrea el gateway:

```bash
nano ~/Modeltoys_Reac/.env
cd ~/Modeltoys_Reac
docker compose -f compose.yaml -f compose.aws.yaml up -d --force-recreate gateway
```

## 6. Validación

1. Abre React y registra un usuario.
2. Inicia sesión y agrega productos al carrito.
3. Crea una orden.
4. Abre Swagger y prueba los endpoints públicos.
5. Inicia sesión como administrador y revisa usuarios/órdenes.
6. Ejecuta:

```bash
docker compose -f compose.yaml -f compose.aws.yaml ps
docker compose -f compose.yaml -f compose.aws.yaml logs --tail=100 gateway
```

No debes abrir el puerto 3306 ni publicar la clave privada. JWT, contraseñas y credenciales viven en el archivo `.env` o variables protegidas del contenedor.
