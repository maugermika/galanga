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
            className="mx-auto mb-8"
            priority
          />
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Savourez les saveurs authentiques de l&apos;Indonesie. Plats
            traditionnels prepares avec passion, a emporter.
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
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🍛</div>
            <h3 className="text-lg font-bold text-teal-dark mb-2">
              Recettes Authentiques
            </h3>
            <p className="text-gray-600 text-sm">
              Des plats traditionnels indonesiens prepares selon des recettes
              familiales transmises de generation en generation.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🥡</div>
            <h3 className="text-lg font-bold text-teal-dark mb-2">
              Vente a Emporter
            </h3>
            <p className="text-gray-600 text-sm">
              Commandez et recuperez vos plats frais, prets a deguster chez
              vous.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-lg font-bold text-teal-dark mb-2">
              Fait avec Amour
            </h3>
            <p className="text-gray-600 text-sm">
              Chaque plat est cuisine avec soin et des ingredients de qualite
              pour vous offrir le meilleur de l&apos;Indonesie.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
