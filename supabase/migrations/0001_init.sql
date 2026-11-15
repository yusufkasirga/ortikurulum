-- Orti — initial schema (Supabase / Postgres).
-- Every table has RLS on. Identity documents and selfies are NEVER stored: only the verification outcome.

create extension if not exists "pgcrypto";

-- ---------- campuses & profiles ----------
create table public.campuses (
  id text primary key,                 -- 'eru', 'agu', ...
  name text not null,
  city text not null,
  email_domain text,                   -- 'erciyes.edu.tr'
  active boolean not null default false,
  modules text[] not null default '{}' -- enabled module ids for this campus
);

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  campus_id text references public.campuses,
  department text,
  year smallint check (year between 1 and 7),
  student_verified boolean not null default false,
  id_verified boolean not null default false,
  gender text check (gender in ('kadin','erkek')),         -- only set by the KYC webhook
  trust_score smallint not null default 80 check (trust_score between 0 and 100),
  visibility text not null default 'kampus' check (visibility in ('herkes','kampus','ekip')),
  location_precision text not null default 'yaklasik' check (location_precision in ('tam','yaklasik','kapali')),
  push_token text,
  role text not null default 'user' check (role in ('user','moderator','venue_owner','club_admin','admin')),
  created_at timestamptz not null default now()
);

-- ---------- venues ----------
create table public.venues (
  id text primary key,
  name text not null,
  category text not null check (category in ('okey','playstation','bilardo','kafe','halisaha','bowling')),
  campus_id text references public.campuses,
  lat double precision not null,
  lng double precision not null,
  google_place_id text,                -- store only the id; fetch rating/hours live
  smoking text not null default 'bilinmiyor' check (smoking in ('kapali-serbest','acik-alan','dumansiz','bilinmiyor')),
  hookah boolean,
  owner_id uuid references public.profiles,
  partner boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.venue_prices (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues on delete cascade,
  label text not null, value text not null,
  source text not null check (source in ('isletme','yorum')),
  updated_at timestamptz not null default now()
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues on delete cascade,
  offer text not null, detail text,
  starts_at timestamptz not null default now(), ends_at timestamptz,
  is_ad boolean not null default true  -- always labelled "Reklam" in the UI
);

create table public.venue_corrections (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues on delete cascade,
  reporter_id uuid not null references public.profiles,
  field text not null, proposed text not null,
  status text not null default 'beklemede' check (status in ('beklemede','onaylandi','reddedildi')),
  created_at timestamptz not null default now()
);

-- ---------- tables (masalar) ----------
create table public.game_tables (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles,
  venue_id text references public.venues,
  game text not null,
  total smallint not null check (total between 2 and 30),
  starts_at timestamptz not null,
  audience text not null check (audience in ('karma','kadin','erkek')),
  join_mode text not null default 'approve' check (join_mode in ('approve','instant')),
  min_trust smallint not null default 0,
  note text,
  status text not null default 'acik' check (status in ('acik','dolu','bitti','iptal')),
  created_at timestamptz not null default now()
);

create table public.table_members (
  table_id uuid references public.game_tables on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  state text not null default 'istek' check (state in ('istek','onay','red','ayrildi')),
  checked_in_at timestamptz,
  primary key (table_id, user_id)
);

create table public.messages (
  id bigint generated always as identity primary key,
  table_id uuid not null references public.game_tables on delete cascade,
  user_id uuid references public.profiles on delete set null,
  body text not null check (length(body) <= 1000),
  kind text not null default 'user' check (kind in ('user','system')),
  created_at timestamptz not null default now()
);

create table public.ratings (
  table_id uuid references public.game_tables on delete cascade,
  rater_id uuid references public.profiles on delete cascade,
  ratee_id uuid references public.profiles on delete cascade,
  stars smallint not null check (stars between 1 and 5),
  tags text[] not null default '{}',
  play_again boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (table_id, rater_id, ratee_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles,
  target_user uuid references public.profiles,
  target_note uuid,
  table_id uuid references public.game_tables,
  reason text not null check (reason in ('noshow','rude','cheat','harass','fake','copyright','other')),
  detail text,
  priority smallint not null default 2, -- 1 = urgent (harass)
  status text not null default 'acik' check (status in ('acik','inceleniyor','kapandi')),
  action text,
  created_at timestamptz not null default now()
);

create table public.blocks (
  blocker_id uuid references public.profiles on delete cascade,
  blocked_id uuid references public.profiles on delete cascade,
  primary key (blocker_id, blocked_id)
);

-- ---------- campus content ----------
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles on delete cascade,
  campus_id text references public.campuses,
  course_code text not null, course_name text not null,
  title text not null, kind text not null, pages smallint not null,
  storage_path text not null,
  removed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  campus_id text references public.campuses,
  club text not null, title text not null, kind text not null,
  place text not null, starts_at timestamptz not null,
  created_by uuid references public.profiles,
  created_at timestamptz not null default now()
);

create table public.event_rsvps (
  event_id uuid references public.events on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  wants_buddy boolean not null default false,
  primary key (event_id, user_id)
);

-- ---------- product analytics & crash logs (no PII in props) ----------
create table public.app_events (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles on delete set null,
  name text not null, props jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create table public.app_errors (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles on delete set null,
  message text not null, stack text, screen text,
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table public.campuses enable row level security;
alter table public.profiles enable row level security;
alter table public.venues enable row level security;
alter table public.venue_prices enable row level security;
alter table public.promotions enable row level security;
alter table public.venue_corrections enable row level security;
alter table public.game_tables enable row level security;
alter table public.table_members enable row level security;
alter table public.messages enable row level security;
alter table public.ratings enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.notes enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.app_events enable row level security;
alter table public.app_errors enable row level security;

create or replace function public.my_role() returns text language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;
create or replace function public.my_gender() returns text language sql stable security definer set search_path = public as
$$ select case when id_verified then gender end from public.profiles where id = auth.uid() $$;

-- public reference data
create policy "campuses readable" on public.campuses for select using (true);
create policy "venues readable" on public.venues for select using (true);
create policy "prices readable" on public.venue_prices for select using (true);
create policy "promos readable" on public.promotions for select using (true);
create policy "owner edits prices" on public.venue_prices for all
  using (exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid()))
  with check (exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid()));
create policy "owner edits promos" on public.promotions for all
  using (exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid()))
  with check (exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid()));

