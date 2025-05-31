create table public.debug_logs (
  id serial not null,
  timestamp timestamp with time zone null default now(),
  operation text null,
  payload jsonb null,
  error text null,
  constraint debug_logs_pkey primary key (id)
) TABLESPACE pg_default;