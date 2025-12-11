export type BrandKey = 'froggymouth' | 'brandB';

export type BrandTexts = {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroSecondaryCta: string;
    dashboardWelcome: (name: string) => string;
    patientFormTitle: string;
    confirmationTitle: string;
    confirmationBody: string;
};

export type BrandConfig = {
    key: BrandKey;
    name: string;
    logoUrl: string;
    texts: BrandTexts;
};

const configs: Record<BrandKey, BrandConfig> = {
    froggymouth: {
        key: 'froggymouth',
        name: 'Froggymouth',
        logoUrl: process.env.NEXT_PUBLIC_CDN_URL + '/logo.png',
        texts: {
            heroTitle: 'L’allié de vos rééducations,',
            heroSubtitle: 'pour faciliter l’automatisation.',
            heroCta: "S'inscrire",
            heroSecondaryCta: 'Se connecter',
            dashboardWelcome: (name) => `Bienvenue Dr. ${name} !`,
            patientFormTitle: 'Formulaire patient Froggymouth',
            confirmationTitle: 'Merci pour votre commande !',
            confirmationBody:
                'Votre commande a été enregistrée avec succès. Vous recevrez un e-mail récapitulatif sous peu.',
        },
    },
    brandB: {
        key: 'brandB',
        name: 'Brand B',
        logoUrl: '/brandB-logo.svg',
        texts: {
            heroTitle: 'Une solution simple',
            heroSubtitle: 'pour vos traitements personnalisés.',
            heroCta: 'Créer un compte',
            heroSecondaryCta: 'Connexion',
            dashboardWelcome: (name) => `Bienvenue ${name}`,
            patientFormTitle: 'Formulaire patient Brand B',
            confirmationTitle: 'Paiement confirmé',
            confirmationBody:
                'Votre paiement a bien été pris en compte. Merci pour votre confiance.',
        },
    },
};

export function getBrandConfig(): BrandConfig {
    const key = (process.env.BRAND_KEY as BrandKey) || 'froggymouth';
    const cfg = configs[key];
    if (!cfg) throw new Error(`Unknown BRAND_KEY: ${key}`);
    return cfg;
}
