import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/src/context/auth/useAuthContext';
import { useAssessmentResult } from '@/src/pages/assessment/context/hooks/use-assessment-result';
import { postSend } from '@/src/pages/assessment/api/requests/postSend/Request';

export const SaveResults = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { result, transformToFlattenedFormat } = useAssessmentResult();
  const [isSaving, setIsSaving] = useState(false);

  // Function to handle saving assessment results
  const handleSaveResults = async () => {
    setIsSaving(true);

    // Add null check for result before transforming
    if (!result) {
      toast.error('Assessment data is not available.');
      setIsSaving(false);
      return;
    }

    try {
      // Create assessment data object using the flattened format from the hook
      const assessmentPayload = transformToFlattenedFormat();

      if (!assessmentPayload) {
        toast.error('Failed to process assessment data.');
        setIsSaving(false);
        return;
      }

      // Ensure all required fields have values
      const finalPayload = {
        ...assessmentPayload,
        user_id: user?.id || '',
        // Ensure all required fields have default values
        age: assessmentPayload.age || 'unknown',
        pattern: assessmentPayload.pattern || 'unknown',
        cycle_length: assessmentPayload.cycle_length || 'unknown',
        period_duration: assessmentPayload.period_duration || 'unknown',
        flow_heaviness: assessmentPayload.flow_heaviness || 'unknown',
        pain_level: assessmentPayload.pain_level || 'unknown',
        physical_symptoms: assessmentPayload.physical_symptoms || [],
        emotional_symptoms: assessmentPayload.emotional_symptoms || [],
        recommendations: assessmentPayload.recommendations || []
      };

      if (!finalPayload.user_id) {
        toast.error('User not found. Please login again.');
        setIsSaving(false);
        return;
      }

      // Add required fields for the API
      const apiPayload = {
        ...finalPayload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Send to API
      const savedAssessment = await postSend(apiPayload);

      toast.success('Assessment saved successfully!');
      navigate(`/assessment/history/${savedAssessment.id}`);
    } catch (error) {
      console.error('Failed to save assessment:', error);
      toast.error('Failed to save assessment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      className="flex items-center justify-center gap-2 border border-pink-200 bg-white px-6 py-6 text-lg text-pink-600 hover:bg-pink-50"
      onClick={handleSaveResults}
      disabled={isSaving}
    >
      <Save className="h-5 w-5 hover:text-pink-700" />
      {isSaving ? 'Saving...' : 'Save Results'}
    </Button>
  );
};
