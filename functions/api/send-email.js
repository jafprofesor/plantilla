// Cloudflare Pages Function for sending emails
// This function handles contact form submissions

export async function onRequestPost(context) {
  try {
    // Parse the request body
    const request = context.request;
    const body = await request.json();

    // Validate required fields
    const { name, email, message, phone } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Faltan campos requeridos: name, email, message",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Formato de email inválido",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Rate limiting using Cloudflare's environment
    // You can implement more sophisticated rate limiting here

    // Prepare email content
    const emailContent = {
      to: context.env.TO_EMAIL || "tu-email@ejemplo.com",
      from: context.env.FROM_EMAIL || "noreply@tu-dominio.com",
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Nuevo mensaje de contacto</h2>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Teléfono:</strong> ${
                          phone || "No proporcionado"
                        }</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <p><strong>Mensaje:</strong></p>
                        <div style="background-color: #fff; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0;">
                            ${message}
                        </div>
                    </div>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #666; font-size: 14px;">
                        <em>Este mensaje fue enviado desde el formulario de contacto del sitio web.</em>
                    </p>
                </div>
            `,
      text: `
Nuevo mensaje de contacto

Nombre: ${name}
Email: ${email}
Teléfono: ${phone || "No proporcionado"}

Mensaje:
${message}

--
Este mensaje fue enviado desde el formulario de contacto del sitio web.
            `,
    };

    // Send email using Cloudflare Email Workers API or external service
    const emailSent = await sendEmail(emailContent, context.env);

    if (emailSent) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Correo enviado correctamente",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      throw new Error("Error al enviar el correo");
    }
  } catch (error) {
    console.error("Error processing contact form:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Error interno del servidor",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Function to send email using different providers
async function sendEmail(emailContent, env) {
  // Option 1: Using Mailgun API
  if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN) {
    return await sendWithMailgun(emailContent, env);
  }

  // Option 2: Using SendGrid API
  if (env.SENDGRID_API_KEY) {
    return await sendWithSendGrid(emailContent, env);
  }

  // Option 3: Using Resend API (recommended for Cloudflare)
  if (env.RESEND_API_KEY) {
    return await sendWithResend(emailContent, env);
  }

  // Option 4: Using SMTP (requires external service like EmailJS)
  if (
    env.EMAILJS_PUBLIC_KEY &&
    env.EMAILJS_SERVICE_ID &&
    env.EMAILJS_TEMPLATE_ID
  ) {
    return await sendWithEmailJS(emailContent, env);
  }

  throw new Error("No hay configuración de email válida");
}

// Mailgun implementation
async function sendWithMailgun(emailContent, env) {
  const formData = new FormData();
  formData.append("from", emailContent.from);
  formData.append("to", emailContent.to);
  formData.append("subject", emailContent.subject);
  formData.append("html", emailContent.html);
  formData.append("text", emailContent.text);

  const response = await fetch(
    `https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
      },
      body: formData,
    }
  );

  return response.ok;
}

// SendGrid implementation
async function sendWithSendGrid(emailContent, env) {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: emailContent.to }],
        },
      ],
      from: { email: emailContent.from },
      subject: emailContent.subject,
      content: [
        {
          type: "text/html",
          value: emailContent.html,
        },
        {
          type: "text/plain",
          value: emailContent.text,
        },
      ],
    }),
  });

  return response.ok;
}

// Resend implementation (recommended for Cloudflare)
async function sendWithResend(emailContent, env) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailContent.from,
      to: [emailContent.to],
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    }),
  });

  return response.ok;
}

// EmailJS implementation (client-side service)
async function sendWithEmailJS(emailContent, env) {
  // This would typically be handled client-side
  // But we can use their REST API
  const templateParams = {
    from_name: emailContent.from,
    to_email: emailContent.to,
    subject: emailContent.subject,
    html_content: emailContent.html,
    message: emailContent.text,
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: env.EMAILJS_TEMPLATE_ID,
      user_id: env.EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  });

  return response.ok;
}
