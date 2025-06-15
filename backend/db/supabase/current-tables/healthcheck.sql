create table public.healthcheck (
  id bigint generated always as identity not null,
  checked_at timestamp with time zone null default CURRENT_TIMESTAMP,
  constraint healthcheck_pkey primary key (id)
) TABLESPACE pg_default;