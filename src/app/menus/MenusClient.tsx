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
  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(menus.map((m) => m.category || "Autres"))];
    return cats.sort();
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
    <div className="max-w-6xl mx-auto px-4 py-12 batik-bg">
      <div className="relative">
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
                        className="flex items-center gap-3 bg-cream rounded-lg p-3"
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
              Object.entries(groupedMenus).map(([category, items]) => (
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
      </div>
    </div>
  );
}
