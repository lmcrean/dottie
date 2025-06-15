create table public.chat_messages (
  id uuid not null default gen_random_uuid (),
  conversation_id uuid not null,
  role text not null,
  content text not null,
  parent_message_id uuid null,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  edited_at timestamp with time zone null,
  deleted_at timestamp with time zone null,
  constraint chat_messages_pkey primary key (id),
  constraint chat_messages_conversation_fkey foreign KEY (conversation_id) references conversations (id) on delete CASCADE,
  constraint chat_messages_parent_fkey foreign KEY (parent_message_id) references chat_messages (id) on delete set null,
  constraint chat_messages_role_check check (
    (
      role = any (
        array['user'::text, 'assistant'::text, 'system'::text]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_chat_messages_conversation_id on public.chat_messages using btree (conversation_id) TABLESPACE pg_default;

create index IF not exists idx_chat_messages_created_at on public.chat_messages using btree (created_at) TABLESPACE pg_default;

create trigger update_chat_messages_updated_at BEFORE
update on chat_messages for EACH row
execute FUNCTION update_updated_at_column ();