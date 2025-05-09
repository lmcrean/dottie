'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/!to-migrate/button';
import { Card, CardContent } from '@/src/components/ui/!to-migrate/card';
import { Label } from '@/src/components/ui/!to-migrate/label';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import PageTransition from '../../page-transitions';
import { useAgeVerification } from '@/src/hooks/assessment/steps/use-age-verification';
import { AgeRange } from '@/src/context/assessment/types';

export default function AgeVerificationPage() {
  const { age, setAge } = useAgeVerification();
  const location = useLocation();
  const navigate = useNavigate();

  // Local state to ensure UI updates immediately
  const [selectedAge, setSelectedAge] = useState<AgeRange | undefined>(age);

  // Keep local state in sync with context
  useEffect(() => {
    if (age) {
      setSelectedAge(age);
    }
  }, [age]);

  const handleOptionClick = (value: AgeRange) => {
    // Update both local state and context
    setSelectedAge(value);
    setAge(value);
    sessionStorage.setItem('age', value);
  };

  const handleContinue = () => {
    if (selectedAge) {
      const queryParams = location.search.includes('mode=quickresponse')
        ? '?mode=quickresponse'
        : '';
      navigate(`/assessment/cycle-length${queryParams}`);
    }
  };

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
            <Link to="/">
              <Button
                variant="outline"
                className="flex items-center px-6 py-6 text-lg dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            </Link>

            <Button
              className={`flex items-center px-6 py-6 text-lg ${
                selectedAge
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
              disabled={!selectedAge}
              data-testid="continue-button"
              onClick={handleContinue}
            >
              Continue
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
