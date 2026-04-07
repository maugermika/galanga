import Image from "next/image";

export default function HistoirePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-teal-dark text-center mb-10">
        Notre Histoire
      </h1>

      <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Galanga"
            width={240}
            height={156}
            className="opacity-90"
          />
        </div>

        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            <strong className="text-teal-dark">Galanga</strong> est ne d&apos;une
            passion pour la cuisine indonesienne authentique. Notre aventure a
            commence avec le desir de partager les saveurs riches et variees de
            l&apos;archipel indonesien.
          </p>

          <p>
            Chaque plat que nous preparons est inspire de recettes
            traditionnelles, transmises de generation en generation. Nous
            utilisons des ingredients frais et des epices authentiques pour
            recreer les gouts de l&apos;Indonesie.
          </p>

          <p>
            Le <em>galanga</em>, cette racine aromatique cousine du gingembre,
            est un ingredient essentiel de la cuisine indonesienne. Il symbolise
            notre engagement a offrir des saveurs authentiques et un voyage
            culinaire unique.
          </p>

          <p>
            Notre mission est simple : vous faire decouvrir la richesse de la
            cuisine indonesienne a travers des plats faits maison, prepares avec
            amour et dedies a votre plaisir.
          </p>
        </div>
      </div>
    </div>
  );
}
