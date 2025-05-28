-- ================================================================
-- Conversation-Assessment Integration Schema Updates
-- ================================================================
-- This script updates the database schema to support the recent
-- conversation-assessment integration functionality.

-- ================================================================
-- 1. UPDATE CONVERSATIONS TABLE FOR ASSESSMENT INTEGRATION
-- ================================================================

DO $$
BEGIN
    -- Check if conversations table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'conversations'
    ) THEN
        RAISE NOTICE 'Conversations table exists. Checking for required columns...';
        
        -- Add assessment_id column (foreign key to assessments table)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'conversations' 
            AND column_name = 'assessment_id'
        ) THEN
            ALTER TABLE public.conversations ADD COLUMN assessment_id UUID NULL;
            RAISE NOTICE 'Added assessment_id column to conversations table.';
        ELSE
            RAISE NOTICE 'assessment_id column already exists in conversations table.';
        END IF;
        
        -- Add assessment_pattern column (stores pattern reference)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'conversations' 
            AND column_name = 'assessment_pattern'
        ) THEN
            ALTER TABLE public.conversations ADD COLUMN assessment_pattern TEXT NULL;
            RAISE NOTICE 'Added assessment_pattern column to conversations table.';
        ELSE
            RAISE NOTICE 'assessment_pattern column already exists in conversations table.';
        END IF;
        
        -- Add assessment_object column (stores complete assessment data as JSONB)
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'conversations' 
            AND column_name = 'assessment_object'
        ) THEN
            ALTER TABLE public.conversations ADD COLUMN assessment_object JSONB NULL;
            RAISE NOTICE 'Added assessment_object column to conversations table.';
        ELSE
            RAISE NOTICE 'assessment_object column already exists in conversations table.';
        END IF;
        
        -- Add preview column for conversation previews
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'conversations' 
            AND column_name = 'preview'
        ) THEN
            ALTER TABLE public.conversations ADD COLUMN preview TEXT NULL;
            RAISE NOTICE 'Added preview column to conversations table.';
        ELSE
            RAISE NOTICE 'preview column already exists in conversations table.';
        END IF;
        
        -- Add deleted_at column for soft deletes
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'conversations' 
            AND column_name = 'deleted_at'
        ) THEN
            ALTER TABLE public.conversations ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE NULL;
            RAISE NOTICE 'Added deleted_at column to conversations table.';
        ELSE
            RAISE NOTICE 'deleted_at column already exists in conversations table.';
        END IF;
        
    ELSE
        -- Create conversations table with all required fields
        CREATE TABLE public.conversations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
            assessment_id UUID NULL REFERENCES public.assessments(id) ON DELETE SET NULL,
            assessment_pattern TEXT NULL,
            assessment_object JSONB NULL,
            preview TEXT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP WITH TIME ZONE NULL
        );
        RAISE NOTICE 'Created new conversations table with assessment integration.';
    END IF;
END
$$;

-- ================================================================
-- 2. UPDATE CHAT_MESSAGES TABLE
-- ================================================================

