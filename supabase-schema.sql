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

-- 2. Table des menus complets (sets)
create table if not exists menu_sets (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  price text default '',
  available boolean default true,
  created_at timestamp with time zone default now()
);

-- 3. Table de liaison : plats dans un menu complet
create table if not exists menu_set_items (
  id uuid default gen_random_uuid() primary key,
  set_id uuid references menu_sets(id) on delete cascade,
  menu_id uuid references menus(id) on delete cascade
);

-- 4. Activer Row Level Security
alter table menus enable row level security;
alter table menu_sets enable row level security;
alter table menu_set_items enable row level security;

-- 5. Policies : lecture publique
create policy "Menus are publicly readable"
  on menus for select using (true);

create policy "Menu sets are publicly readable"
  on menu_sets for select using (true);

create policy "Menu set items are publicly readable"
  on menu_set_items for select using (true);

-- 6. Policies : modification authentifiée (menus)
create policy "Authenticated users can insert menus"
  on menus for insert to authenticated with check (true);

create policy "Authenticated users can update menus"
  on menus for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete menus"
  on menus for delete to authenticated using (true);

-- 7. Policies : modification authentifiée (menu_sets)
create policy "Authenticated users can insert menu sets"
  on menu_sets for insert to authenticated with check (true);

create policy "Authenticated users can update menu sets"
  on menu_sets for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete menu sets"
  on menu_sets for delete to authenticated using (true);

-- 8. Policies : modification authentifiée (menu_set_items)
create policy "Authenticated users can insert menu set items"
  on menu_set_items for insert to authenticated with check (true);

create policy "Authenticated users can delete menu set items"
  on menu_set_items for delete to authenticated using (true);

-- ============================================
-- 9. STORAGE : Policies pour le bucket menu-images
-- Le bucket doit être créé manuellement dans Storage > New Bucket
-- Nom : menu-images | Public : oui
-- ============================================

create policy "Public read access on menu-images"
  on storage.objects for select
  using (bucket_id = 'menu-images');

create policy "Authenticated users can upload menu images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'menu-images');

create policy "Authenticated users can update menu images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'menu-images');

create policy "Authenticated users can delete menu images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'menu-images');
