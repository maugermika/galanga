import Image from "next/image";
import type { Menu } from "@/lib/supabase";

export default function MenuCard({ menu }: { menu: Menu }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {menu.image_url ? (
        <div className="relative h-52 w-full">
          <Image
            src={menu.image_url}
            alt={menu.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-52 w-full bg-cream-dark flex items-center justify-center">
          <span className="text-4xl">🍜</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-teal-dark">{menu.name}</h3>
          {menu.price && (
            <span className="text-red-indo font-bold whitespace-nowrap">
              {menu.price}
            </span>
          )}
        </div>
        {menu.description && (
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {menu.description}
          </p>
        )}
        {menu.category && (
          <span className="inline-block mt-3 px-3 py-1 bg-teal-light text-teal-dark text-xs font-medium rounded-full">
            {menu.category}
          </span>
        )}
      </div>
    </div>
  );
}
