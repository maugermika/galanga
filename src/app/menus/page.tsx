import { supabase } from "@/lib/supabase";
import type { Menu } from "@/lib/supabase";
import MenuCard from "@/components/MenuCard";

export const revalidate = 0; // Always fetch fresh data

export default async function MenusPage() {
  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .eq("available", true)
    .order("category", { ascending: true })
    .order("created_at", { ascending: false });

  const grouped = (menus as Menu[] | null)?.reduce(
    (acc, menu) => {
      const cat = menu.category || "Autres";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(menu);
      return acc;
    },
    {} as Record<string, Menu[]>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-teal-dark text-center mb-2">
        Nos Menus
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Decouvrez notre selection de plats indonesiens
      </p>

      {!grouped || Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🍜</p>
          <p className="text-lg">Les menus arrivent bientot !</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="mb-12">
            <h2 className="text-xl font-bold text-teal-dark mb-6 border-b-2 border-red-indo pb-2">
              {category}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((menu) => (
                <MenuCard key={menu.id} menu={menu} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
