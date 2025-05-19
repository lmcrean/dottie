'use client';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerateRecommendations } from './hooks/useGenerateRecommendations';
import PageTransition from '../../animations/page-transitions';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';

export default function GenerateRecommendationsPage() {
  const navigate = useNavigate();
  const { state } = useAssessmentContext();
  useGenerateRecommendations(); // This hook will calculate and update recommendations in context

  useEffect(() => {
    // Ensure recommendations have a chance to be generated
    if (
      state.result &&
      state.result.pattern &&
      state.result.recommendations &&
      state.result.recommendations.length > 0
    ) {
      console.log('Recommendations generated, navigating to save page.');
      navigate('/assessment/save');
    } else if (!state.result || !state.result.pattern) {
      // Handle case where data/pattern might not be loaded yet, or redirect if accessed directly
      console.warn(
        'GenerateRecommendationsPage: Assessment data or pattern not found, redirecting to calculate pattern.'
      );
      navigate('/assessment/calculate-pattern');
    }
    // If recommendations are not yet set, the useGenerateRecommendations hook's useEffect will trigger an update,
    // which will then cause this useEffect to re-run and navigate.
  }, [state.result, state.result?.pattern, state.result?.recommendations, navigate]);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-semibold dark:text-slate-100">
            Generating recommendations...
          </h1>
          <p className="text-gray-600 dark:text-slate-300">Please wait a moment.</p>
          {/* Optional: Add a spinner or loading animation here */}
        </main>
      </div>
    </PageTransition>
  );
}
