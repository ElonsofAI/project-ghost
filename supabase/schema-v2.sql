-- ============================================================
-- PROJECT GHOST — Schema v2 (run after schema.sql)
-- ============================================================

-- Integrations (API credentials per client per platform)
create table if not exists integrations (
  id          uuid        primary key default gen_random_uuid(),
  client_id   uuid        not null references clients(id) on delete cascade,
  platform    text        not null, -- shopify, meta, google, klaviyo, tiktok, ghl
  credentials jsonb       not null default '{}', -- encrypt in production
  created_at  timestamptz not null default now(),
  unique (client_id, platform)
);

-- Daily metrics (aggregated per client per day)
create table if not exists daily_metrics (
  id              uuid        primary key default gen_random_uuid(),
  client_id       uuid        not null references clients(id) on delete cascade,
  date            date        not null,
  net_sales       numeric     default 0,
  gross_sales     numeric     default 0,
  total_orders    int         default 0,
  aov             numeric     default 0,
  refunds         numeric     default 0,
  discounts       numeric     default 0,
  shipping        numeric     default 0,
  fb_spend        numeric     default 0,
  google_spend    numeric     default 0,
  tiktok_spend    numeric     default 0,
  total_ad_spend  numeric     default 0,
  roas            numeric     default 0,
  mer             numeric     default 0,
  cogs            numeric     default 0,
  cm3             numeric     default 0,
  daily_profit    numeric     default 0,
  email_revenue   numeric     default 0,
  sms_revenue     numeric     default 0,
  created_at      timestamptz not null default now(),
  unique (client_id, date)
);

-- Audit findings (AI-generated per run)
create table if not exists audit_findings (
  id              uuid        primary key default gen_random_uuid(),
  client_id       uuid        not null references clients(id) on delete cascade,
  rank            int         not null,
  title           text        not null,
  channel         text,
  category        text,
  impact          text        not null, -- critical, high, medium, low
  revenue_at_risk text,
  description     text,
  actions         jsonb       default '[]',
  created_at      timestamptz not null default now()
);

-- RLS
alter table integrations   enable row level security;
alter table daily_metrics  enable row level security;
alter table audit_findings enable row level security;

-- Integrations: owner via client
create policy "integrations: owner access" on integrations
  for all using (
    exists (select 1 from clients where clients.id = integrations.client_id and clients.owner_id = auth.uid())
  );

-- Daily metrics: owner reads
create policy "daily_metrics: owner read" on daily_metrics
  for select using (
    exists (select 1 from clients where clients.id = daily_metrics.client_id and clients.owner_id = auth.uid())
  );

-- Audit findings: owner reads
create policy "audit_findings: owner read" on audit_findings
  for select using (
    exists (select 1 from clients where clients.id = audit_findings.client_id and clients.owner_id = auth.uid())
  );

-- Indexes
create index if not exists daily_metrics_client_date_idx  on daily_metrics(client_id, date desc);
create index if not exists audit_findings_client_idx       on audit_findings(client_id, created_at desc);
create index if not exists integrations_client_idx         on integrations(client_id);
