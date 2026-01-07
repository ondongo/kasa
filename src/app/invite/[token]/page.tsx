'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { acceptCoupleInvitation, declineCoupleInvitation } from '@/lib/actions/couple';
import { CheckCircle, XCircle, Users, Loader2 } from 'lucide-react';

interface PageProps {
  params: {
    token: string;
  };
}

export default function InvitePage({ params }: PageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | 'declined' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Rediriger vers la page de connexion avec un callback
      router.push(`/login?callbackUrl=/invite/${params.token}`);
    }
  }, [status, router, params.token]);

  const handleAccept = async () => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      await acceptCoupleInvitation(params.token);
      setResult('success');
      
      // Rediriger vers le dashboard après 3 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error: any) {
      setResult('error');
      setErrorMessage(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      await declineCoupleInvitation(params.token);
      setResult('declined');
      
      // Rediriger vers le dashboard après 3 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error: any) {
      setResult('error');
      setErrorMessage(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (result === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Invitation acceptée !</CardTitle>
            <CardDescription>
              Vous êtes maintenant lié(e) à votre partenaire. Vous allez être redirigé(e) vers le dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (result === 'declined') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
              <XCircle className="h-10 w-10 text-orange-600" />
            </div>
            <CardTitle className="text-2xl">Invitation refusée</CardTitle>
            <CardDescription>
              L'invitation a été refusée. Vous allez être redirigé(e) vers le dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (result === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Erreur</CardTitle>
            <CardDescription className="text-red-600">
              {errorMessage || 'Une erreur est survenue lors du traitement de l\'invitation'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push('/dashboard')}>
              Retour au dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Invitation de couple</CardTitle>
          <CardDescription>
            Vous avez été invité(e) à partager la gestion d'un budget de couple
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-[#F2C086]/10 p-4">
            <h4 className="mb-2 font-semibold text-[#F2C086]">Ce que cela implique :</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Accès partagé au budget du foyer</li>
              <li>• Possibilité de créer et modifier des transactions</li>
              <li>• Vue consolidée des finances communes</li>
              <li>• Synchronisation en temps réel</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDecline}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refuser'}
            </Button>
            <Button
              className="flex-1"
              onClick={handleAccept}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Accepter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