-- profiles: read basics of others, edit only yourself (verification fields are set by service role)
create policy "profiles readable" on public.profiles for select using (auth.role() = 'authenticated');
create policy "edit own profile" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid())
              and id_verified = (select id_verified from public.profiles where id = auth.uid())
              and gender is not distinct from (select gender from public.profiles where id = auth.uid()));
create policy "insert own profile" on public.profiles for insert with check (id = auth.uid() and role = 'user' and not id_verified);

-- tables: gender-restricted tables are only visible to verified members of that gender
create policy "tables visible" on public.game_tables for select using (
  audience = 'karma' or audience = public.my_gender() or host_id = auth.uid());
create policy "host creates" on public.game_tables for insert with check (
  host_id = auth.uid() and (audience = 'karma' or audience = public.my_gender()));
create policy "host edits" on public.game_tables for update using (host_id = auth.uid());

create policy "members visible to table" on public.table_members for select using (
  user_id = auth.uid() or exists (select 1 from public.game_tables t where t.id = table_id and t.host_id = auth.uid())
  or exists (select 1 from public.table_members m where m.table_id = table_members.table_id and m.user_id = auth.uid() and m.state = 'onay'));
create policy "request to join" on public.table_members for insert with check (user_id = auth.uid() and state = 'istek');
create policy "host decides / user leaves" on public.table_members for update using (
  user_id = auth.uid() or exists (select 1 from public.game_tables t where t.id = table_id and t.host_id = auth.uid()));

