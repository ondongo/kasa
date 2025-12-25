'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategories, createCategory, deleteCategory } from '@/lib/actions/categories';
import { getEnvelopes, createEnvelope, deleteEnvelope } from '@/lib/actions/envelopes';
import { User, Settings as SettingsIcon, Users, Shield, Folder, Plus, Trash2, Mail, Check, Smartphone, Monitor, Tablet } from 'lucide-react';
import { SettingsSkeleton } from '@/components/skeletons/SettingsSkeleton';

type SettingsTab = 'profile' | 'preferences' | 'couple' | 'categories' | 'security';

const currencies = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar américain' },
  { code: 'XAF', symbol: 'FCFA', name: 'Franc CFA' },
];

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'ln', name: 'Lingala' },
  { code: 'wo', name: 'Wolof' },
];

const themes = [
  { code: 'light', name: 'Clair' },
  { code: 'dark', name: 'Sombre' },
  { code: 'system', name: 'Système' },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState(true);

  // Profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  // Preferences
  const [currency, setCurrency] = useState('EUR');
  const [language, setLanguage] = useState('fr');
  const [theme, setTheme] = useState('dark');

  // Couple
  const [partnerEmail, setPartnerEmail] = useState('');
  const [hasPartner, setHasPartner] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [invitationSent, setInvitationSent] = useState(false);

  // Categories
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);
  const [envelopes, setEnvelopes] = useState<any[]>([]);
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newIncomeCategory, setNewIncomeCategory] = useState('');
  const [newEnvelope, setNewEnvelope] = useState('');

  // Appareils de confiance
  const [trustedDevices, setTrustedDevices] = useState([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'laptop',
      lastUsed: '2025-12-25',
      location: 'Paris, France',
      current: true,
    },
    {
      id: '2',
      name: 'iPhone 14',
      type: 'mobile',
      lastUsed: '2025-12-24',
      location: 'Paris, France',
      current: false,
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || '');
      // Simuler les données pour la démo
      setFirstName('Gloire');
      setLastName('Ondongo');
      setPhoneNumber('+33 6 12 34 56 78'); // Exemple
      setPhoneVerified(false); // À récupérer de la BD
    }
  }, [session]);

  async function loadData() {
    setLoading(true);
    try {
      const [expense, income, env] = await Promise.all([
        getCategories('EXPENSE'),
        getCategories('INCOME'),
        getEnvelopes(),
      ]);

      setExpenseCategories(expense);
      setIncomeCategories(income);
      setEnvelopes(env);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddExpenseCategory = async () => {
    if (!newExpenseCategory.trim()) return;
    try {
      await createCategory({ name: newExpenseCategory, type: 'EXPENSE', order: expenseCategories.length });
      setNewExpenseCategory('');
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddIncomeCategory = async () => {
    if (!newIncomeCategory.trim()) return;
    try {
      await createCategory({ name: newIncomeCategory, type: 'INCOME', order: incomeCategories.length });
      setNewIncomeCategory('');
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddEnvelope = async () => {
    if (!newEnvelope.trim()) return;
    try {
      await createEnvelope({ name: newEnvelope, order: envelopes.length });
      setNewEnvelope('');
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    try {
      await deleteCategory(id);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteEnvelope = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette enveloppe ?')) return;
    try {
      await deleteEnvelope(id);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleInvitePartner = () => {
    // TODO: Implémenter l'invitation par email
    setInvitationSent(true);
    setTimeout(() => setInvitationSent(false), 3000);
  };

  const handleSaveProfile = () => {
    // TODO: Implémenter la sauvegarde du profil
    alert('Profil sauvegardé !');
  };

  const handleSendVerificationCode = () => {
    // TODO: Implémenter l'envoi du code de vérification
    setShowVerificationInput(true);
    alert('Code de vérification envoyé par SMS !');
  };

  const handleVerifyPhone = () => {
    // TODO: Implémenter la vérification du code
    if (verificationCode === '123456') { // Exemple de code
      setPhoneVerified(true);
      setShowVerificationInput(false);
      alert('Numéro de téléphone vérifié !');
    } else {
      alert('Code incorrect');
    }
  };

  const handleSavePreferences = () => {
    // TODO: Implémenter la sauvegarde des préférences
    alert('Préférences sauvegardées !');
  };

  const handleRemoveDevice = (deviceId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet appareil ?')) return;
    setTrustedDevices(trustedDevices.filter((d) => d.id !== deviceId));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      case 'laptop':
      default:
        return Monitor;
    }
  };

  const navigationItems = [
    { id: 'profile', label: 'Mon compte', icon: User },
    { id: 'preferences', label: 'Préférences', icon: SettingsIcon },
    { id: 'couple', label: 'Gestion de couple', icon: Users },
    { id: 'categories', label: 'Catégories', icon: Folder },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar de navigation */}
      <div className="w-64 border-r bg-card/50 p-4">
        <h1 className="mb-6 px-3 text-2xl font-bold">Paramètres</h1>
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as SettingsTab)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Mon profil */}
          {activeTab === 'profile' && (
            <>
              <div>
                <h2 className="text-3xl font-bold">Mon profil</h2>
                <p className="mt-1 text-muted-foreground">
                  Gérez vos informations personnelles
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Mon email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                      />
                      <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-xs font-medium">VÉRIFIÉ</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                      />
                      {phoneVerified ? (
                        <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-xs font-medium">VÉRIFIÉ</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={handleSendVerificationCode}
                          disabled={!phoneNumber.trim()}
                        >
                          Vérifier
                        </Button>
                      )}
                    </div>
                    {showVerificationInput && !phoneVerified && (
                      <div className="mt-2 space-y-2 rounded-lg border bg-muted/50 p-4">
                        <Label htmlFor="verificationCode">Code de vérification</Label>
                        <div className="flex gap-2">
                          <Input
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="123456"
                            maxLength={6}
                          />
                          <Button onClick={handleVerifyPhone}>Valider</Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Entrez le code reçu par SMS
                        </p>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleSaveProfile} className="w-full">
                    Enregistrer les modifications
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Préférences */}
          {activeTab === 'preferences' && (
            <>
              <div>
                <h2 className="text-3xl font-bold">Préférences</h2>
                <p className="mt-1 text-muted-foreground">
                  Personnalisez votre expérience
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres régionaux</CardTitle>
                  <CardDescription>
                    Choisissez votre langue et votre devise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Langue</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              {curr.symbol} - {curr.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                  <CardDescription>
                    Personnalisez l'interface de l'application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Thème</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((t) => (
                          <SelectItem key={t.code} value={t.code}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSavePreferences} className="w-full">
                    Enregistrer les préférences
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Gestion de couple */}
          {activeTab === 'couple' && (
            <>
              <div>
                <h2 className="text-3xl font-bold">Gestion de couple</h2>
                <p className="mt-1 text-muted-foreground">
                  Invitez votre partenaire pour gérer votre budget ensemble
                </p>
              </div>

              {!hasPartner ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Inviter mon partenaire</CardTitle>
                    <CardDescription>
                      Envoyez une invitation par email pour partager la gestion de votre budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="partnerEmail">Email du partenaire</Label>
                      <div className="flex gap-2">
                        <Input
                          id="partnerEmail"
                          type="email"
                          value={partnerEmail}
                          onChange={(e) => setPartnerEmail(e.target.value)}
                          placeholder="partenaire@email.com"
                        />
                        <Button onClick={handleInvitePartner} disabled={!partnerEmail.trim()}>
                          <Mail className="mr-2 h-4 w-4" />
                          Inviter
                        </Button>
                      </div>
                      {invitationSent && (
                        <p className="text-sm text-green-600">
                          ✓ Invitation envoyée avec succès !
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg bg-blue-500/10 p-4">
                      <h4 className="mb-2 font-semibold text-blue-600">Avantages du mode couple</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Partagez vos revenus et dépenses</li>
                        <li>• Vue consolidée du budget du foyer</li>
                        <li>• Attribution des transactions (Moi / Partenaire / Commun)</li>
                        <li>• Synchronisation en temps réel</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Mon partenaire</CardTitle>
                    <CardDescription>
                      Vous gérez actuellement votre budget à deux
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{partnerName}</p>
                          <p className="text-sm text-muted-foreground">Partenaire lié</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Gérer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Catégories et enveloppes */}
          {activeTab === 'categories' && (
            <>
              <div>
                <h2 className="text-3xl font-bold">Catégories et enveloppes</h2>
                <p className="mt-1 text-muted-foreground">
                  Personnalisez vos catégories de transactions
                </p>
              </div>

        <Card>
          <CardHeader>
            <CardTitle>Catégories de dépenses</CardTitle>
            <CardDescription>Gérez vos catégories de dépenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nouvelle catégorie"
                value={newExpenseCategory}
                onChange={(e) => setNewExpenseCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddExpenseCategory()}
              />
              <Button onClick={handleAddExpenseCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              {expenseCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{cat.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catégories de revenus</CardTitle>
            <CardDescription>Gérez vos catégories de revenus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nouvelle catégorie"
                value={newIncomeCategory}
                onChange={(e) => setNewIncomeCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddIncomeCategory()}
              />
              <Button onClick={handleAddIncomeCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              {incomeCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{cat.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enveloppes d'investissement</CardTitle>
            <CardDescription>Gérez vos enveloppes d'investissement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nouvelle enveloppe"
                value={newEnvelope}
                onChange={(e) => setNewEnvelope(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEnvelope()}
              />
              <Button onClick={handleAddEnvelope}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              {envelopes.map((env) => (
                <div key={env.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{env.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEnvelope(env.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
            </>
          )}

          {/* Sécurité */}
          {activeTab === 'security' && (
            <>
              <div>
                <h2 className="text-3xl font-bold">Sécurité</h2>
                <p className="mt-1 text-muted-foreground">
                  Protégez votre compte
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Mot de passe</CardTitle>
                  <CardDescription>
                    Modifiez votre mot de passe régulièrement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button className="w-full">Changer le mot de passe</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appareils de confiance</CardTitle>
                  <CardDescription>
                    Gérez les appareils qui ont accès à votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trustedDevices.map((device) => {
                    const DeviceIcon = getDeviceIcon(device.type);
                    return (
                      <div
                        key={device.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <DeviceIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{device.name}</p>
                              {device.current && (
                                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                                  Appareil actuel
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Dernière utilisation : {new Date(device.lastUsed).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-xs text-muted-foreground">{device.location}</p>
                          </div>
                        </div>
                        {!device.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDevice(device.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  
                  <div className="rounded-lg bg-blue-500/10 p-4">
                    <p className="text-sm text-muted-foreground">
                      💡 Si vous ne reconnaissez pas un appareil, supprimez-le immédiatement et changez votre mot de passe.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supprimer mon compte</CardTitle>
                  <CardDescription className="text-red-600">
                    La suppression de votre compte entraîne la suppression définitive de toutes vos
                    données et est irréversible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive">Je veux supprimer mon compte</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
