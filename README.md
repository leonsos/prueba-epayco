# Prueba Técnica ePayco - Billetera Virtual

Este proyecto implementa una billetera virtual con un servicio SOAP y un servicio REST como puente entre el cliente y el SOAP. La aplicación permite registrar clientes, cargar dinero a la billetera, realizar pagos, confirmar pagos con tokens y consultar saldos.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MySQL (Puerto 3307)
- Sequelize ORM
- SOAP/node-soap

## Estructura del Proyecto

- `src/soap/`: Implementación del servicio SOAP
- `src/controllers/`: Controladores para el servicio REST
- `src/models/`: Modelos de datos para MySQL con Sequelize
- `src/routes/`: Rutas para el servicio REST
- `src/services/`: Servicios para conectar con el SOAP
- `src/utils/`: Utilidades como la configuración de la base de datos
- `src/app.js`: Configuración de la aplicación Express
- `server.js`: Archivo principal para iniciar los servidores

## Requisitos

- Node.js >= 14.x
- MySQL (Puerto 3307)
- Cuenta de correo para enviar tokens (Gmail recomendado)

## Instalación

1. Clonar el repositorio:
```
git clone <url_del_repositorio>
cd prueba-ePayco
```

2. Instalar dependencias:
```
npm install
```

3. Crear archivo `.env` en la raíz del proyecto con las siguientes variables:
```
PORT=3000
SOAP_PORT=8000
DB_NAME=wallet
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3307
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña
```

4. Crear una base de datos en MySQL llamada `wallet` (la aplicación creará las tablas automáticamente).

## Ejecución

1. Iniciar la aplicación:
```
npm start
```

2. Para desarrollo (con reinicio automático):
```
npm run dev
```

## Endpoints REST

- **Registro de Cliente**: `POST /api/wallet/registro`
  ```json
  {
    "documento": "12345678",
    "nombres": "Usuario Prueba",
    "email": "usuario@ejemplo.com",
    "celular": "3001234567"
  }
  ```

- **Recarga de Billetera**: `POST /api/wallet/recarga`
  ```json
  {
    "documento": "12345678",
    "celular": "3001234567",
    "valor": "50000"
  }
  ```

- **Pagar (Generar Token)**: `POST /api/wallet/pagar`
  ```json
  {
    "documento": "12345678",
    "celular": "3001234567",
    "valor": "20000"
  }
  ```

- **Confirmar Pago**: `POST /api/wallet/confirmar`
  ```json
  {
    "sessionId": "id_retornado_en_el_paso_anterior",
    "token": "codigo_recibido_por_email"
  }
  ```

- **Consultar Saldo**: `POST /api/wallet/saldo`
  ```json
  {
    "documento": "12345678",
    "celular": "3001234567"
  }
  ```

## Importante: Tokens de Confirmación

Al generar un pago con el endpoint `POST /api/wallet/pagar`, la aplicación simula el envío de un email y muestra en la consola del servidor:
- El token de confirmación (código de 6 dígitos)
- El sessionId que necesita para confirmar el pago

**Ejemplo de lo que verá en la consola:**
```
========================================
SIMULACIÓN DE ENVÍO DE EMAIL:
Destinatario: usuario@ejemplo.com
Token de confirmación: 123456
ID de Sesión: 10
========================================
```

Para confirmar el pago debe usar exactamente este token y sessionId en la llamada al endpoint `POST /api/wallet/confirmar`. 
Si intenta usar un token diferente o un sessionId incorrecto, la confirmación fallará.

## Servicio SOAP

El servicio SOAP estará disponible en:
```
http://localhost:8000/wallet?wsdl
```

## Notas

- Asegúrese de que MySQL esté ejecutándose en el puerto 3307.
- Para usar el servicio de correo, configure correctamente las variables `EMAIL_USER` y `EMAIL_PASS` en el archivo `.env`.
- Si usa Gmail, puede necesitar habilitar el acceso de aplicaciones menos seguras o crear una contraseña de aplicación. 