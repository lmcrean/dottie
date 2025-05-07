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

export default function FlowPage() {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [refTarget, setRefTarget] = useState('');
  const location = useLocation();
  const radioRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = ['light', 'moderate', 'heavy', 'very heavy', 'It varies', "I'm not sure"];
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

  const handleFlowChange = (value: string) => {
    setSelectedFlow(value);
    sessionStorage.setItem('flowLevel', value);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">67% Complete</div>
          </div>

          <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 w-[67%] rounded-full bg-pink-500"></div>
          </div>

          <div className="mb-8 flex flex-col gap-8 lg:flex-row">
            <div className="items-top flex justify-center text-center lg:w-1/2 lg:justify-start lg:text-left">
              <div className="flex flex-col gap-3">
                <h1 className="mb-2 text-xl font-bold dark:text-slate-100">Question 4 of 6</h1>
                <h2 className="mb-1 text-3xl font-semibold dark:text-slate-100">
                  How would you describe your menstrual flow?
                </h2>
                <p className="mb-6 text-sm text-gray-500 dark:text-slate-200">
                  Select the option that best describes your typical flow heaviness
                </p>
                <img
                  src="/assessmentAssets/flow.svg"
                  alt=""
                  className="contrast-125 filter transition duration-300 hover:scale-105"
                />
              </div>
            </div>

            <Card className="w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 lg:w-1/2">
              <CardContent className="pb-8 pt-8">
                <RadioGroup
                  value={selectedFlow || ''}
                  onValueChange={handleFlowChange}
                  className="mb-6"
                >
                  <div className="space-y-3">
                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedFlow === 'light'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="light"
                        id="light"
                        ref={refTarget === 'light' ? radioRef : null}
                      />
                      <Label htmlFor="light" className="flex-1 cursor-pointer">
                        <div className="font-medium">Light</div>
                        <p className="text-sm text-gray-500">
                          Minimal bleeding, may only need panty liners
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedFlow === 'moderate'
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
                          Regular bleeding, requires normal protection
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedFlow === 'heavy'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="heavy"
                        id="heavy"
                        ref={refTarget === 'heavy' ? radioRef : null}
                      />
                      <Label htmlFor="heavy" className="flex-1 cursor-pointer">
                        <div className="font-medium">Heavy</div>
                        <p className="text-sm text-gray-500">
                          Substantial bleeding, requires frequent changes
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedFlow === 'very-heavy'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="very-heavy"
                        id="very-heavy"
                        ref={refTarget === 'very heavy' ? radioRef : null}
                      />
                      <Label htmlFor="very-heavy" className="flex-1 cursor-pointer">
                        <div className="font-medium">Very Heavy</div>
                        <p className="text-sm text-gray-500">
                          Excessive bleeding, may soak through protection
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedFlow === 'varies'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="varies"
                        id="varies"
                        ref={refTarget === 'It varies' ? radioRef : null}
                      />
                      <Label htmlFor="varies" className="flex-1 cursor-pointer">
                        <div className="font-medium">It varies</div>
                        <p className="text-sm text-gray-500">
                          Changes throughout your period or between cycles
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                        selectedFlow === 'not-sure'
                          ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem
                        value="not-sure"
                        id="not-sure"
                        ref={refTarget === "I'm not sure" ? radioRef : null}
                      />
                      <Label htmlFor="not-sure" className="flex-1 cursor-pointer">
                        <div className="font-medium">{"I'm not sure"}</div>
                        <p className="text-sm text-gray-500">
                          Need help determining flow heaviness
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
                  <h3 className="mb-1 font-semibold text-gray-800">About Flow Heaviness</h3>
                  <p className="text-sm text-gray-600">
                    Most people lose 30-80ml of blood during their period. Menstrual flow that
                    consistently soaks through a pad/tampon every hour for several hours may
                    indicate heavy menstrual bleeding (menorrhagia).
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Flow often varies throughout your period, typically starting lighter, becoming
                    heavier in the middle, and ending with lighter flow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mb-4 text-center text-xs text-gray-500">
            Your data is private and secure. Dottie does not store your personal health information.
          </p>

          <div className="mt-auto flex w-full justify-between">
            <Link to="/assessment/period-duration">
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
                selectedFlow
                  ? `/assessment/pain${
                      location.search.includes('mode=quickresponse') ? '?mode=quickresponse' : ''
                    }`
                  : '#'
              }
            >
              <Button
                className={`flex items-center px-6 py-6 text-lg ${
                  selectedFlow
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'cursor-not-allowed bg-gray-300 text-gray-500'
                }`}
                ref={continueButtonRef}
                disabled={!selectedFlow}
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
