'use server';

import { sendEmail } from '@/lib/brevo';

export async function sendCampaignAction(formData: {
  subject: string;
  content: string;
  leads: { email: string; name?: string }[];
}) {
  try {
    const { subject, content, leads } = formData;

    if (!subject || !content || leads.length === 0) {
      throw new Error('Missing required fields');
    }

    // Transform content to HTML with basic professional styling
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0076B8; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Isapre Colmena</h2>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #333;">
          <h3 style="margin-top: 0;">¡Hola!</h3>
          <p style="white-space: pre-wrap;">${content}</p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="#" style="background-color: #0076B8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Conoce tus beneficios</a>
          </div>
        </div>
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-top: 1px solid #eee;">
          <p style="font-size: 11px; color: #999; margin: 0;">
            © ${new Date().getFullYear()} Isapre Colmena. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `;

    const result = await sendEmail({
      to: leads.map(l => ({ email: l.email, name: l.name })),
      subject,
      htmlContent,
    });

    return { success: true, result };
  } catch (error: any) {
    console.error('Action Error:', error);
    return { success: false, error: error.message };
  }
}
