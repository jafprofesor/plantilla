# Configuración de Cloudflare Pages Functions para Envío de Correos

## Descripción

Esta configuración utiliza Cloudflare Pages Functions para procesar formularios de contacto directamente desde tu sitio estático, sin necesidad de servidores externos.

## Estructura de Archivos

```
plantilla/
├── index-cloudflare.html          # Versión HTML para Cloudflare
├── js/
│   └── scripts-cloudflare.js      # JavaScript específico para Cloudflare
├── functions/
│   └── api/
│       └── send-email.js          # Cloudflare Pages Function
└── CLOUDFLARE_SETUP.md           # Esta documentación
```

## Configuración Paso a Paso

### 1. Preparar tu Proyecto

1. **Renombra el archivo**: `index-cloudflare.html` → `index.html` (o úsalo como archivo principal)
2. **Actualiza el JavaScript**: Asegúrate de que `index.html` apunte a `scripts-cloudflare.js`

### 2. Configurar Variables de Entorno en Cloudflare Pages

Ve a tu dashboard de Cloudflare Pages > Settings > Environment Variables y agrega:

#### Para Resend (Recomendado)

```
RESEND_API_KEY=re_xxxxxxxxxx
FROM_EMAIL=noreply@tu-dominio.com
TO_EMAIL=contacto@tu-dominio.com
```

#### Para Mailgun

```
MAILGUN_API_KEY=tu-api-key-de-mailgun
MAILGUN_DOMAIN=tu-dominio.mailgun.org
FROM_EMAIL=noreply@tu-dominio.com
TO_EMAIL=contacto@tu-dominio.com
```

#### Para SendGrid

```
SENDGRID_API_KEY=SG.xxxxxxxxxx
FROM_EMAIL=noreply@tu-dominio.com
TO_EMAIL=contacto@tu-dominio.com
```

#### Para EmailJS

```
EMAILJS_PUBLIC_KEY=tu-public-key
EMAILJS_SERVICE_ID=tu-service-id
EMAILJS_TEMPLATE_ID=tu-template-id
FROM_EMAIL=noreply@tu-dominio.com
TO_EMAIL=contacto@tu-dominio.com
```

### 3. Configurar Proveedores de Email

#### Opción 1: Resend (Recomendada)

1. Regístrate en [resend.com](https://resend.com)
2. Verifica tu dominio
3. Obtén tu API key
4. Configura las variables de entorno

**Ventajas de Resend:**

- Diseñado específicamente para desarrolladores
- Excelente integración con Cloudflare
- Generosas límites gratuitas (3,000 emails/mes)
- Fácil configuración

#### Opción 2: Mailgun

1. Regístrate en [mailgun.com](https://mailgun.com)
2. Verifica tu dominio
3. Obtén tu API key y dominio
4. Configura las variables de entorno

#### Opción 3: SendGrid

1. Regístrate en [sendgrid.com](https://sendgrid.com)
2. Crea una API key
3. Verifica tu dominio de envío
4. Configura las variables de entorno

#### Opción 4: EmailJS

1. Regístrate en [emailjs.com](https://emailjs.com)
2. Configura un servicio de email (Gmail, Outlook, etc.)
3. Crea un template de email
4. Obtén tus IDs de servicio y template

### 4. Desplegar en Cloudflare Pages

#### Opción A: Desde Git (Recomendado)

1. Sube tu código a GitHub/GitLab
2. Ve a Cloudflare Pages dashboard
3. Crea un nuevo proyecto conectado a tu repositorio
4. Configura las variables de entorno
5. Despliega

#### Opción B: Subida Directa

1. Ve a Cloudflare Pages dashboard
2. Crea un nuevo proyecto con "Direct Upload"
3. Sube tu carpeta del proyecto
4. Configura las variables de entorno

### 5. Configurar Dominio Personalizado (Opcional)

1. En Cloudflare Pages > Custom domains
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones
4. Actualiza la variable `FROM_EMAIL` con tu dominio

## Características

### ✅ Ventajas de Cloudflare Pages Functions

- **Gratis**: 100,000 invocaciones/mes en el plan gratuito
- **Rápido**: Edge computing, latencia mínima
- **Seguro**: HTTPS automático, protección DDoS
- **Escalable**: Maneja picos de tráfico automáticamente
- **Simple**: No requiere gestión de servidores

### ✅ Características de Seguridad Incluidas

- Validación de datos de entrada
- Validación de formato de email
- Limitación de rate limiting básica
- Sanitización de contenido HTML
- Headers de seguridad automáticos

### ✅ Manejo de Errores

- Validación de campos requeridos
- Mensajes de error específicos
- Logging de errores para debugging
- Fallbacks para diferentes proveedores

## Testing

### Prueba Local

```bash
# Usar Wrangler CLI para desarrollo local
npm install -g wrangler
wrangler pages dev .
```

### Prueba en Producción

1. Despliega tu sitio en Cloudflare Pages
2. Prueba el formulario desde tu sitio live
3. Verifica los logs en el dashboard de Cloudflare

## Monitoreo

### Logs de Cloudflare

- Ve a Cloudflare Pages > Functions
- Revisa los logs en tiempo real
- Monitorea errores y uso

### Métricas de Email

- Revisa las métricas en tu proveedor de email
- Monitorea la entregabilidad
- Verifica las tasas de rebote

## Configuración de DNS para Emails

Para mejorar la entregabilidad, configura estos registros DNS:

```
# SPF Record
TXT @ "v=spf1 include:_spf.resend.com ~all"

# DKIM (proporcionado por tu proveedor)
TXT resend._domainkey "..."

# DMARC
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@tu-dominio.com"
```

## Troubleshooting

### Error 500: "No hay configuración de email válida"

- Verifica que las variables de entorno estén configuradas
- Asegúrate de usar el nombre exacto de las variables
- Redespliega después de cambiar variables

### Emails no se envían

- Verifica tu API key
- Confirma que el dominio está verificado
- Revisa los logs de Cloudflare Pages
- Prueba con otro proveedor como fallback

### CORS Errors

- Las Pages Functions automáticamente manejan CORS
- Si tienes problemas, verifica la URL del fetch en JavaScript

## Límites y Consideraciones

### Cloudflare Pages Functions

- 100,000 invocaciones/mes (gratis)
- 10ms de CPU time por invocación
- 128MB de memoria
- 30 segundos de timeout

### Proveedores de Email

- **Resend**: 3,000 emails/mes (gratis)
- **Mailgun**: 5,000 emails/mes (gratis)
- **SendGrid**: 100 emails/día (gratis)
- **EmailJS**: 200 emails/mes (gratis)

## Próximos Pasos

1. **Configura tu proveedor de email preferido**
2. **Actualiza las variables de entorno**
3. **Prueba el formulario**
4. **Configura dominios personalizados**
5. **Implementa analytics si es necesario**

## Recursos Adicionales

- [Documentación de Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Documentación de Resend](https://resend.com/docs)
- [Guías de Mailgun](https://documentation.mailgun.com/)
- [Documentación de SendGrid](https://docs.sendgrid.com/)

## Soporte

Si tienes problemas:

1. Revisa los logs en Cloudflare Pages dashboard
2. Verifica la configuración de tu proveedor de email
3. Prueba con diferentes proveedores
4. Consulta la documentación oficial de cada servicio
