import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email déjà vérifié' }, { status: 400 });
    }

    // Générer un token de vérification
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expire dans 24h

    // Sauvegarder le token (vous pouvez créer une table EmailVerificationToken si nécessaire)
    // Pour l'instant, on va utiliser une approche simple avec un champ dans User
    // ou créer une table dédiée

    const verificationUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

    // Envoyer l'email de vérification
    const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérification de votre email - Kasa</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #1E2634 0%, #2A2520 100%);">
        <h1 style="margin: 0; color: #F2C086; font-size: 32px;">Kasa</h1>
        <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px;">Vérification de votre email</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 20px;">
        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px;">Vérifiez votre adresse email</h2>
        <p style="margin: 0 0 15px; color: #4a5568; font-size: 16px; line-height: 1.6;">
          Bonjour,
        </p>
        <p style="margin: 0 0 15px; color: #4a5568; font-size: 16px; line-height: 1.6;">
          Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte Kasa.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; padding: 15px 40px; background: #F2C086; color: #1a1a1a; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Vérifier mon email
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 25px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
          Si vous n'avez pas créé de compte sur Kasa, vous pouvez ignorer cet email.
        </p>
        <p style="margin: 15px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
          Ce lien expire dans 24 heures.
        </p>
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

    try {
      await sendEmail({
        to: user.email,
        subject: 'Vérifiez votre adresse email - Kasa',
        html: emailHtml,
      });

      // TODO: Sauvegarder le token dans la base de données pour vérification
      // Pour l'instant, on retourne juste un succès
      
      return NextResponse.json({ 
        success: true,
        message: 'Email de vérification envoyé'
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la vérification email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

