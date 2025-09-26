# Configuración del Backend en Render para Envío de Correos

## Descripción

Este documento explica cómo configurar un backend en Render para procesar el formulario de contacto de tu sitio web estático desplegado en Cloudflare Pages.

## Paso 1: Crear el Servicio Backend en Render

### 1.1 Crear el proyecto Node.js

Crea un nuevo repositorio en GitHub con la siguiente estructura:

```
email-service/
├── package.json
├── server.js
└── .env.example
```

### 1.2 Contenido de `package.json`:

```json
{
  "name": "email-service-render",
  "version": "1.0.0",
  "description": "API service for sending emails from static websites",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "nodemailer": "^6.9.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0"
  },
  "devDependencies": {
    "nodemailer": "^6.9.0"
  }
}
```

### 1.3 Contenido de `server.js`:

```javascript
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration - ajusta el origen según tu dominio de Cloudflare Pages
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 requests por IP en 15 minutos
  message: {
    error: "Demasiadas solicitudes, intenta nuevamente en 15 minutos",
  },
});

app.use("/api/send-email", limiter);
app.use(express.json());

// Configuración del transportador de correo
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Endpoint para enviar emails
app.post("/api/send-email", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validación básica
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Faltan campos requeridos: name, email, message",
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Email inválido",
      });
    }

    // Configurar el correo
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone || "No proporcionado"}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
                <hr>
                <p><em>Este mensaje fue enviado desde el formulario de contacto del sitio web.</em></p>
            `,
      replyTo: email,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Correo enviado exitosamente",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 1.4 Contenido de `.env.example`:

```env
# Puerto del servidor (Render lo asigna automáticamente)
PORT=3000

# Configuración SMTP (ejemplo con Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# Correos
FROM_EMAIL=tu_email@gmail.com
TO_EMAIL=destino@gmail.com

# Orígenes permitidos (tu dominio de Cloudflare Pages)
ALLOWED_ORIGINS=https://tu-sitio.pages.dev,https://tu-dominio-personalizado.com
```

## Paso 2: Desplegar en Render

1. **Conecta tu repositorio** en [render.com](https://render.com)
2. **Crea un nuevo Web Service**
3. **Configura las variables de entorno** en el dashboard de Render:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `FROM_EMAIL`
   - `TO_EMAIL`
   - `ALLOWED_ORIGINS`

## Paso 3: Configurar tu Sitio Web

1. **Actualiza la URL en tu formulario HTML**:
   Reemplaza `YOUR_RENDER_API_URL` en el `action` del formulario con la URL de tu servicio de Render:

   ```html
   <form
     id="contactForm"
     action="https://tu-servicio.onrender.com/api/send-email"
     method="POST"
   ></form>
   ```

2. **Actualiza el JavaScript**:
   En `scripts.js`, asegúrate de que la URL del fetch coincida con tu servicio de Render.

## Opciones de Configuración de Email

### Gmail

1. Activa la verificación en 2 pasos
2. Genera una contraseña de aplicación
3. Usa esa contraseña en `SMTP_PASS`

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Yahoo

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Otros servicios SMTP

Consulta la documentación de tu proveedor de email para obtener la configuración SMTP correcta.

## Seguridad

- El servicio incluye rate limiting (máximo 5 emails por IP cada 15 minutos)
- Validación de datos de entrada
- CORS configurado para tu dominio específico
- Headers de seguridad con Helmet.js

## Pruebas

1. **Prueba local**: Ejecuta `npm run dev` y envía una solicitud POST a `http://localhost:3000/api/send-email`
2. **Prueba en producción**: Usa el formulario de tu sitio web

## Monitoreo

- Render proporciona logs automáticos
- El endpoint `/health` permite verificar el estado del servicio
- Revisa los logs en el dashboard de Render para debuggear errores

## Notas Importantes

- Render puede tardar unos segundos en "despertar" si el servicio ha estado inactivo (plan gratuito)
- Asegúrate de que las variables de entorno estén correctamente configuradas
- Verifica que los orígenes permitidos en CORS coincidan con tu dominio de Cloudflare Pages
