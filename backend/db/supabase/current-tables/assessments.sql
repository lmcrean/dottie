create table public.assessments (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  assessment_data jsonb null,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  deleted_at timestamp with time zone null,
  age character varying(50) null,
  pattern character varying(50) null,
  cycle_length character varying(50) null,
  period_duration character varying(50) null,
  flow_heaviness character varying(50) null,
  pain_level character varying(50) null,
  physical_symptoms jsonb null,
  emotional_symptoms jsonb null,
  recommendations jsonb null,
  other_symptoms text null default ''::text,
  constraint assessments_pkey primary key (id),
  constraint assessments_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_assessments_user_id on public.assessments using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_assessments_created_at on public.assessments using btree (created_at) TABLESPACE pg_default;

create trigger update_assessments_updated_at BEFORE
update on assessments for EACH row
execute FUNCTION update_updated_at_column ();