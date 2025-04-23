-- Check if the assessments table exists
DO $$
BEGIN
  -- Make sure UUID extension is available
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'assessments'
  ) THEN
    -- Check if assessment_data column exists and assessmentData doesn't
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'assessments' 
      AND column_name = 'assessment_data'
    ) THEN
      -- Create temporary table with new schema
      CREATE TABLE assessments_new (
        id UUID PRIMARY KEY,
        userId UUID NOT NULL REFERENCES public.users(id),
        "assessmentData" JSONB NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Copy data from old table to new table with new UUIDs for all records
      INSERT INTO assessments_new(id, userId, "assessmentData", createdAt, updatedAt)
      SELECT 
        uuid_generate_v4(), -- Generate new UUID for all records
        userId, 
        assessment_data, 
        createdAt, 
        updatedAt 
      FROM assessments;
      
      -- Drop old table and rename new one
      DROP TABLE assessments;
      ALTER TABLE assessments_new RENAME TO assessments;
      
      -- Recreate indexes
      CREATE INDEX idx_assessments_userId ON public.assessments(userId);
      CREATE INDEX idx_assessments_data_json ON public.assessments USING GIN ("assessmentData");
      
      -- Create the validator function
      CREATE OR REPLACE FUNCTION check_assessmentData_format()
      RETURNS TRIGGER AS $func$
      BEGIN
        -- Check if assessmentData is valid JSON
        IF NEW."assessmentData" IS NULL THEN
          RAISE EXCEPTION 'assessmentData cannot be null';
        END IF;
        RETURN NEW;
      END;
      $func$ LANGUAGE plpgsql;
      
      -- Create the trigger
      DROP TRIGGER IF EXISTS validate_assessmentData ON public.assessments;
      CREATE TRIGGER validate_assessmentData
      BEFORE INSERT OR UPDATE ON public.assessments
      FOR EACH ROW
      EXECUTE FUNCTION check_assessmentData_format();
      
      RAISE NOTICE 'Successfully migrated assessment_data to assessmentData';
    ELSE
      RAISE NOTICE 'Either assessmentData column already exists or assessment_data does not exist';
    END IF;
  ELSE
    RAISE NOTICE 'Assessments table does not exist';
  END IF;
END
$$; 