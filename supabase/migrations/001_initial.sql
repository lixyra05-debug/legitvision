-- ============================================================
-- LegitVision — Migration initiale
-- Tables, RLS, triggers, données de base
-- ============================================================

-- Extensions nécessaires
create extension if not exists "uuid-ossp";
create extension if not exists "moddatetime";

-- ============================================================
-- 1. TABLES
-- ============================================================

-- ---------- profiles ----------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  role        text not null default 'user'
                check (role in ('user', 'expert', 'admin')),
  credits_remaining  integer not null default 0
                check (credits_remaining >= 0),
  subscription_plan  text not null default 'free'
                check (subscription_plan in ('free', 'starter', 'pro')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- brands ----------
create table public.brands (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null unique,
  slug            text not null unique,
  category        text not null
                    check (category in ('sneakers', 'bag', 'watch', 'clothing')),
  logo_url        text,
  photo_protocol  jsonb not null default '[]'::jsonb,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ---------- models ----------
create table public.models (
  id                      uuid primary key default uuid_generate_v4(),
  brand_id                uuid not null references public.brands(id) on delete cascade,
  name                    text not null,
  slug                    text not null,
  authentication_points   jsonb not null default '[]'::jsonb,
  min_photos              integer not null default 8,
  max_photos              integer not null default 12,
  is_active               boolean not null default true,
  created_at              timestamptz not null default now(),
  unique (brand_id, slug)
);

-- ---------- analyses ----------
create table public.analyses (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  brand_id        uuid not null references public.brands(id),
  model_id        uuid not null references public.models(id),
  category        text not null
                    check (category in ('sneakers', 'bag', 'watch', 'clothing')),
  status          text not null default 'pending'
                    check (status in (
                      'pending', 'uploading', 'analyzing',
                      'completed', 'expert_review', 'failed'
                    )),
  overall_score   integer check (overall_score between 0 and 100),
  confidence      text check (confidence in ('high', 'medium', 'low')),
  verdict         text check (verdict in (
                      'likely_authentic', 'likely_fake', 'inconclusive'
                    )),
  sub_scores      jsonb,       -- { "stitching": 85, "materials": 92, … }
  findings        jsonb,       -- [{ "zone": "…", "observation": "…", "score": 80 }, …]
  ai_raw_response jsonb,
  expert_id       uuid references auth.users(id),
  expert_notes    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- analysis_photos ----------
create table public.analysis_photos (
  id            uuid primary key default uuid_generate_v4(),
  analysis_id   uuid not null references public.analyses(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  storage_path  text not null,     -- {user_id}/{analysis_id}/{photo_type}.jpg
  photo_type    text not null,     -- sole_bottom, tag_label, stitching, overall_front …
  order_index   integer not null default 0,
  quality_check jsonb,             -- { "width": 1200, "height": 900, "passed": true }
  created_at    timestamptz not null default now()
);

-- ---------- credits_transactions ----------
create table public.credits_transactions (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  type              text not null
                      check (type in ('purchase', 'usage', 'refund', 'bonus')),
  amount            integer not null,          -- positif = crédit, négatif = débit
  balance_after     integer not null,
  description       text,
  analysis_id       uuid references public.analyses(id) on delete set null,
  stripe_payment_id text,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- 2. INDEX
-- ============================================================

create index idx_analyses_user_id   on public.analyses(user_id);
create index idx_analyses_status    on public.analyses(status);
create index idx_analyses_brand_id  on public.analyses(brand_id);
create index idx_analyses_created   on public.analyses(created_at desc);

create index idx_analysis_photos_analysis_id on public.analysis_photos(analysis_id);
create index idx_analysis_photos_user_id     on public.analysis_photos(user_id);

create index idx_credits_tx_user_id on public.credits_transactions(user_id);
create index idx_credits_tx_created on public.credits_transactions(created_at desc);

create index idx_models_brand_id on public.models(brand_id);

-- ============================================================
-- 3. TRIGGERS — updated_at automatique
-- ============================================================

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function moddatetime(updated_at);

create trigger set_analyses_updated_at
  before update on public.analyses
  for each row execute function moddatetime(updated_at);

-- ============================================================
-- 4. TRIGGER — création auto du profil à l'inscription
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles             enable row level security;
alter table public.brands               enable row level security;
alter table public.models               enable row level security;
alter table public.analyses             enable row level security;
alter table public.analysis_photos      enable row level security;
alter table public.credits_transactions enable row level security;

-- Helper : récupère le rôle du user courant
create or replace function public.current_user_role()
returns text
language sql
stable
security definer set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------- profiles ----------

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.current_user_role() = 'admin');

-- ---------- brands (lecture publique) ----------

create policy "Anyone can view active brands"
  on public.brands for select
  using (is_active = true);

create policy "Admins can manage brands"
  on public.brands for all
  using (public.current_user_role() = 'admin');

-- ---------- models (lecture publique) ----------

create policy "Anyone can view active models"
  on public.models for select
  using (is_active = true);

create policy "Admins can manage models"
  on public.models for all
  using (public.current_user_role() = 'admin');

-- ---------- analyses ----------

create policy "Users can view their own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Experts can view analyses in expert_review"
  on public.analyses for select
  using (
    public.current_user_role() = 'expert'
    and status = 'expert_review'
  );

create policy "Experts can update analyses in expert_review"
  on public.analyses for update
  using (
    public.current_user_role() = 'expert'
    and status = 'expert_review'
  );

create policy "Admins can do anything on analyses"
  on public.analyses for all
  using (public.current_user_role() = 'admin');

-- ---------- analysis_photos ----------

create policy "Users can view their own photos"
  on public.analysis_photos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own photos"
  on public.analysis_photos for insert
  with check (auth.uid() = user_id);

create policy "Experts can view photos of analyses in expert_review"
  on public.analysis_photos for select
  using (
    public.current_user_role() = 'expert'
    and analysis_id in (
      select id from public.analyses where status = 'expert_review'
    )
  );

create policy "Admins can do anything on photos"
  on public.analysis_photos for all
  using (public.current_user_role() = 'admin');

-- ---------- credits_transactions ----------

create policy "Users can view their own transactions"
  on public.credits_transactions for select
  using (auth.uid() = user_id);

create policy "Admins can view all transactions"
  on public.credits_transactions for select
  using (public.current_user_role() = 'admin');

-- ============================================================
-- 6. DONNÉES INITIALES — Marques
-- ============================================================

insert into public.brands (name, slug, category, photo_protocol) values
  ('Nike', 'nike', 'sneakers', '[
    {"name": "overall_front", "label": "Vue de face", "required": true},
    {"name": "overall_back", "label": "Vue arrière", "required": true},
    {"name": "sole_bottom", "label": "Semelle (dessous)", "required": true},
    {"name": "sole_side", "label": "Semelle (côté)", "required": true},
    {"name": "tag_label", "label": "Étiquette intérieure", "required": true},
    {"name": "tag_size", "label": "Étiquette taille", "required": true},
    {"name": "box_label", "label": "Étiquette boîte", "required": false},
    {"name": "stitching", "label": "Coutures (gros plan)", "required": true},
    {"name": "logo_detail", "label": "Logo (gros plan)", "required": true},
    {"name": "insole", "label": "Semelle intérieure", "required": true}
  ]'::jsonb),
  ('Jordan', 'jordan', 'sneakers', '[
    {"name": "overall_front", "label": "Vue de face", "required": true},
    {"name": "overall_back", "label": "Vue arrière", "required": true},
    {"name": "sole_bottom", "label": "Semelle (dessous)", "required": true},
    {"name": "sole_side", "label": "Semelle (côté)", "required": true},
    {"name": "tag_label", "label": "Étiquette intérieure", "required": true},
    {"name": "tag_size", "label": "Étiquette taille", "required": true},
    {"name": "box_label", "label": "Étiquette boîte", "required": false},
    {"name": "stitching", "label": "Coutures (gros plan)", "required": true},
    {"name": "jumpman_logo", "label": "Logo Jumpman (gros plan)", "required": true},
    {"name": "wings_logo", "label": "Logo Wings (si applicable)", "required": false},
    {"name": "insole", "label": "Semelle intérieure", "required": true}
  ]'::jsonb),
  ('adidas', 'adidas', 'sneakers', '[
    {"name": "overall_front", "label": "Vue de face", "required": true},
    {"name": "overall_back", "label": "Vue arrière", "required": true},
    {"name": "sole_bottom", "label": "Semelle (dessous)", "required": true},
    {"name": "sole_side", "label": "Semelle (côté)", "required": true},
    {"name": "tag_label", "label": "Étiquette intérieure", "required": true},
    {"name": "tag_size", "label": "Étiquette taille / QR code", "required": true},
    {"name": "box_label", "label": "Étiquette boîte", "required": false},
    {"name": "boost_detail", "label": "Boost / semelle (gros plan)", "required": true},
    {"name": "three_stripes", "label": "3 bandes (gros plan)", "required": true},
    {"name": "insole", "label": "Semelle intérieure", "required": true}
  ]'::jsonb),
  ('New Balance', 'new-balance', 'sneakers', '[
    {"name": "overall_front", "label": "Vue de face", "required": true},
    {"name": "overall_back", "label": "Vue arrière", "required": true},
    {"name": "sole_bottom", "label": "Semelle (dessous)", "required": true},
    {"name": "tag_label", "label": "Étiquette intérieure", "required": true},
    {"name": "tag_size", "label": "Étiquette taille", "required": true},
    {"name": "n_logo", "label": "Logo N (gros plan)", "required": true},
    {"name": "stitching", "label": "Coutures (gros plan)", "required": true},
    {"name": "insole", "label": "Semelle intérieure", "required": true}
  ]'::jsonb),
  ('Louis Vuitton', 'louis-vuitton', 'bag', '[
    {"name": "overall_front", "label": "Vue de face", "required": true},
    {"name": "overall_back", "label": "Vue arrière", "required": true},
    {"name": "overall_side", "label": "Vue de côté", "required": true},
    {"name": "overall_bottom", "label": "Vue du dessous", "required": true},
    {"name": "monogram_detail", "label": "Monogramme (gros plan)", "required": true},
    {"name": "stitching", "label": "Coutures (gros plan)", "required": true},
    {"name": "hardware", "label": "Quincaillerie / fermetures", "required": true},
    {"name": "date_code", "label": "Code date / puce RFID", "required": true},
    {"name": "interior", "label": "Intérieur du sac", "required": true},
    {"name": "zipper", "label": "Fermeture éclair (gros plan)", "required": true},
    {"name": "stamping", "label": "Marquage / estampille", "required": true}
  ]'::jsonb);

-- ============================================================
-- 7. DONNÉES INITIALES — Modèles populaires
-- ============================================================

-- Nike
insert into public.models (brand_id, name, slug, authentication_points, min_photos, max_photos) values
  ((select id from public.brands where slug = 'nike'), 'Dunk Low', 'dunk-low', '[
    {"zone": "swoosh", "label": "Forme et placement du Swoosh", "weight": 0.20},
    {"zone": "stitching", "label": "Régularité des coutures", "weight": 0.15},
    {"zone": "toe_box", "label": "Forme de la toe box", "weight": 0.15},
    {"zone": "heel_tab", "label": "Embossage talon", "weight": 0.10},
    {"zone": "tongue_tag", "label": "Étiquette de langue", "weight": 0.10},
    {"zone": "insole_print", "label": "Impression semelle intérieure", "weight": 0.10},
    {"zone": "sole_pattern", "label": "Motif de la semelle", "weight": 0.10},
    {"zone": "materials", "label": "Qualité des matériaux", "weight": 0.10}
  ]'::jsonb, 8, 10),
  ((select id from public.brands where slug = 'nike'), 'Air Force 1', 'air-force-1', '[
    {"zone": "swoosh", "label": "Forme et placement du Swoosh", "weight": 0.20},
    {"zone": "stitching", "label": "Régularité des coutures", "weight": 0.15},
    {"zone": "toe_box", "label": "Perforations toe box", "weight": 0.15},
    {"zone": "sole_unit", "label": "Unité de semelle Air", "weight": 0.10},
    {"zone": "heel_stamp", "label": "Marquage talon", "weight": 0.10},
    {"zone": "tongue_tag", "label": "Étiquette de langue", "weight": 0.10},
    {"zone": "insole_print", "label": "Impression semelle intérieure", "weight": 0.10},
    {"zone": "materials", "label": "Qualité des matériaux", "weight": 0.10}
  ]'::jsonb, 8, 10);

-- Jordan
insert into public.models (brand_id, name, slug, authentication_points, min_photos, max_photos) values
  ((select id from public.brands where slug = 'jordan'), 'Air Jordan 1 High', 'air-jordan-1-high', '[
    {"zone": "swoosh", "label": "Forme et placement du Swoosh", "weight": 0.15},
    {"zone": "wings_logo", "label": "Logo Wings (position, taille, profondeur)", "weight": 0.15},
    {"zone": "stitching", "label": "Régularité des coutures", "weight": 0.15},
    {"zone": "toe_box", "label": "Forme et perforations toe box", "weight": 0.10},
    {"zone": "hourglass_shape", "label": "Forme sablier (vue arrière)", "weight": 0.10},
    {"zone": "collar", "label": "Forme du col", "weight": 0.10},
    {"zone": "tongue_tag", "label": "Étiquette de langue Nike Air", "weight": 0.10},
    {"zone": "insole_print", "label": "Impression semelle intérieure", "weight": 0.05},
    {"zone": "materials", "label": "Qualité des matériaux / cuir", "weight": 0.10}
  ]'::jsonb, 10, 12),
  ((select id from public.brands where slug = 'jordan'), 'Air Jordan 4', 'air-jordan-4', '[
    {"zone": "netting", "label": "Filet latéral (forme et texture)", "weight": 0.15},
    {"zone": "jumpman_logo", "label": "Logo Jumpman (langue)", "weight": 0.15},
    {"zone": "heel_tab", "label": "Tab talon (pull tab)", "weight": 0.10},
    {"zone": "stitching", "label": "Régularité des coutures", "weight": 0.15},
    {"zone": "toe_box", "label": "Forme toe box / cage", "weight": 0.10},
    {"zone": "midsole", "label": "Forme de la midsole", "weight": 0.10},
    {"zone": "tongue_tag", "label": "Étiquette de langue", "weight": 0.10},
    {"zone": "materials", "label": "Qualité des matériaux", "weight": 0.15}
  ]'::jsonb, 10, 12);

-- adidas
insert into public.models (brand_id, name, slug, authentication_points, min_photos, max_photos) values
  ((select id from public.brands where slug = 'adidas'), 'Yeezy Boost 350 V2', 'yeezy-boost-350-v2', '[
    {"zone": "boost_sole", "label": "Granularité du Boost", "weight": 0.20},
    {"zone": "primeknit", "label": "Motif Primeknit", "weight": 0.15},
    {"zone": "heel_tab", "label": "Pull tab (si applicable)", "weight": 0.10},
    {"zone": "side_stripe", "label": "Bande latérale SPLY-350", "weight": 0.15},
    {"zone": "insole", "label": "Semelle intérieure (logo, taille)", "weight": 0.10},
    {"zone": "tag_label", "label": "Étiquette intérieure + QR", "weight": 0.15},
    {"zone": "shape_profile", "label": "Profil général de la chaussure", "weight": 0.10},
    {"zone": "box_label", "label": "Étiquette boîte (code barre, SKU)", "weight": 0.05}
  ]'::jsonb, 8, 10),
  ((select id from public.brands where slug = 'adidas'), 'Yeezy Slide', 'yeezy-slide', '[
    {"zone": "sole_texture", "label": "Texture de la semelle", "weight": 0.20},
    {"zone": "shape_profile", "label": "Profil et proportions", "weight": 0.20},
    {"zone": "material_finish", "label": "Finition du matériau", "weight": 0.20},
    {"zone": "size_stamp", "label": "Marquage taille (intérieur)", "weight": 0.15},
    {"zone": "tag_label", "label": "Étiquette intérieure", "weight": 0.15},
    {"zone": "box_label", "label": "Étiquette boîte", "weight": 0.10}
  ]'::jsonb, 6, 8);

-- New Balance
insert into public.models (brand_id, name, slug, authentication_points, min_photos, max_photos) values
  ((select id from public.brands where slug = 'new-balance'), '550', 'nb-550', '[
    {"zone": "n_logo", "label": "Logo N (forme, couture, placement)", "weight": 0.20},
    {"zone": "stitching", "label": "Régularité des coutures", "weight": 0.15},
    {"zone": "toe_box", "label": "Forme de la toe box", "weight": 0.10},
    {"zone": "tongue_tag", "label": "Étiquette de langue NB", "weight": 0.15},
    {"zone": "heel_stamp", "label": "Marquage talon", "weight": 0.10},
    {"zone": "insole_print", "label": "Semelle intérieure", "weight": 0.10},
    {"zone": "sole_pattern", "label": "Motif semelle extérieure", "weight": 0.10},
    {"zone": "materials", "label": "Qualité des matériaux / cuir", "weight": 0.10}
  ]'::jsonb, 8, 10);

-- Louis Vuitton
insert into public.models (brand_id, name, slug, authentication_points, min_photos, max_photos) values
  ((select id from public.brands where slug = 'louis-vuitton'), 'Neverfull MM', 'neverfull-mm', '[
    {"zone": "monogram_alignment", "label": "Alignement du monogramme LV", "weight": 0.20},
    {"zone": "stitching", "label": "Coutures (régularité, couleur moutarde)", "weight": 0.15},
    {"zone": "date_code", "label": "Code date / puce RFID", "weight": 0.15},
    {"zone": "hardware", "label": "Quincaillerie (couleur, gravure)", "weight": 0.10},
    {"zone": "canvas_texture", "label": "Texture du canvas", "weight": 0.10},
    {"zone": "interior_lining", "label": "Doublure intérieure", "weight": 0.10},
    {"zone": "handle_stitching", "label": "Coutures des anses", "weight": 0.10},
    {"zone": "stamping", "label": "Estampille \"Louis Vuitton Paris\"", "weight": 0.10}
  ]'::jsonb, 10, 12),
  ((select id from public.brands where slug = 'louis-vuitton'), 'Speedy 25', 'speedy-25', '[
    {"zone": "monogram_alignment", "label": "Alignement du monogramme LV", "weight": 0.20},
    {"zone": "stitching", "label": "Coutures (régularité, couleur)", "weight": 0.15},
    {"zone": "date_code", "label": "Code date / puce RFID", "weight": 0.15},
    {"zone": "hardware", "label": "Quincaillerie / cadenas", "weight": 0.10},
    {"zone": "zipper", "label": "Fermeture éclair (YKK / Lampo)", "weight": 0.10},
    {"zone": "canvas_texture", "label": "Texture du canvas", "weight": 0.10},
    {"zone": "handle_patina", "label": "Patine des anses (vachetta)", "weight": 0.10},
    {"zone": "stamping", "label": "Estampille intérieure", "weight": 0.10}
  ]'::jsonb, 10, 12);
