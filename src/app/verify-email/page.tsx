'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Token ou email manquant');
        return;
      }

      try {
        const response = await fetch('/api/user/verify-email/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Votre email a été vérifié avec succès !');
          
          // Rediriger vers settings après 2 secondes
          setTimeout(() => {
            router.push('/settings?tab=profile&emailVerified=true');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Erreur lors de la vérification de l\'email');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setStatus('error');
        setMessage('Une erreur est survenue lors de la vérification');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2634] p-4">
      <Card className="w-full max-w-md border-2 border-[#F2C086]/20 bg-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl">Vérification de l'email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-[#F2C086]" />
              <p className="text-muted-foreground">Vérification en cours...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <div className="rounded-full bg-green-500/10 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-500">Email vérifié !</h3>
              <p className="text-muted-foreground">{message}</p>
              <p className="text-sm text-muted-foreground">Redirection vers les paramètres...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <div className="rounded-full bg-red-500/10 p-4">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-red-500">Erreur</h3>
              <p className="text-muted-foreground">{message}</p>
              <Button
                onClick={() => router.push('/settings?tab=profile')}
                className="mt-4 bg-[#F2C086] hover:bg-[#F2C086]/90 text-black"
              >
                Retour aux paramètres
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#1E2634]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F2C086]" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

