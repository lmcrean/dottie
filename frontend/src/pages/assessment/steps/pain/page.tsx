'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/src/components/ui/!to-migrate/button';
import { Card, CardContent } from '@/src/components/ui/!to-migrate/card';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/!to-migrate/radio-group';
import { Label } from '@/src/components/ui/!to-migrate/label';
import { ChevronRight, ChevronLeft, InfoIcon } from 'lucide-react';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';
import PageTransition from '../../page-transitions';
import { usePainLevel } from '@/src/hooks/assessment/steps/use-pain-level';
import { PainLevel } from '@/src/context/assessment/types';

export default function PainPage() {
  const { painLevel, setPainLevel } = usePainLevel();
  const [refTarget, setRefTarget] = useState('');
  const location = useLocation();
  const radioRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = ['no-pain', 'mild', 'moderate', 'severe', 'debilitating', 'varies'];
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

  const handlePainChange = (value: string) => {
    setPainLevel(value as PainLevel);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">83% Complete</div>
          </div>

          <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 w-[83%] rounded-full bg-pink-500"></div>
          </div>

          <div className="mb-8 flex flex-col gap-8 lg:flex-row">
            <div className="items-top flex justify-center text-center lg:w-1/2 lg:justify-start lg:text-left">
              <div className="flex flex-col gap-3">
                <h1 className="mb-2 text-xl font-bold dark:text-slate-100">Question 5 of 6</h1>
                <h2 className="mb-1 text-3xl font-semibold dark:text-slate-100">
                  How would you rate your menstrual pain?
                </h2>
                <p className="mb-6 text-sm text-gray-500 dark:text-slate-200">
                  Select the option that best describes your typical pain level during your period
                </p>
                <img
                  src="/assessmentAssets/pain.svg"
                  alt=""
                  className="contrast-125 filter transition duration-300 hover:scale-105"
                />
              </div>
            </div>

            <Card className="w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 lg:w-1/2">
              <CardContent className="pb-8 pt-8">
                <RadioGroup
                  value={painLevel || ''}
                  onValueChange={handlePainChange}
                  className="mb-6"
                >
                  <div className="space-y-3">
                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        painLevel === 'no-pain'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="no-pain"
                        id="no-pain"
                        ref={refTarget === 'no-pain' ? radioRef : null}
                      />
                      <Label htmlFor="no-pain" className="flex-1 cursor-pointer">
                        <div className="font-medium">No Pain</div>
                        <p className="text-sm text-gray-500">
                          {" I don't experience any discomfort during my period"}
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        painLevel === 'mild'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="mild"
                        id="mild"
                        ref={refTarget === 'mild' ? radioRef : null}
                      />
                      <Label htmlFor="mild" className="flex-1 cursor-pointer">
                        <div className="font-medium">Mild</div>
                        <p className="text-sm text-gray-500">
                          {"Noticeable but doesn't interfere with daily activities"}
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        painLevel === 'moderate'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="moderate"
                        id="moderate"
                        ref={refTarget === 'moderate' ? radioRef : null}
                      />
                      <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                        <div className="font-medium">Moderate</div>
                        <p className="text-sm text-gray-500">
                          Uncomfortable and may require pain relief
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        painLevel === 'severe'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="severe"
                        id="severe"
                        ref={refTarget === 'severe' ? radioRef : null}
                      />
                      <Label htmlFor="severe" className="flex-1 cursor-pointer">
                        <div className="font-medium">Severe</div>
                        <p className="text-sm text-gray-500">
                          Significant pain that limits normal activities
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        painLevel === 'debilitating'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="debilitating"
                        id="debilitating"
                        ref={refTarget === 'debilitating' ? radioRef : null}
                      />
                      <Label htmlFor="debilitating" className="flex-1 cursor-pointer">
                        <div className="font-medium">Debilitating</div>
                        <p className="text-sm text-gray-500">
                          Extreme pain that prevents normal activities
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        painLevel === 'varies'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="varies"
                        id="varies"
                        ref={refTarget === 'varies' ? radioRef : null}
                      />
                      <Label htmlFor="varies" className="flex-1 cursor-pointer">
                        <div className="font-medium">It varies</div>
                        <p className="text-sm text-gray-500">
                          Pain level changes throughout your period or between cycles
                        </p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 w-full border-pink-100 bg-pink-50">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <InfoIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-600" />
                <div>
                  <h3 className="mb-1 font-semibold text-gray-800">About Menstrual Pain</h3>
                  <p className="text-sm text-gray-600">
                    {`Mild to moderate menstrual cramps (dysmenorrhea) are common. They're caused by
                    substances called prostaglandins that help the uterus contract to shed its
                    lining.`}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Severe pain that disrupts your life may be a sign of conditions like
                    endometriosis, adenomyosis, or uterine fibroids, and should be discussed with a
                    healthcare provider.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mb-4 text-center text-xs text-gray-500">
            Your data is private and secure. Dottie does not store your personal health information.
          </p>

          <div className="mt-auto flex w-full justify-between">
            <Link to="/assessment/flow">
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
                painLevel
                  ? `/assessment/symptoms${
                      location.search.includes('mode=quickresponse') ? '?mode=quickresponse' : ''
                    }`
                  : '#'
              }
            >
              <Button
                className="flex items-center px-6 py-6 text-lg"
                disabled={!painLevel}
                ref={continueButtonRef}
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
