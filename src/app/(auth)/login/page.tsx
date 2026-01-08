'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import CodePinInput from '@/components/ui/CodePinInput';
import { Logo } from '@/components/layout/Logo';
import { toast } from 'react-toastify';
import Link from 'next/link';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState('');
  const [region, setRegion] = useState<'AFRICA' | 'EUROPE' | 'AMERICA'>('AFRICA');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration steps: 'form' | 'phone' | 'otp'
  const [registrationStep, setRegistrationStep] = useState<'form' | 'phone' | 'otp'>('form');
  
  // Vérifier les paramètres d'URL pour afficher l'étape phone si nécessaire
  useEffect(() => {
    const step = searchParams.get('step');
    const emailParam = searchParams.get('email');
    if (step === 'phone' && emailParam) {
      setEmail(emailParam);
      setIsLogin(true);
      setRegistrationStep('phone');
    }
  }, [searchParams]);
  
  // OTP States
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Étape 1: Vérifier les credentials
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Identifiants invalides');
        setLoading(false);
        return;
      }

      // Étape 2: Vérifier si l'appareil est de confiance
      const deviceCheckResponse = await fetch('/api/auth/device/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const deviceCheck = await deviceCheckResponse.json();

      if (deviceCheck.requiresPhoneNumber) {
        // Pas de numéro de téléphone, afficher l'étape phone
        // Le password est déjà dans le state, on le garde pour la reconnexion après OTP
        setRegistrationStep('phone');
        setLoading(false);
        toast.info(deviceCheck.message || 'Veuillez renseigner votre numéro de téléphone');
        // L'email est déjà défini, on reste sur la page avec l'étape phone
        return;
      }

      if (deviceCheck.requiresOTP) {
        // Appareil non reconnu, demander OTP
        setRequiresOTP(true);
        setPhoneNumber(deviceCheck.phoneNumber);
        setLoading(false);
        
        // Envoyer automatiquement le code OTP
        await sendOTP(deviceCheck.phoneNumber);
      } else {
        // Appareil de confiance, connexion directe
        toast.success('Connexion réussie !');
        window.location.href = '/dashboard';
      }
    } catch (err) {
      toast.error('Une erreur est survenue');
      setLoading(false);
    }
  };

  const sendOTP = async (phone: string) => {
    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneNumber: phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Erreur lors de l\'envoi du code');
        return;
      }

      setOtpSent(true);
      toast.success(`Code envoyé au ${phone}`);
    } catch (err) {
      toast.error('Erreur lors de l\'envoi du code de vérification');
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Veuillez entrer un code à 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneNumber, code: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Code de vérification invalide');
        setLoading(false);
        return;
      }

      // Code validé, appareil ajouté aux appareils de confiance
      toast.success('Appareil vérifié avec succès !');
      
      // Si c'est une inscription, faire le login automatique
      if (isRegistering) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Appareil vérifié mais erreur de connexion. Veuillez vous connecter.');
          setLoading(false);
          return;
        }
      } else if (password) {
        // Si c'est une connexion existante avec password, se reconnecter pour régénérer le token
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Erreur lors de la mise à jour de la session');
          setLoading(false);
          return;
        }
      }
      // Si pas de password (arrivé depuis middleware), on laisse passer
      // Le callback JWT récupérera le phoneNumber à jour à la prochaine requête
      
      // Attendre un peu pour que le token soit mis à jour, puis rediriger
      // Le middleware vérifiera le token mis à jour
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err) {
      toast.error('Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          householdName,
          region,
          // Pas de phoneNumber à cette étape
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de l\'inscription');
        setLoading(false);
        return;
      }

      // Compte créé, passer à l'étape 2 : demander le phoneNumber
      toast.success('Compte créé ! Veuillez renseigner votre numéro de téléphone.');
      setRegistrationStep('phone');
      setLoading(false);
    } catch (err) {
      toast.error('Une erreur est survenue');
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Vérifier que le numéro de téléphone est renseigné
      if (!registerPhoneNumber.trim()) {
        toast.error('Le numéro de téléphone est requis');
        setLoading(false);
        return;
      }

      // Mettre à jour le user avec le phoneNumber
      const response = await fetch('/api/auth/update-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          phoneNumber: registerPhoneNumber,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la mise à jour');
        setLoading(false);
        return;
      }

      // Passer à l'étape 3 : vérification OTP
      toast.success('Numéro enregistré ! Envoi du code de vérification...');
      // Si c'est une connexion (isLogin = true), on n'est pas en train de s'inscrire
      setIsRegistering(!isLogin);
      setRegistrationStep('otp');
      setRequiresOTP(true);
      setPhoneNumber(registerPhoneNumber);
      setLoading(false);
      
      // Envoyer automatiquement le code OTP
      await sendOTP(registerPhoneNumber);
    } catch (err) {
      toast.error('Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/budget-background.png)' }}
        />
      </div>
      
      {/* Logo Kasa en arrière-plan */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 z-10 cursor-pointer hover:opacity-80 transition-opacity">
        <Logo className="h-10 w-10" />
        <span className="text-2xl font-bold text-white">Kasa</span>
      </Link>
      
      {/* Contenu principal */}
      <Card className="relative z-10 w-full max-w-md bg-card border-2 border-[#F2C086]/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            {requiresOTP || registrationStep === 'otp' 
              ? 'Vérification requise' 
              : registrationStep === 'phone'
              ? 'Sécurité du compte'
              : (isLogin ? 'Connexion' : 'Inscription')}
          </CardTitle>
          <CardDescription>
            {requiresOTP || registrationStep === 'otp'
              ? 'Nouvel appareil détecté, veuillez entrer le code envoyé par SMS'
              : registrationStep === 'phone'
              ? 'Renseignez votre numéro de téléphone pour sécuriser votre compte'
              : (isLogin
                ? 'Connectez-vous à votre compte Kasa'
                : 'Créez votre compte Kasa')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requiresOTP || registrationStep === 'otp' ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-[#F2C086]/10 p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-[#F2C086] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F2C086] mb-1">
                    Sécurité renforcée
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Un code de vérification a été envoyé au {phoneNumber}. 
                    Entrez-le ci-dessous pour continuer.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Code de vérification</Label>
                <div className="flex justify-center py-4">
                  <CodePinInput
                    length={6}
                    value={otpCode}
                    onChange={setOtpCode}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  className="w-full"
                  disabled={loading || otpCode.length !== 6}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Vérifier et continuer
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => sendOTP(phoneNumber)}
                  className="w-full"
                  disabled={loading}
                >
                  Renvoyer le code
                </Button>

              </div>
            </div>
          ) : registrationStep === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary mb-1">
                    Sécurisez votre compte
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Votre numéro permettra de vérifier votre identité lors de connexions depuis de nouveaux appareils.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerPhoneNumber">
                  Numéro de téléphone
                </Label>
                <Input
                  id="registerPhoneNumber"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={registerPhoneNumber}
                  onChange={(e) => setRegisterPhoneNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Format international recommandé (ex: +33 6 12 34 56 78)
                </p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continuer
              </Button>
            </form>
          ) : (
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="householdName">Nom du foyer</Label>
                  <Input
                    id="householdName"
                    type="text"
                    placeholder="Ex: Famille Martin"
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Région</Label>
                  <Select value={region} onValueChange={(value: 'AFRICA' | 'EUROPE' | 'AMERICA') => setRegion(value)}>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Sélectionnez votre région" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AFRICA">Afrique</SelectItem>
                      <SelectItem value="EUROPE">Europe</SelectItem>
                      <SelectItem value="AMERICA">Amérique</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Cela définira votre devise par défaut (XOF/XAF pour Afrique, EUR pour Europe, USD pour Amérique)
                  </p>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
            </Button>
          </form>
          )}
        </CardContent>
        {!requiresOTP && registrationStep === 'form' && (
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => {
                setIsLogin(!isLogin);
                setRegistrationStep('form');
              }}
            >
              {isLogin ? 'Pas de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/budget-background.png)' }}
          />
        </div>
        <Card className="relative z-10 w-full max-w-md bg-card border-2 border-[#F2C086]/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

