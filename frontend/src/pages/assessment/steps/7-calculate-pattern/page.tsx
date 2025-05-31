'use client';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeterminedPattern } from './hooks/useDeterminedPattern';
import PageTransition from '../../animations/page-transitions';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';

export default function CalculatePatternPage() {
  const navigate = useNavigate();
  const { state } = useAssessmentContext(); // Get state to ensure data is loaded
  useDeterminedPattern(); // This hook will calculate and update the pattern in context

  useEffect(() => {
    // Ensure result and pattern calculation have a chance to run
    if (state.result && state.result.pattern) {
      navigate('/assessment/generate-recommendations');
    } else if (state.result === null) {
      // Handle case where data might not be loaded yet, or redirect if accessed directly
      navigate('/assessment/age'); // Or a more appropriate starting page
    }
    // If pattern is not yet set, the useDeterminedPattern hook's useEffect will trigger an update,
    // which will then cause this useEffect to re-run and navigate.
  }, [state.result, state.result?.pattern, navigate]);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-semibold dark:text-slate-100">
            Calculating your pattern...
          </h1>
          <p className="text-gray-600 dark:text-slate-300">Please wait a moment.</p>
          {/* Optional: Add a spinner or loading animation here */}
        </main>
      </div>
    </PageTransition>
  );
}
