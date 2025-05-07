'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/src/components/ui/!to-migrate/button';
import { Card, CardContent } from '@/src/components/ui/!to-migrate/card';
import { Label } from '@/src/components/ui/!to-migrate/label';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/!to-migrate/radio-group';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';
import PageTransition from '../../page-transitions';

export default function AgeVerificationPage() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [refTarget, setRefTarget] = useState('');
  const location = useLocation();
  const radioRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (!isQuickResponse) return;

    const options = ['under-13', '13-17', '18-24', '25-plus'];
    const random = options[Math.floor(Math.random() * options.length)];
    setRefTarget(random);

    setTimeout(() => {
      if (radioRef.current) {
        radioRef.current.click();
      }
    }, 100);

    setTimeout(() => {
      if (continueButtonRef.current) {
        continueButtonRef.current.click();
      }
    }, 100);
  }, [isQuickResponse]);

  const handleAgeChange = (value: string) => {
    setSelectedAge(value);
    sessionStorage.setItem('age', value);
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
                <RadioGroup value={selectedAge || ''} onValueChange={handleAgeChange}>
                  <div className="space-y-4">
                    <div
                      className={`flex items-center space-x-3 rounded-xl border p-4 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedAge === 'under-13'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="under-13"
                        id="under-13"
                        className="text-pink-600"
                        ref={refTarget === 'under-13' ? radioRef : null}
                      />
                      <Label htmlFor="under-13" className="flex-1 cursor-pointer">
                        <div className="text-lg font-medium">Under 13 years</div>
                        <p className="text-sm text-gray-500">Parental guidance recommended</p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 rounded-xl border p-4 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedAge === '13-17'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="13-17"
                        id="13-17"
                        className="text-pink-600"
                        ref={refTarget === '13-17' ? radioRef : null}
                      />
                      <Label htmlFor="13-17" className="flex-1 cursor-pointer">
                        <div className="text-lg font-medium">13-17 years</div>
                        <p className="text-sm text-gray-500">Teen-appropriate content</p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 rounded-xl border p-4 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedAge === '18-24'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="18-24"
                        id="18-24"
                        className="text-pink-600"
                        ref={refTarget === '18-24' ? radioRef : null}
                      />
                      <Label htmlFor="18-24" className="flex-1 cursor-pointer">
                        <div className="text-lg font-medium">18-24 years</div>
                        <p className="text-sm text-gray-500">Young adult content</p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 rounded-xl border p-4 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedAge === '25-plus'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="25-plus"
                        id="25-plus"
                        className="text-pink-600"
                        ref={refTarget === '25-plus' ? radioRef : null}
                      />
                      <Label htmlFor="25-plus" className="flex-1 cursor-pointer">
                        <div className="text-lg font-medium">25+ years</div>
                        <p className="text-sm text-gray-500">Adult content</p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
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

            <Link
              to={
                selectedAge
                  ? `/assessment/cycle-length${
                      location.search.includes('mode=quickresponse') ? '?mode=quickresponse' : ''
                    }`
                  : '#'
              }
            >
              <Button
                className={`flex items-center px-6 py-6 text-lg ${
                  selectedAge
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'cursor-not-allowed bg-gray-300 text-gray-500'
                }`}
                ref={continueButtonRef}
                disabled={!selectedAge}
              >
                Continue
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
