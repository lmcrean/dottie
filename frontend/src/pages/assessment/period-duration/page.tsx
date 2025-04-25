'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/src/components/ui/!to-migrate/button';
import { Card, CardContent } from '@/src/components/ui/!to-migrate/card';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/!to-migrate/radio-group';
import { Label } from '@/src/components/ui/!to-migrate/label';
import { ChevronRight, ChevronLeft, InfoIcon } from 'lucide-react';
import UserIcon from '@/src/components/navigation/UserIcon';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';

export default function PeriodDurationPage() {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [refTarget, setRefTarget] = useState('');
  const location = useLocation();
  const radioRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = ['1-3', '4-5', '6-7', '8+', 'It varies', "I'm not sure", 'Other'];
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

  const handleDurationChange = (value: string) => {
    setSelectedDuration(value);
    sessionStorage.setItem('periodDuration', value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">50% Complete</div>
        </div>

        <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
          <div className="h-2 w-[50%] rounded-full bg-pink-500"></div>
        </div>
        <div className="mb-8 flex flex-col gap-8 lg:flex-row">
          <div className="items-top flex justify-center text-center lg:w-1/2 lg:justify-start lg:text-left">
            <div className="flex flex-col gap-3">
              <h1 className="mb-2 text-xl font-bold dark:text-slate-100">Question 3 of 6</h1>
              <h2 className="mb-1 text-3xl font-semibold dark:text-slate-100">
                How many days does your period typically last?
              </h2>
              <p className="mb-6 text-sm text-gray-500 dark:text-slate-200">
                Count the days from when bleeding starts until it completely stops
              </p>
              <img
                src="/assessmentAssets/duration.svg"
                alt=""
                className="contrast-125 filter transition duration-300 hover:scale-105"
              />
            </div>
          </div>

          <Card className="mb-8 w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800">
            <CardContent className="pb-8 pt-8">
              <RadioGroup
                value={selectedDuration || ''}
                onValueChange={handleDurationChange}
                className="mb-6"
              >
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === '1-3'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem
                      value="1-3"
                      id="1-3"
                      ref={refTarget === '1-3' ? radioRef : null}
                    />
                    <Label htmlFor="1-3" className="flex-1 cursor-pointer">
                      <div className="font-medium">1-3 days</div>
                      <p className="text-sm text-gray-500">Shorter duration</p>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === '4-5'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem
                      value="4-5"
                      id="4-5"
                      ref={refTarget === '4-5' ? radioRef : null}
                    />
                    <Label htmlFor="4-5" className="flex-1 cursor-pointer">
                      <div className="font-medium">4-5 days</div>
                      <p className="text-sm text-gray-500">Average duration</p>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === '6-7'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem
                      value="6-7"
                      id="6-7"
                      ref={refTarget === '6-7' ? radioRef : null}
                    />
                    <Label htmlFor="6-7" className="flex-1 cursor-pointer">
                      <div className="font-medium">6-7 days</div>
                      <p className="text-sm text-gray-500">Longer duration</p>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === '8-plus'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem
                      value="8-plus"
                      id="8-plus"
                      ref={refTarget === '8+' ? radioRef : null}
                    />
                    <Label htmlFor="8-plus" className="flex-1 cursor-pointer">
                      <div className="font-medium">8+ days</div>
                      <p className="text-sm text-gray-500">Extended duration</p>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === 'varies'
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
                      <p className="text-sm text-gray-500">Changes from cycle to cycle</p>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === 'not-sure'
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
                      <div className="font-medium">I'm not sure</div>
                      <p className="text-sm text-gray-500">Need help tracking</p>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === 'other'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem
                      value="other"
                      id="other"
                      ref={refTarget === 'Other' ? radioRef : null}
                    />
                    <Label htmlFor="other" className="flex-1 cursor-pointer">
                      <div className="font-medium">Other</div>
                      <p className="text-sm text-gray-500">Specify your own period duration</p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 w-full border-pink-100 bg-pink-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <InfoIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-600" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-800">About Period Duration</h3>
                <p className="text-sm text-gray-600">
                  A typical period lasts between 3-7 days. Periods lasting longer than 7 days may
                  indicate hormonal imbalances or other health conditions.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Spotting before or after your period is common but should be noted separately from
                  your main flow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mb-4 text-center text-xs text-gray-500">
          Your data is private and secure. Dottie does not store your personal health information.
        </p>

        <div className="mt-auto flex w-full justify-between">
          <Link to="/assessment/cycle-length">
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
              selectedDuration
                ? `/assessment/flow${
                    location.search.includes('mode=quickresponse') ? '?mode=quickresponse' : ''
                  }`
                : '#'
            }
          >
            <Button
              className={`flex items-center px-6 py-6 text-lg ${
                selectedDuration
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
              ref={continueButtonRef}
              disabled={!selectedDuration}
            >
              Continue
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
