create table public.conversations (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  assessment_id uuid null,
  assessment_pattern text null,
  preview text null,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  deleted_at timestamp with time zone null,
  constraint conversations_pkey primary key (id),
  constraint conversations_assessment_fkey foreign KEY (assessment_id) references assessments (id) on delete set null,
  constraint conversations_user_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_conversations_user_id on public.conversations using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_conversations_assessment_id on public.conversations using btree (assessment_id) TABLESPACE pg_default;

create index IF not exists idx_conversations_created_at on public.conversations using btree (created_at) TABLESPACE pg_default;

create trigger update_conversations_updated_at BEFORE
update on conversations for EACH row
execute FUNCTION update_updated_at_column ();