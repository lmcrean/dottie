'use client';

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';
import postSend from '@/src/pages/assessment/steps/9-save/post-id/Request';
import PageTransition from '../../animations/page-transitions';

export default function SaveAssessmentPage() {
  const navigate = useNavigate();
  const { state } = useAssessmentContext();
  const hasSaved = useRef(false);

  useEffect(() => {
    const saveAssessment = async () => {
      // Prevent duplicate saves
      if (hasSaved.current) {
        return;
      }

      if (!state.result) {
        console.warn('SaveAssessmentPage: Missing assessment data, redirecting.');
        navigate('/assessment/age');
        return;
      }

      // Mark as saving to prevent duplicate attempts
      hasSaved.current = true;

      try {
        const savedAssessment = await postSend(state.result);

        // Navigate to the details page with the new assessment ID
        navigate(`/assessment/results/${savedAssessment.id}`);
      } catch (error) {
        console.error('Failed to save assessment:', error);
        // Reset the flag on error so user can retry if needed
        hasSaved.current = false;
        // Even on error, redirect to results page using context data
        // Consider if navigating to results without a saved ID is desired on error,
        // or if an error page/toast is more appropriate.
        // For now, keeping previous behavior of attempting to show results with context data.
        navigate('/assessment/results?new=true');
      }
    };

    // Start the save process immediately
    saveAssessment();
  }, []); // Remove dependencies to only run once on mount

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <svg
              className="h-12 w-12 animate-spin text-pink-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-semibold dark:text-white">Saving your assessment...</h2>
          <p className="text-center text-gray-600">
            {"You're almost done! Let's save your assessment results."}
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
