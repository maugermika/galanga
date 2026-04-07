import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-teal-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Image
            src="/logo.png"
            alt="Galanga"
            width={320}
            height={210}
            style={{ width: "320px", height: "auto" }}
            className="mx-auto mb-8 logo-glow"
            priority
          />
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Savourez les saveurs authentiques de l&apos;Indonésie. Plats
            traditionnels préparés avec passion, à emporter.
          </p>
          <Link
            href="/menus"
            className="inline-block bg-red-indo hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            Voir nos menus
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="batik-bg py-16">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-8 relative">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🍛</div>
            <h3 className="text-lg font-bold text-teal-dark mb-2">
              Recettes Authentiques
            </h3>
            <p className="text-gray-600 text-sm">
              Des plats traditionnels indonésiens préparés selon des recettes
              familiales transmises de génération en génération.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🥡</div>
            <h3 className="text-lg font-bold text-teal-dark mb-2">
              Vente à Emporter
            </h3>
            <p className="text-gray-600 text-sm">
              Commandez et récupérez vos plats frais, prêts à déguster chez
              vous.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-lg font-bold text-teal-dark mb-2">
              Fait avec Amour
            </h3>
            <p className="text-gray-600 text-sm">
              Chaque plat est cuisiné avec soin et des ingrédients de qualité
              pour vous offrir le meilleur de l&apos;Indonésie.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