create policy "chat members read" on public.messages for select using (
  exists (select 1 from public.table_members m where m.table_id = messages.table_id and m.user_id = auth.uid() and m.state = 'onay')
  or exists (select 1 from public.game_tables t where t.id = messages.table_id and t.host_id = auth.uid()));
create policy "chat members write" on public.messages for insert with check (
  user_id = auth.uid() and kind = 'user' and (
  exists (select 1 from public.table_members m where m.table_id = messages.table_id and m.user_id = auth.uid() and m.state = 'onay')
  or exists (select 1 from public.game_tables t where t.id = messages.table_id and t.host_id = auth.uid())));

-- blind ratings: you only see ratings about you once both sides rated or 48h passed
create policy "rate checked-in tablemates" on public.ratings for insert with check (
  rater_id = auth.uid() and exists (select 1 from public.table_members m where m.table_id = ratings.table_id and m.user_id = auth.uid() and m.checked_in_at is not null));
create policy "see own given ratings" on public.ratings for select using (rater_id = auth.uid());
create policy "see received after reveal" on public.ratings for select using (
  ratee_id = auth.uid() and (created_at < now() - interval '48 hours'
  or exists (select 1 from public.ratings r2 where r2.table_id = ratings.table_id and r2.rater_id = auth.uid() and r2.ratee_id = ratings.rater_id)));

create policy "file report" on public.reports for insert with check (reporter_id = auth.uid());
create policy "see own reports" on public.reports for select using (reporter_id = auth.uid() or public.my_role() in ('moderator','admin'));
create policy "moderate reports" on public.reports for update using (public.my_role() in ('moderator','admin'));

create policy "manage own blocks" on public.blocks for all using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

create policy "notes readable" on public.notes for select using (not removed and auth.role() = 'authenticated');
create policy "author writes notes" on public.notes for insert with check (author_id = auth.uid());
create policy "author or mod updates notes" on public.notes for update using (author_id = auth.uid() or public.my_role() in ('moderator','admin'));

create policy "events readable" on public.events for select using (true);
create policy "club admins create events" on public.events for insert with check (created_by = auth.uid() and public.my_role() in ('club_admin','admin'));
create policy "rsvp own" on public.event_rsvps for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "rsvp counts readable" on public.event_rsvps for select using (auth.role() = 'authenticated');

create policy "suggest corrections" on public.venue_corrections for insert with check (reporter_id = auth.uid());
create policy "mods review corrections" on public.venue_corrections for all using (public.my_role() in ('moderator','admin'));

create policy "log own events" on public.app_events for insert with check (user_id is null or user_id = auth.uid());
create policy "log own errors" on public.app_errors for insert with check (user_id is null or user_id = auth.uid());

-- realtime chat
alter publication supabase_realtime add table public.messages;

-- ---------- account deletion (App Store requirement, KVKK) ----------
create or replace function public.delete_my_account() returns void language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();  -- cascades to profiles and owned rows
end $$;
revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;

-- ---------- seed ----------
insert into public.campuses (id, name, city, email_domain, active, modules) values
 ('eru','Erciyes Üniversitesi','Kayseri','erciyes.edu.tr', true,
  array['eslesme','harita','masaac','ekipler','lig','halisaha','firsatlar','sohbet','program','kutuphane','etkinlik','notlar','guvenlik']),
 ('agu','Abdullah Gül Üniversitesi','Kayseri','agu.edu.tr', false, array['eslesme','harita','masaac']),
 ('kayseri','Kayseri Üniversitesi','Kayseri','kayseri.edu.tr', false, array['eslesme','harita','masaac']),
 ('nny','Nuh Naci Yazgan Üniversitesi','Kayseri','nny.edu.tr', false, array['eslesme','harita','masaac']);
