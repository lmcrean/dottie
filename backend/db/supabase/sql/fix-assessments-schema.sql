-- First, check if the assessments table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'assessments'
    ) THEN
        -- Check if age column already exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'assessments' 
            AND column_name = 'age'
        ) THEN
            -- Add age column
            ALTER TABLE public.assessments ADD COLUMN age TEXT;
            RAISE NOTICE 'Added age column to assessments table.';
        ELSE
            RAISE NOTICE 'age column already exists in assessments table.';
        END IF;
    ELSE
        -- Create assessments table with all required fields
        CREATE TABLE public.assessments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            age TEXT,
            pattern TEXT,
            cycle_length TEXT,
            period_duration TEXT,
            flow_heaviness TEXT,
            pain_level TEXT,
            physical_symptoms TEXT,
            emotional_symptoms TEXT,
            recommendations TEXT,
            assessment_data JSONB
        );
        RAISE NOTICE 'Created new assessments table with all required columns.';
    END IF;
END
$$;

-- Make sure other required columns exist too
DO $$
BEGIN
    -- Check and add other columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'assessments' AND column_name = 'cycle_length') THEN
        ALTER TABLE public.assessments ADD COLUMN cycle_length TEXT;
        RAISE NOTICE 'Added cycle_length column.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'assessments' AND column_name = 'period_duration') THEN
        ALTER TABLE public.assessments ADD COLUMN period_duration TEXT;
        RAISE NOTICE 'Added period_duration column.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'assessments' AND column_name = 'flow_heaviness') THEN
        ALTER TABLE public.assessments ADD COLUMN flow_heaviness TEXT;
        RAISE NOTICE 'Added flow_heaviness column.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'assessments' AND column_name = 'pain_level') THEN
        ALTER TABLE public.assessments ADD COLUMN pain_level TEXT;
        RAISE NOTICE 'Added pain_level column.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'assessments' AND column_name = 'physical_symptoms') THEN
        ALTER TABLE public.assessments ADD COLUMN physical_symptoms TEXT;
        RAISE NOTICE 'Added physical_symptoms column.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'assessments' AND column_name = 'emotional_symptoms') THEN
        ALTER TABLE public.assessments ADD COLUMN emotional_symptoms TEXT;
        RAISE NOTICE 'Added emotional_symptoms column.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'assessments' AND column_name = 'assessment_data') THEN
        ALTER TABLE public.assessments ADD COLUMN assessment_data JSONB;
        RAISE NOTICE 'Added assessment_data column.';
    END IF;
END
$$;

-- Display current schema after changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'assessments'
ORDER BY ordinal_position; 