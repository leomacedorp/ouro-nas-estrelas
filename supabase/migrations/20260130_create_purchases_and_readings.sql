-- Create Stripe purchase records + premium readings delivery

create table if not exists stripe_purchases (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  customer_email text,
  payment_status text,
  amount_total integer,
  currency text,
  raw jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_stripe_purchases_email on stripe_purchases (customer_email);

create table if not exists premium_readings (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  sign_slug text not null,
  date_key text not null, -- YYYY-MM-DD
  content jsonb not null,
  access_token uuid not null,
  customer_email text,
  created_at timestamptz not null default now(),
  unique (session_id, sign_slug, date_key)
);

create index if not exists idx_premium_readings_session on premium_readings (session_id);
create index if not exists idx_premium_readings_email on premium_readings (customer_email);
