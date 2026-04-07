import Image from "next/image";

export default function HistoirePage() {
  return (
    <div className="batik-bg py-12">
      <div className="max-w-4xl mx-auto px-4 relative">
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
            style={{ width: "240px", height: "auto" }}
            className="opacity-90"
          />
        </div>

        <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            <strong className="text-teal-dark">Galanga</strong>  est né d&apos;une
            passion pour la cuisine indonésienne authentique. Notre aventure a
            commencé avec le désir de partager les saveurs riches et variées de
            l&apos;archipel indonésien.
          </p>

          <p>
            Chaque plat que nous préparons est inspiré de recettes
            traditionnelles, transmises de génération en génération. Nous
            utilisons des ingrédients frais et des épices authentiques pour
            recréer les goûts de l&apos;Indonésie.
          </p>

          <p>
            Le <em>galanga</em>, cette racine aromatique cousine du gingembre,
            est un ingrédient essentiel de la cuisine indonésienne. Il symbolise
            notre engagement à offrir des saveurs authentiques et un voyage
            culinaire unique.
          </p>

          <p>
            Notre mission est simple : vous faire découvrir la richesse de la
            cuisine indonésienne à travers des plats faits maison, préparés avec
            amour et dédiés à votre plaisir.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
