import Link from "next/link";
import Image from "next/image";
import { getBrandConfig } from "@/lib/brand";

export default function HomePage() {
    const brand = getBrandConfig();

    return (
        <main className="bg-white font-poppins text-brand-dark">
            {/* HERO SECTION */}
            <section
                id="hero"
                className="bg-brand-green pt-32 pb-20 lg:h-[36rem] overflow-hidden"
            >
                <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-full flex-col items-center justify-between lg:flex-row">
                        {/* Hero text */}
                        <div
                            id="hero-text"
                            className="mb-10 text-center text-white lg:mb-0 lg:w-1/2 lg:text-left"
                        >
                            <h1 className="text-4xl leading-tight md:text-5xl lg:text-6xl">
                                <span>L&apos;allié de vos rééducations,</span>{" "}
                                <span className="font-bold">pour faciliter l&apos;automatisation.</span>
                            </h1>
                            <a
                                href="https://froggymouth.com/"
                                target="_blank"
                                className="mt-8 inline-block rounded-full border border-white py-3 px-8 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-brand-green"
                            >
                                Voir plus
                            </a>
                        </div>

                        {/* Hero image */}
                        <div
                            id="hero-image"
                            className="flex justify-center lg:w-1/2 lg:justify-end"
                        >
                            <Image
                                className="h-auto w-full max-w-md object-contain lg:max-w-lg"
                                src={process.env.NEXT_PUBLIC_CDN_URL + "/froggy_no_bg.png"}
                                alt="Dispositif Froggymouth"
                                width={815}
                                height={689}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY FROGGYMOUTH */}
            <section id="why-froggymouth" className="py-20 md:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Heading */}
                    <div id="why-heading" className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl md:text-4xl text-brand-green">
                            Pourquoi devenir prescripteur{" "}
                            <span className="font-bold">
                {brand.name ?? "Froggymouth"} ?
              </span>
                        </h2>
                        <p className="text-lg text-gray-600 font-bold">
                            Un dispositif innovant, une solution simple pour vos
                            patients.
                        </p>
                        <p className="mt-2 text-gray-600">
                            {brand.name} est un appareil de rééducation passive pour
                            automatiser l&apos;équilibre des fonctions oro-faciales :
                        </p>
                    </div>

                    {/* Features */}
                    <div id="features-grid" className="space-y-20">
                        {/* Feature 1 */}
                        <div
                            id="feature-1"
                            className="flex flex-col items-center gap-12 md:flex-row md:gap-16"
                        >
                            <div className="md:w-1/2">
                                <div className="h-80 overflow-hidden rounded-2xl shadow-lg">
                                    <Image
                                        className="h-full w-full object-cover"
                                        src={process.env.NEXT_PUBLIC_CDN_URL + "/manza.jpg"}
                                        alt="Enfant tenant un dispositif"
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="mb-4 text-xl font-bold">
                                    1. Offrir une solution efficace et non contraignante
                                </h3>
                                <ul className="list-inside list-disc space-y-2 text-gray-600">
                                    <li>
                                        Dispositif non-invasif, facile à mettre en place
                                    </li>
                                    <li>
                                        Se complète avec toute autre thérapeutique menée en
                                        parallèle (rééducation active, traitements
                                        orthodontiques)
                                    </li>
                                    <li>
                                        Adapté aux patients de tout âge (dès 3 ans, sans
                                        limite d&apos;âge)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div
                            id="feature-2"
                            className="flex flex-col items-center gap-12 md:flex-row-reverse md:gap-16"
                        >
                            <div className="md:w-1/2">
                                <div className="h-80 overflow-hidden rounded-2xl shadow-lg">
                                    <Image
                                        className="h-full w-full object-cover"
                                        src={process.env.NEXT_PUBLIC_CDN_URL + "/capture.png"}
                                        alt="Patiente tenant un dispositif"
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="mb-4 text-xl font-bold">
                                    2. Renforcer l&apos;observance et l&apos;implication du
                                    patient
                                </h3>
                                <ul className="list-inside list-disc space-y-2 text-gray-600">
                                    <li>Utilisation courte : 15 minutes par jour</li>
                                    <li>
                                        Ludique : à utiliser devant un écran de télévision
                                    </li>
                                    <li>
                                        Facile à intégrer dans une routine familiale
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div
                            id="feature-3"
                            className="flex flex-col items-center gap-12 md:flex-row md:gap-16"
                        >
                            <div className="md:w-1/2">
                                <div className="h-80 overflow-hidden rounded-2xl shadow-lg">
                                    <Image
                                        className="h-full w-full object-cover"
                                        src={process.env.NEXT_PUBLIC_CDN_URL + "/computer.jpg"}
                                        alt="Professionnel travaillant sur un ordinateur"
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="mb-4 text-xl font-bold">
                                    3. Accéder à un espace prescripteur personnalisé
                                </h3>
                                <ul className="list-inside list-disc space-y-2 text-gray-600">
                                    <li>
                                        Page dédiée avec un lien unique et un QR code
                                    </li>
                                    <li>
                                        Tableau de bord pour suivre vos prescriptions
                                        patients
                                    </li>
                                    <li>
                                        Envoi automatique des commandes aux patients
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div
                            id="feature-4"
                            className="flex flex-col items-center gap-12 md:flex-row-reverse md:gap-16"
                        >
                            <div className="md:w-1/2">
                                <div className="h-80 overflow-hidden rounded-2xl shadow-lg">
                                    <Image
                                        className="h-full w-full object-cover"
                                        src={process.env.NEXT_PUBLIC_CDN_URL + "/crowd.jpg"}
                                        alt="Audience lors d'un congrès"
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="mb-4 text-xl font-bold">
                                    4. Rejoindre une communauté de professionnels engagés
                                </h3>
                                <ul className="list-inside list-disc space-y-2 text-gray-600">
                                    <li>
                                        Échanges avec des confrères du monde entier
                                    </li>
                                    <li>
                                        Accès à des webinaires, supports cliniques et
                                        évènements scientifiques
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW TO PRESCRIBE */}
            <section
                id="how-to-prescribe"
                className="bg-gray-50 py-20 md:py-28"
            >
                <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <Link
                        href="/auth/register"
                        id="cta-button"
                        className="inline-block cursor-pointer rounded-full bg-brand-green px-10 py-4 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-opacity-90"
                    >
                        Devenir prescripteur maintenant
                    </Link>

                    <div
                        id="prescription-steps"
                        className="mt-16 text-left"
                    >
                        <h3 className="mb-8 text-center text-2xl font-bold">
                            Comment prescrire un Froggymouth
                        </h3>
                        <ul className="mx-auto max-w-2xl space-y-6 text-gray-700">
                            <li className="flex items-start">
                                <span className="mr-4 mt-1 text-brand-green">•</span>
                                <span>
                  Vous demandez à votre patient de scanner votre QR code,
                  ou bien, vous entrez son email dans la case dédiée de
                  votre espace prescripteur
                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-4 mt-1 text-brand-green">•</span>
                                <span>
                  Votre patient entre ses coordonnées, choisit, sur votre
                  recommandation la taille qui lui convient et procède au
                  paiement
                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-4 mt-1 text-brand-green">•</span>
                                <span>
                  Votre patient reçoit dans les 5j ouvrés l&apos;appareil
                  que vous pourrez mettre en place dès la séance suivante
                </span>
                            </li>
                        </ul>

                        <div
                            id="additional-info"
                            className="mx-auto mt-12 max-w-2xl space-y-4 text-sm text-gray-600"
                        >
                            <p>
                                <strong>Nb :</strong> Vous pouvez décider si vous
                                souhaitez que votre patient reçoive l&apos;appareil chez
                                lui, ou qu&apos;il soit envoyé dans votre cabinet.
                            </p>
                            <p>
                                <strong>N&apos;oubliez pas</strong> de participer aux
                                séances de formations prescripteur pour perfectionner votre
                                utilisation de l&apos;appareil.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
