export interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  textContent?: string;
  htmlContent: string;
  sender?: { email: string; name?: string };
}

export async function sendEmail({ to, subject, textContent, htmlContent, sender }: SendEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not defined in environment variables');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: sender || { 
        email: process.env.BREVO_SENDER_EMAIL || 'ventas@isaprecolmena.cl', 
        name: process.env.BREVO_SENDER_NAME || 'Ventas Colmena' 
      },
      to,
      subject,
      htmlContent,
      textContent: textContent || subject,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Brevo API Error:', error);
    throw new Error(error.message || 'Failed to send email via Brevo');
  }

  return response.json();
}
