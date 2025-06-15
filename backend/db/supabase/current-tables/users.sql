create table public.users (
  id uuid not null default gen_random_uuid (),
  username text null,
  email text null,
  password_hash text null,
  age character varying(50) null,
  reset_token text null,
  reset_token_expires timestamp without time zone null,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  deleted_at timestamp with time zone null,
  profile_data jsonb null,
  bio text null,
  profile_image text null,
  display_name text null,
  preferences jsonb null,
  constraint users_pkey primary key (id)
) TABLESPACE pg_default;

create unique INDEX IF not exists users_email_unique_non_test on public.users using btree (email) TABLESPACE pg_default
where
  (email !~~ 'prod.test.%@testmail.com'::text);

create trigger handle_user_update_trigger BEFORE
update on users for EACH row
execute FUNCTION update_updated_at_column ();