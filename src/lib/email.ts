/**
 * Service d'envoi d'emails
 * Peut être configuré avec Resend, SendGrid, ou autre
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  // Si Resend est configuré
  if (process.env.RESEND_API_KEY) {
    return sendWithResend({ to, subject, html, from });
  }
  
  // Sinon, log en console (développement)
  console.log('📧 Email (simulation):', {
    to,
    subject,
    preview: html.substring(0, 100),
  });
  
  return { success: true, messageId: 'simulated' };
}

async function sendWithResend({ to, subject, html, from }: EmailOptions) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: from || process.env.EMAIL_FROM || 'noreply@kasa.app',
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'envoi de l\'email');
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Erreur Resend:', error);
    throw error;
  }
}

/**
 * Templates d'emails
 */

export function getInvitationEmailTemplate(data: {
  senderName: string;
  recipientEmail: string;
  invitationUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation Kasa</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Kasa</h1>
        <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px;">Gestion budgétaire en couple</p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 20px;">
        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px;">Invitation à partager votre budget</h2>
        
        <p style="margin: 0 0 15px; color: #4a5568; font-size: 16px; line-height: 1.6;">
          Bonjour,
        </p>
        
        <p style="margin: 0 0 15px; color: #4a5568; font-size: 16px; line-height: 1.6;">
          <strong>${data.senderName}</strong> vous invite à gérer votre budget ensemble sur Kasa.
        </p>
        
        <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
          En acceptant cette invitation, vous pourrez :
        </p>
        
        <ul style="margin: 0 0 25px; padding-left: 20px; color: #4a5568; font-size: 16px; line-height: 1.8;">
          <li>Partager vos revenus et dépenses</li>
          <li>Avoir une vue consolidée du budget du foyer</li>
          <li>Attribuer des transactions (Moi / Partenaire / Commun)</li>
          <li>Synchroniser vos finances en temps réel</li>
        </ul>
        
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.invitationUrl}" 
                 style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Accepter l'invitation
              </a>
            </td>
          </tr>
        </table>
        
        <p style="margin: 25px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
          Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.
        </p>
        
        <p style="margin: 15px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
          Ce lien expire dans 7 jours.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 30px 20px; background-color: #f7fafc; text-align: center;">
        <p style="margin: 0; color: #718096; font-size: 14px;">
          © 2025 Kasa - Gestion budgétaire intelligente
        </p>
        <p style="margin: 10px 0 0; color: #a0aec0; font-size: 12px;">
          Cet email a été envoyé à ${data.recipientEmail}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getWelcomeEmailTemplate(data: {
  userName: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur Kasa</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Bienvenue sur Kasa ! 🎉</h1>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 40px 20px;">
        <p style="margin: 0 0 15px; color: #4a5568; font-size: 16px; line-height: 1.6;">
          Bonjour ${data.userName},
        </p>
        
        <p style="margin: 0 0 15px; color: #4a5568; font-size: 16px; line-height: 1.6;">
          Bienvenue dans votre nouveau gestionnaire de budget ! Nous sommes ravis de vous accompagner dans la gestion de vos finances.
        </p>
        
        <p style="margin: 0 0 25px; color: #4a5568; font-size: 16px; line-height: 1.6;">
          Pour bien démarrer :
        </p>
        
        <ul style="margin: 0 0 25px; padding-left: 20px; color: #4a5568; font-size: 16px; line-height: 1.8;">
          <li>Ajoutez vos premières transactions</li>
          <li>Créez vos catégories personnalisées</li>
          <li>Configurez vos préférences (devise, langue)</li>
          <li>Invitez votre partenaire pour gérer votre budget à deux</li>
        </ul>
        
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                 style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Accéder à mon dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 30px 20px; background-color: #f7fafc; text-align: center;">
        <p style="margin: 0; color: #718096; font-size: 14px;">
          © 2025 Kasa - Gestion budgétaire intelligente
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

