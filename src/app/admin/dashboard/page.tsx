"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Menu, MenuSet } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"plats" | "sets">("plats");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [sets, setSets] = useState<(MenuSet & { items: Menu[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Menu form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Set form state
  const [showSetForm, setShowSetForm] = useState(false);
  const [editingSet, setEditingSet] = useState<(MenuSet & { items: Menu[] }) | null>(null);
  const [comboName, setComboName] = useState("");
  const [comboDesc, setComboDesc] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [comboAvail, setComboAvail] = useState(true);
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);

  const fetchMenus = useCallback(async () => {
    const { data } = await supabase
      .from("menus")
      .select("*")
      .order("created_at", { ascending: false });
    setMenus((data as Menu[]) || []);
  }, []);

  const fetchSets = useCallback(async () => {
    const { data: setsData } = await supabase
      .from("menu_sets")
      .select("*")
      .order("created_at", { ascending: false });

    if (setsData && setsData.length > 0) {
      const { data: itemsData } = await supabase
        .from("menu_set_items")
        .select("*, menu:menus(*)")
        .in("set_id", setsData.map((s: MenuSet) => s.id));

      const enriched = (setsData as MenuSet[]).map((set) => ({
        ...set,
        items: (itemsData || [])
          .filter((si: { set_id: string; menu?: Menu }) => si.set_id === set.id && si.menu)
          .map((si: { menu: Menu }) => si.menu),
      }));
      setSets(enriched);
    } else {
      setSets([]);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin");
        return;
      }
      Promise.all([fetchMenus(), fetchSets()]).then(() => setLoading(false));
    });
  }, [router, fetchMenus, fetchSets]);

  // ---- Menu CRUD ----

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setAvailable(true);
    setImageFile(null);
    setImagePreview(null);
    setEditing(null);
    setShowForm(false);
    setUploadError("");
  }

  // Extract existing categories for dropdown
  const existingCategories = [...new Set(menus.map((m) => m.category).filter(Boolean))].sort();

  function handlePriceChange(val: string) {
    // Allow only digits, comma, and dot
    const cleaned = val.replace(/[^0-9.,]/g, "");
    setPrice(cleaned);
  }

  function formatPriceForSave(val: string): string {
    if (!val.trim()) return "";
    return `${val.trim()} €`;
  }

  function handleComboPriceChange(val: string) {
    const cleaned = val.replace(/[^0-9.,]/g, "");
    setComboPrice(cleaned);
  }

  function startEdit(menu: Menu) {
    setEditing(menu);
    setName(menu.name);
    setDescription(menu.description || "");
    // Strip € for editing
    setPrice((menu.price || "").replace(/\s*€\s*$/, ""));
    setCategory(menu.category || "");
    setAvailable(menu.available);
    setImagePreview(menu.image_url);
    setImageFile(null);
    setShowForm(true);
    setUploadError("");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadError("");
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setUploadError("Session expirée. Veuillez vous reconnecter.");
      return null;
    }

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      setUploadError(`Erreur upload : ${error.message}`);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage.from("menu-images").getPublicUrl(fileName);
    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setUploadError("");

    let image_url = editing?.image_url || null;
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) {
        image_url = url;
      } else {
        setSaving(false);
        return;
      }
    }

    const menuData = { name, description, price: formatPriceForSave(price), category, available, image_url };

    if (editing) {
      const { error } = await supabase.from("menus").update(menuData).eq("id", editing.id);
      if (error) { setUploadError(`Erreur : ${error.message}`); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("menus").insert(menuData);
      if (error) { setUploadError(`Erreur : ${error.message}`); setSaving(false); return; }
    }

    resetForm();
    setSaving(false);
    fetchMenus();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce plat ?")) return;
    await supabase.from("menus").delete().eq("id", id);
    fetchMenus();
  }

  // ---- Set CRUD ----

  function resetSetForm() {
    setComboName("");
    setComboDesc("");
    setComboPrice("");
    setComboAvail(true);
    setSelectedMenuIds([]);
    setEditingSet(null);
    setShowSetForm(false);
    setUploadError("");
  }

  function startEditSet(set: MenuSet & { items: Menu[] }) {
    setEditingSet(set);
    setComboName(set.name);
    setComboDesc(set.description || "");
    setComboPrice((set.price || "").replace(/\s*€\s*$/, ""));
    setComboAvail(set.available);
    setSelectedMenuIds(set.items.map((i) => i.id));
    setShowSetForm(true);
    setUploadError("");
  }

  function toggleMenuInSet(menuId: string) {
    setSelectedMenuIds((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  }

  async function handleSetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setUploadError("");

    const setData = {
      name: comboName,
      description: comboDesc,
      price: formatPriceForSave(comboPrice),
      available: comboAvail,
    };

    let setId: string;

    if (editingSet) {
      const { error } = await supabase.from("menu_sets").update(setData).eq("id", editingSet.id);
      if (error) { setUploadError(`Erreur : ${error.message}`); setSaving(false); return; }
      setId = editingSet.id;
      // Remove old items
      await supabase.from("menu_set_items").delete().eq("set_id", setId);
    } else {
      const { data, error } = await supabase.from("menu_sets").insert(setData).select().single();
      if (error || !data) { setUploadError(`Erreur : ${error?.message}`); setSaving(false); return; }
      setId = data.id;
    }

    // Insert selected items
    if (selectedMenuIds.length > 0) {
      const items = selectedMenuIds.map((menu_id) => ({ set_id: setId, menu_id }));
      await supabase.from("menu_set_items").insert(items);
    }

    resetSetForm();
    setSaving(false);
    fetchSets();
  }

  async function handleDeleteSet(id: string) {
    if (!confirm("Supprimer ce menu complet ?")) return;
    await supabase.from("menu_sets").delete().eq("id", id);
    fetchSets();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-teal-dark">Administration</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Déconnexion
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveSection("plats")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "plats"
              ? "bg-teal-dark text-white"
              : "bg-white text-teal-dark border border-teal-dark/20"
          }`}
        >
          🍛 Plats
        </button>
        <button
          onClick={() => setActiveSection("sets")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeSection === "sets"
              ? "bg-teal-dark text-white"
              : "bg-white text-teal-dark border border-teal-dark/20"
          }`}
        >
          📋 Menus Complets
        </button>
      </div>

      {/* ==================== PLATS ==================== */}
      {activeSection === "plats" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-teal-dark">Gestion des Plats</h2>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-teal-dark hover:bg-teal-medium text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Nouveau plat
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-teal-dark mb-4">
                {editing ? "Modifier le plat" : "Ajouter un plat"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                    <div className="relative">
                      <input type="text" value={price} onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder="12,50" inputMode="decimal"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-medium" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={existingCategories.includes(category) ? category : (category ? "__custom__" : "")}
                      onChange={(e) => {
                        if (e.target.value === "__custom__") {
                          setCategory("");
                          // Focus on the custom input after render
                          setTimeout(() => {
                            const el = document.getElementById("custom-category");
                            if (el) el.focus();
                          }, 50);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium"
                    >
                      <option value="">— Choisir —</option>
                      {existingCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__custom__">+ Nouvelle catégorie...</option>
                    </select>
                    {(!existingCategories.includes(category) && category !== "") && (
                      <input id="custom-category" type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                        placeholder="Nom de la nouvelle catégorie"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-teal-medium" />
                    )}
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="w-4 h-4 text-teal-dark rounded" />
                      <span className="text-sm font-medium text-gray-700">Disponible</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                  <input type="file" accept="image/*" onChange={handleImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-light file:text-teal-dark hover:file:bg-teal-medium hover:file:text-white file:cursor-pointer file:transition-colors" />
                  {imagePreview && (
                    <div className="mt-3 relative w-40 h-28 rounded-lg overflow-hidden">
                      <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                    </div>
                  )}
                </div>
                {uploadError && <p className="text-red-indo text-sm bg-red-50 p-3 rounded-lg">{uploadError}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="bg-teal-dark hover:bg-teal-medium text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    {saving ? "Enregistrement..." : editing ? "Modifier" : "Ajouter"}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {menus.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🍽️</p>
              <p>Aucun plat pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {menus.map((menu) => (
                <div key={menu.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                  {menu.image_url ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image src={menu.image_url} alt={menu.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-cream-dark flex items-center justify-center shrink-0">
                      <span className="text-2xl">🍜</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-teal-dark truncate">{menu.name}</h3>
                      {!menu.available && (
                        <span className="text-xs bg-red-100 text-red-indo px-2 py-0.5 rounded-full">Indisponible</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {menu.category}{menu.price && ` — ${menu.price}`}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(menu)}
                      className="text-teal-dark hover:bg-teal-light px-3 py-1 rounded-lg text-sm transition-colors">Modifier</button>
                    <button onClick={() => handleDelete(menu.id)}
                      className="text-red-indo hover:bg-red-50 px-3 py-1 rounded-lg text-sm transition-colors">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ==================== MENUS COMPLETS ==================== */}
      {activeSection === "sets" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-teal-dark">Menus Complets</h2>
            <button
              onClick={() => { resetSetForm(); setShowSetForm(true); }}
              className="bg-teal-dark hover:bg-teal-medium text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Nouveau menu complet
            </button>
          </div>

          {showSetForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-teal-dark mb-4">
                {editingSet ? "Modifier le menu complet" : "Créer un menu complet"}
              </h3>
              <form onSubmit={handleSetSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du menu *</label>
                    <input type="text" value={comboName} onChange={(e) => setComboName(e.target.value)} required
                      placeholder="Ex : Menu Découverte"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix du menu</label>
                    <div className="relative">
                      <input type="text" value={comboPrice} onChange={(e) => handleComboPriceChange(e.target.value)}
                        placeholder="18,90" inputMode="decimal"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-medium" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={comboDesc} onChange={(e) => setComboDesc(e.target.value)} rows={2}
                    placeholder="Ex : Entrée + Plat + Dessert au choix"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={comboAvail} onChange={(e) => setComboAvail(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Disponible</span>
                </div>

                {/* Select dishes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner les plats ({selectedMenuIds.length} sélectionné{selectedMenuIds.length > 1 ? "s" : ""})
                  </label>
                  <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    {menus.filter(m => m.available).length === 0 ? (
                      <p className="p-4 text-gray-400 text-sm text-center">Aucun plat disponible</p>
                    ) : (
                      menus.filter(m => m.available).map((menu) => (
                        <label key={menu.id}
                          className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-teal-light/50 ${
                            selectedMenuIds.includes(menu.id) ? "bg-teal-light" : ""
                          }`}>
                          <input type="checkbox" checked={selectedMenuIds.includes(menu.id)}
                            onChange={() => toggleMenuInSet(menu.id)} className="w-4 h-4 text-teal-dark rounded" />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm text-teal-dark">{menu.name}</span>
                            <span className="text-xs text-gray-400 ml-2">{menu.category}</span>
                          </div>
                          {menu.price && <span className="text-xs text-gray-500">{menu.price}</span>}
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {uploadError && <p className="text-red-indo text-sm bg-red-50 p-3 rounded-lg">{uploadError}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="bg-teal-dark hover:bg-teal-medium text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    {saving ? "Enregistrement..." : editingSet ? "Modifier" : "Créer"}
                  </button>
                  <button type="button" onClick={resetSetForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {sets.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p>Aucun menu complet pour le moment</p>
              <p className="text-sm mt-1">Créez un menu en combinant plusieurs plats</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sets.map((set) => (
                <div key={set.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-teal-dark">{set.name}</h3>
                        {!set.available && (
                          <span className="text-xs bg-red-100 text-red-indo px-2 py-0.5 rounded-full">Indisponible</span>
                        )}
                      </div>
                      {set.price && <p className="text-sm text-red-indo font-medium">{set.price}</p>}
                      {set.items.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          {set.items.map((i) => i.name).join(" • ")}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEditSet(set)}
                        className="text-teal-dark hover:bg-teal-light px-3 py-1 rounded-lg text-sm transition-colors">Modifier</button>
                      <button onClick={() => handleDeleteSet(set.id)}
                        className="text-red-indo hover:bg-red-50 px-3 py-1 rounded-lg text-sm transition-colors">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