DO $$
BEGIN
    -- Check if chat_messages table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'chat_messages'
    ) THEN
        RAISE NOTICE 'Chat_messages table exists. Checking for required columns...';
        
        -- Add parent_message_id column for message threading
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'chat_messages' 
            AND column_name = 'parent_message_id'
        ) THEN
            ALTER TABLE public.chat_messages ADD COLUMN parent_message_id UUID NULL;
            RAISE NOTICE 'Added parent_message_id column to chat_messages table.';
        ELSE
            RAISE NOTICE 'parent_message_id column already exists in chat_messages table.';
        END IF;
        
        -- Add updated_at column
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'chat_messages' 
            AND column_name = 'updated_at'
        ) THEN
            ALTER TABLE public.chat_messages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
            RAISE NOTICE 'Added updated_at column to chat_messages table.';
        ELSE
            RAISE NOTICE 'updated_at column already exists in chat_messages table.';
        END IF;
        
        -- Add edited_at column for message editing
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'chat_messages' 
            AND column_name = 'edited_at'
        ) THEN
            ALTER TABLE public.chat_messages ADD COLUMN edited_at TIMESTAMP WITH TIME ZONE NULL;
            RAISE NOTICE 'Added edited_at column to chat_messages table.';
        ELSE
            RAISE NOTICE 'edited_at column already exists in chat_messages table.';
        END IF;
        
        -- Add deleted_at column for soft deletes
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'chat_messages' 
            AND column_name = 'deleted_at'
        ) THEN
            ALTER TABLE public.chat_messages ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE NULL;
            RAISE NOTICE 'Added deleted_at column to chat_messages table.';
        ELSE
            RAISE NOTICE 'deleted_at column already exists in chat_messages table.';
        END IF;
        
    ELSE
        -- Create chat_messages table with all required fields
        CREATE TABLE public.chat_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            parent_message_id UUID NULL REFERENCES public.chat_messages(id) ON DELETE SET NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            edited_at TIMESTAMP WITH TIME ZONE NULL,
            deleted_at TIMESTAMP WITH TIME ZONE NULL,
            CONSTRAINT chat_messages_role_check CHECK (
                role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text])
            )
        );
        RAISE NOTICE 'Created new chat_messages table with parent message support.';
    END IF;
END
$$;

-- ================================================================
-- 3. ADD FOREIGN KEY CONSTRAINTS (IF NOT EXISTS)
-- ================================================================

DO $$
BEGIN
    -- Add foreign key from conversations.assessment_id to assessments.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'conversations_assessment_fkey'
        AND table_name = 'conversations'
    ) THEN
        ALTER TABLE public.conversations 
        ADD CONSTRAINT conversations_assessment_fkey 
        FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added foreign key constraint conversations_assessment_fkey.';
    ELSE
        RAISE NOTICE 'Foreign key constraint conversations_assessment_fkey already exists.';
    END IF;
    
    -- Add foreign key from chat_messages.parent_message_id to chat_messages.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'chat_messages_parent_fkey'
        AND table_name = 'chat_messages'
    ) THEN
        ALTER TABLE public.chat_messages 
        ADD CONSTRAINT chat_messages_parent_fkey 
        FOREIGN KEY (parent_message_id) REFERENCES public.chat_messages(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added foreign key constraint chat_messages_parent_fkey.';
    ELSE
        RAISE NOTICE 'Foreign key constraint chat_messages_parent_fkey already exists.';
    END IF;
END
$$;

-- ================================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ================================================================

-- Index for conversations by assessment_id
CREATE INDEX IF NOT EXISTS idx_conversations_assessment_id 
ON public.conversations USING btree (assessment_id) 
WHERE assessment_id IS NOT NULL;

-- Index for conversations by created_at
CREATE INDEX IF NOT EXISTS idx_conversations_created_at 
ON public.conversations USING btree (created_at);

-- Index for chat_messages by conversation_id and created_at
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_created 
ON public.chat_messages USING btree (conversation_id, created_at);

-- Index for chat_messages by parent_message_id
CREATE INDEX IF NOT EXISTS idx_chat_messages_parent_id 
ON public.chat_messages USING btree (parent_message_id) 
WHERE parent_message_id IS NOT NULL;

-- ================================================================
-- 5. CREATE TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ================================================================

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for conversations table
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON public.conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for chat_messages table
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON public.chat_messages;
CREATE TRIGGER update_chat_messages_updated_at 
    BEFORE UPDATE ON public.chat_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- 6. DISPLAY UPDATED SCHEMA
-- ================================================================

-- Show conversations table schema
SELECT 
    'conversations' AS table_name,
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'conversations'
ORDER BY ordinal_position;

-- Show chat_messages table schema
SELECT 
    'chat_messages' AS table_name,
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'chat_messages'
ORDER BY ordinal_position;

-- Show all indexes on conversations and chat_messages tables
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('conversations', 'chat_messages')
ORDER BY tablename, indexname; 