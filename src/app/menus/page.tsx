import { supabase } from "@/lib/supabase";
import type { Menu, MenuSet, MenuSetItem } from "@/lib/supabase";
import MenusClient from "./MenusClient";

export const revalidate = 0;

export default async function MenusPage() {
  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .eq("available", true)
    .order("category", { ascending: true })
    .order("created_at", { ascending: false });

  const { data: sets } = await supabase
    .from("menu_sets")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  let setsWithItems: (MenuSet & { items: Menu[] })[] = [];

  if (sets && sets.length > 0) {
    const { data: setItems } = await supabase
      .from("menu_set_items")
      .select("*, menu:menus(*)")
      .in(
        "set_id",
        sets.map((s: MenuSet) => s.id)
      );

    setsWithItems = (sets as MenuSet[]).map((set) => ({
      ...set,
      items: ((setItems as MenuSetItem[]) || [])
        .filter((si) => si.set_id === set.id && si.menu)
        .map((si) => si.menu as Menu),
    }));
  }

  return (
    <MenusClient
      menus={(menus as Menu[]) || []}
      sets={setsWithItems}
    />
  );
}
