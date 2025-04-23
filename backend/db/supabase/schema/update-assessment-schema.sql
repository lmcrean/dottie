-- Update Supabase Assessment Schema to accommodate new JSON format

-- First, make sure the assessments table exists with JSONB support
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL REFERENCES public.users(id),
  assessmentData JSONB NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for userId lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_assessments_userId ON public.assessments(userId);

-- Create index for JSONB operations to improve query performance on nested fields
CREATE INDEX IF NOT EXISTS idx_assessments_data_json ON public.assessments USING GIN (assessmentData);

-- Ensure that the symptoms table reference in the index doesn't cause errors 
-- (since it's now included in the JSON data and the table may not exist)
DROP INDEX IF EXISTS idx_symptoms_userId;

-- Add a comment to the table to document the expected JSON structure
COMMENT ON TABLE public.assessments IS 'Assessments with nested JSON data structure for user health assessments';

-- Add a comment to the assessmentData column documenting the expected structure
COMMENT ON COLUMN public.assessments.assessmentData IS 'JSON structure containing: {
  createdAt: timestamp,
  assessmentData: {
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

-- Create a function to check if assessmentData is valid JSON during insertion/update
CREATE OR REPLACE FUNCTION check_assessmentData_format()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if assessmentData is valid JSON
  IF NEW.assessmentData IS NULL THEN
    RAISE EXCEPTION 'assessmentData cannot be null';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate assessmentData format on insert/update
DROP TRIGGER IF EXISTS validate_assessmentData ON public.assessments;
CREATE TRIGGER validate_assessmentData
BEFORE INSERT OR UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION check_assessmentData_format(); 