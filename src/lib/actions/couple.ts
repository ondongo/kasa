'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { randomBytes } from 'crypto';
import { sendEmail, getInvitationEmailTemplate } from '@/lib/email';

export async function sendCoupleInvitation(receiverEmail: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  if (session.user.email === receiverEmail) {
    throw new Error('Vous ne pouvez pas vous inviter vous-même');
  }

  const sender = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: {
          household: {
            include: {
              memberships: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!sender) {
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier si l'utilisateur a déjà un partenaire
  const existingHousehold = sender.memberships[0]?.household;
  if (existingHousehold && existingHousehold.memberships.length >= 2) {
    throw new Error('Vous avez déjà un partenaire lié');
  }

  // Vérifier si une invitation est déjà en cours
  const existingInvitation = await prisma.coupleInvitation.findFirst({
    where: {
      senderId: sender.id,
      receiverEmail,
      status: 'PENDING',
    },
  });

  if (existingInvitation) {
    throw new Error('Une invitation est déjà en cours pour cet email');
  }

  // Créer un token unique
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

  // Créer l'invitation
  const invitation = await prisma.coupleInvitation.create({
    data: {
      senderId: sender.id,
      receiverEmail,
      token,
      expiresAt,
      status: 'PENDING',
    },
  });

  // Envoyer l'email avec le lien d'invitation
  const invitationLink = `${process.env.NEXTAUTH_URL}/invite/${token}`;
  
  try {
    await sendEmail({
      to: receiverEmail,
      subject: `${sender.name || 'Un utilisateur'} vous invite à gérer votre budget sur Kasa`,
      html: getInvitationEmailTemplate({
        senderName: sender.name || sender.email,
        recipientEmail: receiverEmail,
        invitationUrl: invitationLink,
      }),
    });
  } catch (emailError: any) {
    console.error('Erreur lors de l\'envoi de l\'email:', emailError);
    // Si l'erreur est critique, on supprime l'invitation créée
    if (emailError.message && emailError.message.includes('Erreur')) {
      await prisma.coupleInvitation.delete({
        where: { id: invitation.id },
      });
      throw new Error(`Erreur lors de l'envoi de l'email: ${emailError.message}`);
    }
    // Sinon, on continue même si l'email ne part pas (l'invitation est créée)
  }

  return invitation;
}

export async function getCoupleInvitations() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Invitations envoyées
  const sent = await prisma.coupleInvitation.findMany({
    where: {
      senderId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Invitations reçues
  const received = await prisma.coupleInvitation.findMany({
    where: {
      receiverEmail: user.email,
    },
    include: {
      sender: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return { sent, received };
}

export async function acceptCoupleInvitation(token: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  const receiver = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: {
          household: {
            include: {
              memberships: true,
              transactions: true,
              categories: true,
              investmentEnvelopes: true,
              savingsBoxes: true,
            },
          },
        },
      },
    },
  });

  if (!receiver) {
    throw new Error('Utilisateur non trouvé');
  }

  const invitation = await prisma.coupleInvitation.findUnique({
    where: { token },
    include: {
      sender: {
        include: {
          memberships: {
            include: {
              household: {
                include: {
                  memberships: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!invitation) {
    throw new Error('Invitation non trouvée');
  }

  if (invitation.receiverEmail !== session.user.email) {
    throw new Error('Cette invitation ne vous est pas destinée');
  }

  if (invitation.status !== 'PENDING') {
    throw new Error('Cette invitation n\'est plus valide');
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error('Cette invitation a expiré');
  }

  // Vérifier si le receiver a déjà un partenaire
  const receiverHousehold = receiver.memberships[0]?.household;
  if (receiverHousehold && receiverHousehold.memberships.length >= 2) {
    throw new Error('Vous avez déjà un partenaire lié');
  }

  // Trouver ou créer le household du sender
  let household = invitation.sender.memberships[0]?.household;

  if (!household) {
    const newHousehold = await prisma.household.create({
      data: {
        name: `Foyer de ${invitation.sender.name || 'utilisateur'}`,
        memberships: {
          create: {
            userId: invitation.senderId,
            role: 'OWNER',
          },
        },
      },
      include: {
        memberships: true,
      },
    });
    household = newHousehold;
  }

  // Si le receiver a déjà un household avec des données, migrer les données vers le nouveau household
  if (receiverHousehold && receiverHousehold.id !== household.id) {
    const receiverMembership = receiver.memberships.find(m => m.householdId === receiverHousehold.id);
    
    // Migrer les transactions
    if (receiverHousehold.transactions.length > 0) {
      await prisma.transaction.updateMany({
        where: { householdId: receiverHousehold.id },
        data: { householdId: household.id },
      });
    }

    // Migrer les catégories
    if (receiverHousehold.categories.length > 0) {
      await prisma.category.updateMany({
        where: { householdId: receiverHousehold.id },
        data: { householdId: household.id },
      });
    }

    // Migrer les enveloppes d'investissement
    if (receiverHousehold.investmentEnvelopes.length > 0) {
      await prisma.investmentEnvelope.updateMany({
        where: { householdId: receiverHousehold.id },
        data: { householdId: household.id },
      });
    }

    // Migrer les tirelires
    if (receiverHousehold.savingsBoxes.length > 0) {
      await prisma.savingsBox.updateMany({
        where: { householdId: receiverHousehold.id },
        data: { householdId: household.id },
      });
    }

    // Supprimer l'ancien membership du receiver
    if (receiverMembership) {
      await prisma.membership.delete({
        where: { id: receiverMembership.id },
      });
    }

    // Supprimer l'ancien household s'il est vide
    const remainingMemberships = await prisma.membership.count({
      where: { householdId: receiverHousehold.id },
    });
    
    if (remainingMemberships === 0) {
      await prisma.household.delete({
        where: { id: receiverHousehold.id },
      });
    }
  }

  // Ajouter le receiver au household (ou mettre à jour s'il existe déjà)
  const existingMembership = await prisma.membership.findUnique({
    where: {
      userId_householdId: {
        userId: receiver.id,
        householdId: household.id,
      },
    },
  });

  if (!existingMembership) {
    await prisma.membership.create({
      data: {
        userId: receiver.id,
        householdId: household.id,
        role: 'MEMBER',
      },
    });
  }

  // Mettre à jour l'invitation
  await prisma.coupleInvitation.update({
    where: { id: invitation.id },
    data: {
      status: 'ACCEPTED',
      receiverId: receiver.id,
    },
  });

  return household;
}

export async function declineCoupleInvitation(token: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  const invitation = await prisma.coupleInvitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    throw new Error('Invitation non trouvée');
  }

  if (invitation.receiverEmail !== session.user.email) {
    throw new Error('Cette invitation ne vous est pas destinée');
  }

  await prisma.coupleInvitation.update({
    where: { id: invitation.id },
    data: {
      status: 'DECLINED',
    },
  });

  return { success: true };
}

export async function getPartner() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Non authentifié');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: {
          household: {
            include: {
              memberships: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.memberships.length) {
    return null;
  }

  const household = user.memberships[0].household;
  const partner = household.memberships.find(
    (m: any) => m.userId !== user.id
  )?.user;

  return partner || null;
}

