import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Créer le paiement PayDunya
    const paydunyaResponse = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY || '',
        'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY || '',
        'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN || '',
      },
      body: JSON.stringify({
        invoice: {
          total_amount: 2000,
          description: 'Abonnement annuel Kasa - Gestion de budget',
        },
        store: {
          name: 'Kasa',
          tagline: 'Gérez votre budget en couple',
          website_url: process.env.NEXT_PUBLIC_APP_URL || 'https://kasa.app',
        },
        actions: {
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=cancelled`,
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=success`,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/subscription/webhook`,
        },
        custom_data: {
          user_id: user.id,
          user_email: user.email,
          subscription_type: 'annual',
        },
      }),
    });

    const paydunyaData = await paydunyaResponse.json();

    if (!paydunyaResponse.ok || paydunyaData.response_code !== '00') {
      console.error('Erreur PayDunya:', paydunyaData);
      return NextResponse.json(
        { error: 'Erreur lors de la création du paiement PayDunya' },
        { status: 500 }
      );
    }

    // Créer l'enregistrement de paiement
    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: 2000,
        currency: 'XOF',
        status: 'pending',
        paydunya_token: paydunyaData.token,
      },
    });

    // Retourner l'URL de paiement PayDunya
    return NextResponse.json({
      paymentUrl: paydunyaData.response_text,
      token: paydunyaData.token,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

