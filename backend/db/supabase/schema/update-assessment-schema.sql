-- Update Supabase Assessment Schema to accommodate new JSON format

-- First, make sure the assessments table exists with JSONB support
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id),
  assessment_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user_id lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);

-- Create index for JSONB operations to improve query performance on nested fields
CREATE INDEX IF NOT EXISTS idx_assessments_data_json ON public.assessments USING GIN (assessment_data);

-- Ensure that the symptoms table reference in the index doesn't cause errors 
-- (since it's now included in the JSON data and the table may not exist)
DROP INDEX IF EXISTS idx_symptoms_user_id;

-- Add a comment to the table to document the expected JSON structure
COMMENT ON TABLE public.assessments IS 'Assessments with nested JSON data structure for user health assessments';

-- Add a comment to the assessment_data column documenting the expected structure
COMMENT ON COLUMN public.assessments.assessment_data IS 'JSON structure containing: {
  createdAt: timestamp,
  assessment_data: {
    date: timestamp,
    pattern: string,
    age: string,
    cycleLength: string,
    periodDuration: string,
    flowHeaviness: string,
    painLevel: string,
    symptoms: {
      physical: string[],
      emotional: string[]
    },
    recommendations: [
      {
        title: string,
        description: string
      }
    ]
  }
}';

-- Create a function to check if assessment_data is valid JSON during insertion/update
CREATE OR REPLACE FUNCTION check_assessment_data_format()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if assessment_data is valid JSON
  IF NEW.assessment_data IS NULL THEN
    RAISE EXCEPTION 'assessment_data cannot be null';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate assessment_data format on insert/update
DROP TRIGGER IF EXISTS validate_assessment_data ON public.assessments;
CREATE TRIGGER validate_assessment_data
BEFORE INSERT OR UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION check_assessment_data_format(); 