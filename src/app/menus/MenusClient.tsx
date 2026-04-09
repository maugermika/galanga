"use client";

import { useState, useMemo } from "react";
import type { Menu, MenuSet } from "@/lib/supabase";
import MenuCard from "@/components/MenuCard";
import Image from "next/image";

type SetWithItems = MenuSet & { items: Menu[] };

export default function MenusClient({
  menus,
  sets,
}: {
  menus: Menu[];
  sets: SetWithItems[];
}) {
  // Extract unique categories in logical order
  const categoryOrder = ["Entrées", "Plats", "Desserts"];

  const categories = useMemo(() => {
    const cats = [...new Set(menus.map((m) => m.category || "Autres"))];
    return cats.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aIdx = categoryOrder.findIndex((c) => c.toLowerCase() === aLower);
      const bIdx = categoryOrder.findIndex((c) => c.toLowerCase() === bLower);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [menus]);

  const tabs = [
    "Tout",
    ...categories,
    ...(sets.length > 0 ? ["Menus Complets"] : []),
  ];

  const [activeTab, setActiveTab] = useState("Tout");

  const filteredMenus = useMemo(() => {
    if (activeTab === "Tout" || activeTab === "Menus Complets") return menus;
    return menus.filter((m) => (m.category || "Autres") === activeTab);
  }, [menus, activeTab]);

  const groupedMenus = useMemo(() => {
    return filteredMenus.reduce(
      (acc, menu) => {
        const cat = menu.category || "Autres";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(menu);
        return acc;
      },
      {} as Record<string, Menu[]>
    );
  }, [filteredMenus]);

  return (
    <div className="batik-bg py-12">
      <div className="max-w-6xl mx-auto px-4 relative">
        <h1 className="text-3xl font-bold text-teal-dark text-center mb-2">
          Nos Menus
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Découvrez notre sélection de plats indonésiens
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-teal-dark text-white shadow-md"
                  : "bg-white text-teal-dark border border-teal-dark/20 hover:bg-teal-light"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menus Complets */}
        {activeTab === "Menus Complets" && sets.length > 0 && (
          <div className="space-y-8 mb-12">
            {sets.map((set) => (
              <div
                key={set.id}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-indo"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-teal-dark">
                      {set.name}
                    </h3>
                    {set.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {set.description}
                      </p>
                    )}
                  </div>
                  {set.price && (
                    <span className="text-xl font-bold text-red-indo whitespace-nowrap">
                      {set.price}
                    </span>
                  )}
                </div>

                {set.items.length > 0 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {set.items.map((item) => (
                      <div
                        key={item.id}
                        className="relative group flex items-center gap-3 bg-cream rounded-lg p-3 cursor-pointer"
                      >
                        {item.image_url ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-cream-dark flex items-center justify-center shrink-0">
                            <span className="text-lg">🍜</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-teal-dark text-sm truncate">
                            {item.name}
                          </p>
                          {item.category && (
                            <p className="text-xs text-gray-400">
                              {item.category}
                            </p>
                          )}
                        </div>

                        {/* Hover card */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none">
                          {item.image_url && (
                            <div className="relative h-36 w-full">
                              <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                            </div>
                          )}
                          <div className="p-3">
                            <p className="font-bold text-teal-dark text-sm">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Regular menus */}
        {activeTab !== "Menus Complets" && (
          <>
            {Object.keys(groupedMenus).length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">🍜</p>
                <p className="text-lg">Les menus arrivent bientôt !</p>
              </div>
            ) : (
              Object.entries(groupedMenus)
                .sort(([a], [b]) => {
                  const aLower = a.toLowerCase();
                  const bLower = b.toLowerCase();
                  const aIdx = categoryOrder.findIndex((c) => c.toLowerCase() === aLower);
                  const bIdx = categoryOrder.findIndex((c) => c.toLowerCase() === bLower);
                  if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
                  if (aIdx !== -1) return -1;
                  if (bIdx !== -1) return 1;
                  return a.localeCompare(b);
                })
                .map(([category, items]) => (
                <section key={category} className="mb-12">
                  {activeTab === "Tout" && (
                    <h2 className="text-xl font-bold text-teal-dark mb-6 border-b-2 border-red-indo pb-2">
                      {category}
                    </h2>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((menu) => (
                      <MenuCard key={menu.id} menu={menu} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </>
        )}
        {/* WhatsApp ordering notice */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-teal-dark font-semibold mb-2">
            Pour commander, envoyez-nous un message sur WhatsApp !
          </p>
          <a
            href="https://wa.me/33749545047?text=Bonjour%20!%20Je%20souhaite%20passer%20une%20commande%20chez%20Galanga."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5">
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.342 22.616c-.392 1.098-1.94 2.01-3.172 2.276-.846.18-1.95.324-5.67-1.218-4.762-1.97-7.826-6.798-8.064-7.114-.228-.316-1.918-2.556-1.918-4.876 0-2.32 1.214-3.462 1.646-3.934.392-.428 1.03-.632 1.64-.632.198 0 .376.01.536.018.47.02.706.048 1.016.788.388.926 1.332 3.246 1.45 3.482.118.236.236.554.078.87-.148.326-.278.47-.514.742-.236.272-.46.48-.696.774-.216.256-.46.53-.196.998.264.46 1.174 1.936 2.522 3.136 1.734 1.542 3.194 2.02 3.648 2.246.354.178.776.138 1.05-.158.348-.376.778-.998 1.214-1.612.31-.44.702-.494 1.096-.336.398.148 2.522 1.19 2.954 1.408.432.216.72.326.826.504.108.178.108 1.028-.284 2.126z" />
            </svg>
            Commander via WhatsApp
          </a>
        </div>

        {/* TVA notice */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Prix nets – TVA non applicable (art. 293 B du CGI)
        </p>
      </div>
    </div>
  );
}
