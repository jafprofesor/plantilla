# 📧 Formulario de Contacto - Comparación de Soluciones

Este proyecto incluye **dos implementaciones** para el envío de formularios de contacto desde sitios web estáticos:

## 🔀 Opciones Disponibles

### 1. 🚀 **Render Backend** (Servidor Node.js)

- **Archivos**: `index.html` + `js/scripts.js`
- **Documentación**: `RENDER_SETUP.md`
- **Tipo**: Backend independiente en Render

### 2. ⚡ **Cloudflare Pages Functions** (Serverless)

- **Archivos**: `index-cloudflare.html` + `js/scripts-cloudflare.js` + `functions/api/send-email.js`
- **Documentación**: `CLOUDFLARE_SETUP.md`
- **Tipo**: Función serverless integrada

## 📊 Comparación Detallada

| Característica       | Render Backend                      | Cloudflare Pages Functions     |
| -------------------- | ----------------------------------- | ------------------------------ |
| **🏗️ Arquitectura**  | Servidor Node.js independiente      | Función serverless integrada   |
| **💰 Costo**         | Gratis (con limitaciones de sueño)  | Gratis (100k invocaciones/mes) |
| **⚡ Rendimiento**   | Puede tener cold starts             | Edge computing, ultra rápido   |
| **🛠️ Configuración** | Más compleja (repositorio separado) | Más simple (mismo proyecto)    |
| **📈 Escalabilidad** | Manual                              | Automática                     |
| **🔧 Mantenimiento** | Requiere gestión de servidor        | Sin mantenimiento              |
| **🌐 Latencia**      | Variable según región               | Mínima (edge locations)        |
| **📝 Logs**          | Dashboard de Render                 | Dashboard de Cloudflare        |

## 🎯 Recomendaciones de Uso

### ✅ Usa **Render** si:

- Ya tienes experiencia con servidores Node.js
- Necesitas lógica compleja en el backend
- Prefieres control total sobre el entorno
- Tienes otros servicios backend que integrar

### ✅ Usa **Cloudflare Pages Functions** si:

- Tu sitio ya está en Cloudflare Pages
- Prefieres soluciones serverless
- Quieres mínima latencia y máximo rendimiento
- Buscas la solución más simple de mantener

## 🚀 Implementación Rápida

### Para Render:

1. Sigue las instrucciones en `RENDER_SETUP.md`
2. Crea el repositorio backend
3. Actualiza la URL en `index.html`

### Para Cloudflare Pages Functions:

1. Sigue las instrucciones en `CLOUDFLARE_SETUP.md`
2. Usa `index-cloudflare.html` como tu archivo principal
3. Configura variables de entorno en Cloudflare

## 📂 Estructura de Archivos

```
plantilla/
├── 📄 index.html                    # Versión para Render
├── 📄 index-cloudflare.html         # Versión para Cloudflare
├── 📁 js/
│   ├── 📄 scripts.js                # JavaScript para Render
│   └── 📄 scripts-cloudflare.js     # JavaScript para Cloudflare
├── 📁 functions/                    # Solo para Cloudflare
│   └── 📁 api/
│       └── 📄 send-email.js         # Pages Function
├── 📁 assets/                       # Recursos compartidos
├── 📁 css/                          # Estilos compartidos
├── 📄 RENDER_SETUP.md               # Guía para Render
├── 📄 CLOUDFLARE_SETUP.md           # Guía para Cloudflare
├── 📄 wrangler.toml                 # Config para desarrollo local
└── 📄 README.md                     # Este archivo
```

## 🔐 Proveedores de Email Soportados

Ambas soluciones soportan:

- **Resend** (recomendado para Cloudflare)
- **Mailgun**
- **SendGrid**
- **EmailJS**
- **SMTP personalizado** (solo Render)

## 🎨 Características Comunes

- ✅ Validación de campos
- ✅ Mensajes de error/éxito
- ✅ Rate limiting básico
- ✅ HTML emails con estilo
- ✅ Responsive design
- ✅ Traducción a español

## 🤔 ¿Cuál Elegir?

**Para la mayoría de proyectos, recomendamos Cloudflare Pages Functions** por:

- Menor complejidad
- Mejor rendimiento
- Integración natural con sitios estáticos
- Costo efectivo a escala

**Elige Render solo si** necesitas funcionalidades avanzadas de backend o ya tienes infraestructura en Render.

---

💡 **Tip**: Puedes empezar con Cloudflare Pages Functions y migrar a Render más tarde si necesitas más funcionalidades.
