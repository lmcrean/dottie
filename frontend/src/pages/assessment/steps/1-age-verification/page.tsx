'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import PageTransition from '../../animations/page-transitions';
import { useAgeVerification } from '@/src/pages/assessment/steps/1-age-verification/hooks/use-age-verification';
import { AgeRange } from '@/src/pages/assessment/steps/context/types';
import ContinueButton from '../components/ContinueButton';
import BackButton from '../components/BackButton';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';

export default function AgeVerificationPage() {
  const { age, setAge } = useAgeVerification();
  const location = useLocation();
  const navigate = useNavigate();
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  // Local state to ensure UI updates immediately
  const [selectedAge, setSelectedAge] = useState<AgeRange | undefined>(age);

  // Keep local state in sync with context
  useEffect(() => {
    if (age) {
      setSelectedAge(age);
    } else {
      // If context is empty, try to load from sessionStorage as a fallback
      const storedAge = sessionStorage.getItem('age');
      if (storedAge) {
        const typedAge = storedAge as AgeRange;
        setSelectedAge(typedAge);
        // Also update context from sessionStorage but don't include in dependency array
        setAge(typedAge);
      }
    }
    // Only depend on age, not setAge to prevent infinite loops
  }, [age]);

  const handleOptionClick = (value: AgeRange) => {
    // Update local state first for immediate UI feedback
    setSelectedAge(value);

    // Update context - this is the primary data store
    setAge(value);

    // Also save to sessionStorage as backup/persistence
    sessionStorage.setItem('age', value);

    // Focus the continue button for better accessibility
    setTimeout(() => {
      if (continueButtonRef.current) {
        continueButtonRef.current.focus();
      }
    }, 100);
  };

  const handleContinue = () => {
    if (selectedAge) {
      const queryParams = location.search.includes('mode=quickresponse')
        ? '?mode=quickresponse'
        : '';
      // Make sure we're using the most recent selectedAge value
      // Force navigation to the next page
      navigate(`/assessment/cycle-length${queryParams}`, { replace: false });
    }
  };

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && selectedAge) {
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedAge]);

  // useEffect for Quick Complete functionality
  useEffect(() => {
    if (isQuickResponse) {
      const defaultAgeOption: AgeRange = '18-24'; // Default selection for quick complete

      // Call handleOptionClick to select the age and update state/context
      handleOptionClick(defaultAgeOption);

      // Simulate click on the continue button after a short delay
      // This ensures that selectedAge is set and the continue button is enabled
      setTimeout(() => {
        if (continueButtonRef.current) {
          // Check if selectedAge is indeed set to the default, otherwise log an error
          // This is a defensive check, handleOptionClick should set it.
          if (selectedAge === defaultAgeOption || age === defaultAgeOption) {
            // Check local state or context
            continueButtonRef.current.click();
          } else {
            // Fallback if state update isn't immediate enough for the continue button's enabled state logic
            // or if there's a more complex state interaction.
            // Forcing handleContinue might be an option if the button isn't becoming clickable.
            // However, handleOptionClick should make selectedAge truthy.
            // A more robust way would be to ensure handleContinue is called directly after state is set.
            // Re-check selectedAge from closure after timeout, or re-fetch if necessary.
            // For now, assume handleOptionClick sets selectedAge synchronously enough.
            // The ContinueButton itself is enabled based on selectedAge.
            // Let's trust that handleOptionClick updates selectedAge and the ContinueButton becomes enabled.
            handleContinue(); // Directly call handleContinue as a more robust way if button click is tricky
          }
        }
      }, 50); // Adjust delay if necessary
    }
    // Dependencies: isQuickResponse is the trigger.
    // handleOptionClick and handleContinue are component methods; if they were unstable,
    // they'd need useCallback or to be part of deps. Assuming they are stable enough here or
    // their instability doesn't affect this useEffect's core logic which is only run when isQuickResponse changes to true.
  }, [isQuickResponse]); // Only re-run if isQuickResponse changes.

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6">
          <div className="mb-8 h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 w-[16%] rounded-full bg-pink-500 transition-all duration-500"></div>
          </div>

          <div className="mb-8 flex flex-col gap-8 lg:flex-row">
            <div className="items-top flex justify-center text-center lg:w-1/2 lg:justify-start lg:text-left">
              <div className="flex flex-col gap-3">
                <h1 className="mb-2 text-xl font-bold dark:text-slate-100">Question 1 of 6</h1>
                <h2 className="mb-1 text-3xl font-semibold dark:text-slate-100">
                  What is your age range?
                </h2>
                <p className="text-gray-600 dark:text-slate-200">
                  This helps us provide age-appropriate information and recommendations.
                </p>
                <img
                  src="/assessmentAssets/age.svg"
                  alt=""
                  className="contrast-125 filter transition duration-300 hover:scale-105"
                />
              </div>
              <div></div>
            </div>
            <Card className="w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 lg:w-1/2">
              <CardContent className="pb-8 pt-8">
                <div className="space-y-4">
                  {/* Under 13 option */}
                  <button
                    type="button"
                    className={`flex w-full items-center space-x-3 rounded-xl border p-4 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedAge === 'under-13'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('under-13')}
                    data-testid="option-under-13"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedAge === 'under-13' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label htmlFor="under-13" className="flex-1 cursor-pointer">
                      <div className="text-lg font-medium">Under 13 years</div>
                      <p className="text-sm text-gray-500">Parental guidance recommended</p>
                    </Label>
                  </button>

                  {/* 13-17 option */}
                  <button
                    type="button"
                    className={`flex w-full items-center space-x-3 rounded-xl border p-4 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedAge === '13-17'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('13-17')}
                    data-testid="option-13-17"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedAge === '13-17' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label htmlFor="13-17" className="flex-1 cursor-pointer">
                      <div className="text-lg font-medium">13-17 years</div>
                      <p className="text-sm text-gray-500">Teen-appropriate content</p>
                    </Label>
                  </button>

                  {/* 18-24 option */}
                  <button
                    type="button"
                    className={`flex w-full items-center space-x-3 rounded-xl border p-4 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedAge === '18-24'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('18-24')}
                    data-testid="option-18-24"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedAge === '18-24' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label htmlFor="18-24" className="flex-1 cursor-pointer">
                      <div className="text-lg font-medium">18-24 years</div>
                      <p className="text-sm text-gray-500">Young adult content</p>
                    </Label>
                  </button>

                  {/* 25+ option */}
                  <button
                    type="button"
                    className={`flex w-full items-center space-x-3 rounded-xl border p-4 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedAge === '25-plus'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('25-plus')}
                    data-testid="option-25-plus"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedAge === '25-plus' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label htmlFor="25-plus" className="flex-1 cursor-pointer">
                      <div className="text-lg font-medium">25+ years</div>
                      <p className="text-sm text-gray-500">Adult content</p>
                    </Label>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-auto flex w-full justify-between">
            <BackButton destination="/" dataTestId="back-button" />

            <ContinueButton
              ref={continueButtonRef}
              isEnabled={!!selectedAge}
              onContinue={handleContinue}
              dataTestId="continue-button"
            />
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
