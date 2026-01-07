import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { data } = body;
    
    if (!data || !data.token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
    }

    // Vérifier le statut du paiement avec PayDunya
    const paydunyaResponse = await fetch(`https://app.paydunya.com/api/v1/checkout-invoice/confirm/${data.token}`, {
      method: 'GET',
      headers: {
        'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY || '',
        'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY || '',
        'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN || '',
      },
    });

    const paydunyaData = await paydunyaResponse.json();

    if (!paydunyaResponse.ok || paydunyaData.response_code !== '00') {
      console.error('Erreur vérification PayDunya:', paydunyaData);
      return NextResponse.json({ error: 'Erreur vérification paiement' }, { status: 500 });
    }

    // Récupérer le paiement
    const payment = await prisma.payment.findUnique({
      where: { paydunya_token: data.token },
      include: { user: { include: { subscription: true } } },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Paiement non trouvé' }, { status: 404 });
    }

    // Mettre à jour le statut du paiement
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paydunyaData.status === 'completed' ? 'completed' : 'failed',
        paydunya_status: paydunyaData.status,
        method: paydunyaData.customer?.phone_number ? 'mobile_money' : 'unknown',
      },
    });

    // Si le paiement est réussi, activer l'abonnement
    if (paydunyaData.status === 'completed') {
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // +1 an

      if (payment.user.subscription) {
        // Mettre à jour l'abonnement existant
        await prisma.subscription.update({
          where: { userId: payment.userId },
          data: {
            status: 'ACTIVE',
            endDate,
            lastPaymentDate: new Date(),
            paydunya_token: data.token,
            paydunya_status: paydunyaData.status,
          },
        });
      } else {
        // Créer un nouvel abonnement
        await prisma.subscription.create({
          data: {
            userId: payment.userId,
            status: 'ACTIVE',
            endDate,
            lastPaymentDate: new Date(),
            paydunya_token: data.token,
            paydunya_status: paydunyaData.status,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur webhook PayDunya:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

