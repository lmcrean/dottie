import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/src/context/auth/useAuthContext';
import { useAssessmentResult } from '@/src/pages/assessment/hooks/use-assessment-result';
import { Assessment } from '@/src/api/assessment/types';
import { postSend } from '@/src/api/assessment/requests/postSend/Request';

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
      const assessmentPayload = transformToFlattenedFormat(result); // Now result is guaranteed non-null

      // Ensure user_id is included (assuming user context provides it)
      const finalPayload: Omit<Assessment, 'id' | 'created_at' | 'updated_at'> & {
        user_id: string;
      } = {
        ...assessmentPayload,
        user_id: user?.id || '' // Corrected key: userId -> user_id. Get user ID from auth context
      };

      if (!finalPayload.user_id) {
        toast.error('User not found. Please login again.');
        setIsSaving(false);
        return;
      }

      // Type assertion might be needed if postSend expects slightly different structure
      // For now, assume postSend accepts this payload
      const savedAssessment = await postSend(finalPayload as Omit<Assessment, 'id'>);

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
