# Supabase Database Setup Guide

## Problem Diagnosis
The 500 error on user signup occurs because the required database tables don't exist in your Supabase project.

## Solution - Create Database Tables

Follow these steps to create the necessary tables in your Supabase project:

1. Go to your Supabase Dashboard: https://app.supabase.com/
2. Select your project
3. Navigate to the "SQL Editor" in the left sidebar
4. Create a new query and paste the following SQL:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  age INTEGER,
  reset_token TEXT,
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Periods tracking table
CREATE TABLE IF NOT EXISTS public.period_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id),
  start_date DATE NOT NULL,
  end_date DATE,
  flow_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assessment results table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id),
  assessment_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_period_logs_user_id ON public.period_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_user_id ON public.symptoms(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
```

5. Click "Run" to execute the SQL and create all the tables

## Verify Setup

After creating the tables, you can verify they exist:

1. Go to the "Table Editor" in the Supabase Dashboard
2. You should see all the tables listed: users, period_logs, symptoms, conversations, chat_messages, and assessments

## Security (Optional)

For production, you might want to set up Row Level Security (RLS) policies:

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Basic policies example (customize as needed)
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can manage their own data" ON public.users
  FOR ALL USING (auth.uid() = id);
```

## After Setup

Once you've created the tables, try the signup functionality again in your application. It should now work correctly.

If you encounter any issues:
1. Check the backend logs for specific error messages
2. Verify the database connection is working
3. Ensure all required tables are created properly 