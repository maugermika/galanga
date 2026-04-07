-- ============================================
-- Galanga - Schéma Supabase
-- Exécuter ce SQL dans le SQL Editor de Supabase
-- ============================================

-- 1. Table des menus
create table if not exists menus (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  price text default '',
  category text default '',
  image_url text,
  available boolean default true,
  created_at timestamp with time zone default now()
);

-- 2. Activer Row Level Security
alter table menus enable row level security;

-- 3. Politique : tout le monde peut LIRE les menus
create policy "Menus are publicly readable"
  on menus for select
  using (true);

-- 4. Politique : seuls les utilisateurs authentifiés peuvent modifier
create policy "Authenticated users can insert menus"
  on menus for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update menus"
  on menus for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete menus"
  on menus for delete
  to authenticated
  using (true);

-- ============================================
-- 5. STORAGE : Policies pour le bucket menu-images
-- Le bucket doit être créé manuellement dans Storage > New Bucket
-- Nom : menu-images | Public : oui
-- Puis exécuter le SQL ci-dessous :
-- ============================================

-- Tout le monde peut VOIR les images (bucket public)
create policy "Public read access on menu-images"
  on storage.objects for select
  using (bucket_id = 'menu-images');

-- Les utilisateurs authentifiés peuvent UPLOADER des images
create policy "Authenticated users can upload menu images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'menu-images');

-- Les utilisateurs authentifiés peuvent MODIFIER des images
create policy "Authenticated users can update menu images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'menu-images');

-- Les utilisateurs authentifiés peuvent SUPPRIMER des images
create policy "Authenticated users can delete menu images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'menu-images');
