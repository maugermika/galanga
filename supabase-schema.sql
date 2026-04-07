-- ============================================
-- Galanga - Schema Supabase
-- Executer ce SQL dans le SQL Editor de Supabase
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

-- 4. Politique : seuls les utilisateurs authentifies peuvent modifier
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

-- 5. Creer le bucket de stockage pour les images
-- (A faire manuellement dans Supabase Dashboard > Storage)
-- Nom du bucket : menu-images
-- Public : oui
