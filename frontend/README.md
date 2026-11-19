# Frontend ModelToys

## Integración con microservicios

El frontend llama a `/api` en el mismo origen. Vite reenvía esas solicitudes a `localhost:8080` en desarrollo. Nginx las reenvía a `gateway:8080` en Docker. La aplicación completa se inicia con Docker Compose desde la raíz del proyecto. [Instrucciones de arranque](../README.md#arrancar)

React mantiene el JWT en memoria y el UUID del invitado en `sessionStorage`. Al recargar se vuelve a solicitar el inicio de sesión. Las órdenes se registran con estado `Pendiente de pago`.
