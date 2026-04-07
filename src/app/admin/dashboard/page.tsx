"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Menu } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    const { data } = await supabase
      .from("menus")
      .select("*")
      .order("created_at", { ascending: false });
    setMenus((data as Menu[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin");
        return;
      }
      fetchMenus();
    });
  }, [router, fetchMenus]);

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
  }

  function startEdit(menu: Menu) {
    setEditing(menu);
    setName(menu.name);
    setDescription(menu.description || "");
    setPrice(menu.price || "");
    setCategory(menu.category || "");
    setAvailable(menu.available);
    setImagePreview(menu.image_url);
    setImageFile(null);
    setShowForm(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("menu-images").getPublicUrl(fileName);

    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let image_url = editing?.image_url || null;

    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) image_url = url;
    }

    const menuData = {
      name,
      description,
      price,
      category,
      available,
      image_url,
    };

    if (editing) {
      await supabase.from("menus").update(menuData).eq("id", editing.id);
    } else {
      await supabase.from("menus").insert(menuData);
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-teal-dark">
          Gestion des Menus
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-teal-dark hover:bg-teal-medium text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Nouveau plat
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Deconnexion
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-teal-dark mb-4">
            {editing ? "Modifier le plat" : "Ajouter un plat"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du plat *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 12.50 €"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categorie
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Plats principaux, Desserts..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-medium"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4 text-teal-dark rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Disponible
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-light file:text-teal-dark hover:file:bg-teal-medium hover:file:text-white file:cursor-pointer file:transition-colors"
              />
              {imagePreview && (
                <div className="mt-3 relative w-40 h-28 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-teal-dark hover:bg-teal-medium text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : editing
                    ? "Modifier"
                    : "Ajouter"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu list */}
      {menus.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🍽️</p>
          <p>Aucun plat pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
            >
              {menu.image_url ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={menu.image_url}
                    alt={menu.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-cream-dark flex items-center justify-center shrink-0">
                  <span className="text-2xl">🍜</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-teal-dark truncate">
                    {menu.name}
                  </h3>
                  {!menu.available && (
                    <span className="text-xs bg-red-100 text-red-indo px-2 py-0.5 rounded-full">
                      Indisponible
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {menu.category}
                  {menu.price && ` - ${menu.price}`}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(menu)}
                  className="text-teal-dark hover:bg-teal-light px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(menu.id)}
                  className="text-red-indo hover:bg-red-50 px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
