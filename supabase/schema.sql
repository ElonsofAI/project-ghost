-- ============================================================
-- PROJECT GHOST — Multi-Tenant Schema
-- Run this in your Supabase SQL editor
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- CLIENTS (one row per Shopify store)
-- ------------------------------------------------------------
create table if not exists clients (
  id          uuid        primary key default gen_random_uuid(),
  owner_id    uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  shop_domain text        unique not null,
  api_key     text        unique not null default encode(gen_random_bytes(24), 'hex'),
  status      text        not null default 'active',
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- EVENTS (every telemetry event from ghost-listener.js)
-- ------------------------------------------------------------
create table if not exists events (
  id         uuid        primary key default gen_random_uuid(),
  client_id  uuid        not null references clients(id) on delete cascade,
  session_id text,
  event      text        not null,
  url        text,
  data       jsonb       not null default '{}',
  ts         bigint,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SESSIONS
-- ------------------------------------------------------------
create table if not exists sessions (
  id           text        not null,
  client_id    uuid        not null references clients(id) on delete cascade,
  referrer     text,
  landing_page text,
  converted    boolean     not null default false,
  started_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (id, client_id)
);

-- ------------------------------------------------------------
-- EXPERIMENTS (A/B tests — scaffold for Phase 3)
-- ------------------------------------------------------------
create table if not exists experiments (
  id          uuid        primary key default gen_random_uuid(),
  client_id   uuid        not null references clients(id) on delete cascade,
  name        text        not null,
  hypothesis  text,
  status      text        not null default 'draft',
  variants    jsonb       not null default '[]',
  metric      text        not null default 'conversion_rate',
  started_at  timestamptz,
  ended_at    timestamptz,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table clients     enable row level security;
alter table events      enable row level security;
alter table sessions    enable row level security;
alter table experiments enable row level security;

-- Clients: owner only
create policy "clients: owner access" on clients
  for all using (auth.uid() = owner_id);

-- Events: owner reads via client relationship
create policy "events: owner read" on events
  for select using (
    exists (
      select 1 from clients
      where clients.id = events.client_id
        and clients.owner_id = auth.uid()
    )
  );

-- Sessions: owner reads
create policy "sessions: owner read" on sessions
  for select using (
    exists (
      select 1 from clients
      where clients.id = sessions.client_id
        and clients.owner_id = auth.uid()
    )
  );

-- Experiments: owner full access
create policy "experiments: owner access" on experiments
  for all using (
    exists (
      select 1 from clients
      where clients.id = experiments.client_id
        and clients.owner_id = auth.uid()
    )
  );

-- NOTE: Telemetry ingest uses the service role key (bypasses RLS)

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
create index if not exists events_client_id_idx  on events(client_id);
create index if not exists events_event_idx       on events(event);
create index if not exists events_created_at_idx  on events(created_at desc);
create index if not exists sessions_client_id_idx on sessions(client_id);
