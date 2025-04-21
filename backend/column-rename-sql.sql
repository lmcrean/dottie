-- Check if the assessments table exists
DO $$
BEGIN
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
        user_id UUID NOT NULL REFERENCES public.users(id),
        "assessmentData" JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Copy data from old table to new table
      INSERT INTO assessments_new(id, user_id, "assessmentData", created_at, updated_at)
      SELECT id, user_id, assessment_data, created_at, updated_at FROM assessments;
      
      -- Drop old table and rename new one
      DROP TABLE assessments;
      ALTER TABLE assessments_new RENAME TO assessments;
      
      -- Recreate indexes
      CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
      CREATE INDEX idx_assessments_data_json ON public.assessments USING GIN ("assessmentData");
      
      -- Create the validator function
      CREATE OR REPLACE FUNCTION check_assessmentData_format()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Check if assessmentData is valid JSON
        IF NEW."assessmentData" IS NULL THEN
          RAISE EXCEPTION 'assessmentData cannot be null';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
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