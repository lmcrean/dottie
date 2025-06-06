'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { InfoIcon } from 'lucide-react';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';
import { usePeriodDuration } from '@/src/pages/assessment/steps/3-period-duration/hooks/use-period-duration';
import { PeriodDuration } from '@/src/pages/assessment/steps/context/types';
import PageTransition from '../../animations/page-transitions';
import ContinueButton from '../components/ContinueButton';
import BackButton from '../components/BackButton';

export default function PeriodDurationPage() {
  const { periodDuration, setPeriodDuration } = usePeriodDuration();
  const [selectedDuration, setSelectedDuration] = useState<PeriodDuration | undefined>(
    periodDuration
  );
  const [refTarget, setRefTarget] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (periodDuration) {
      setSelectedDuration(periodDuration);
    }
  }, [periodDuration]);

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = ['1-3', '4-5', '6-7', '8-plus', 'varies', 'not-sure', 'other'];
    const random = options[Math.floor(Math.random() * options.length)];
    setRefTarget(random);

    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }, 100);

    setTimeout(() => {
      if (continueButtonRef.current) {
        continueButtonRef.current.click();
      }
    }, 100);
  }, [isQuickResponse]);

  const handleOptionClick = (value: PeriodDuration) => {
    setSelectedDuration(value);
    setPeriodDuration(value);
    sessionStorage.setItem('periodDuration', value);
  };

  const handleContinue = () => {
    if (selectedDuration) {
      const queryParams = location.search.includes('mode=quickresponse')
        ? '?mode=quickresponse'
        : '';
      navigate(`/assessment/flow${queryParams}`);
    }
  };

  return (
    <PageTransition>
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
                <div className="space-y-3">
                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === '1-3'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('1-3')}
                    ref={refTarget === '1-3' ? buttonRef : null}
                    data-testid="option-1-3"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedDuration === '1-3' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">1-3 days</div>
                      <p className="text-sm text-gray-500">Shorter duration</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === '4-5'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('4-5')}
                    ref={refTarget === '4-5' ? buttonRef : null}
                    data-testid="option-4-5"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedDuration === '4-5' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">4-5 days</div>
                      <p className="text-sm text-gray-500">Average duration</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === '6-7'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('6-7')}
                    ref={refTarget === '6-7' ? buttonRef : null}
                    data-testid="option-6-7"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedDuration === '6-7' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">6-7 days</div>
                      <p className="text-sm text-gray-500">Longer duration</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === '8-plus'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('8-plus')}
                    ref={refTarget === '8-plus' ? buttonRef : null}
                    data-testid="option-8-plus"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedDuration === '8-plus' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">8+ days</div>
                      <p className="text-sm text-gray-500">Extended duration</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === 'varies'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('varies')}
                    ref={refTarget === 'varies' ? buttonRef : null}
                    data-testid="option-varies"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedDuration === 'varies' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">It varies</div>
                      <p className="text-sm text-gray-500">Changes from cycle to cycle</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === 'not-sure'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('not-sure')}
                    ref={refTarget === 'not-sure' ? buttonRef : null}
                    data-testid="option-not-sure"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedDuration === 'not-sure' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">{"I'm not sure"}</div>
                      <p className="text-sm text-gray-500">Need help tracking</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedDuration === 'other'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('other')}
                    ref={refTarget === 'other' ? buttonRef : null}
                    data-testid="option-other"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedDuration === 'other' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Other</div>
                      <p className="text-sm text-gray-500">Specify your own period duration</p>
                    </Label>
                  </button>
                </div>
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
                    Spotting before or after your period is common but should be noted separately
                    from your main flow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mb-4 text-center text-xs text-gray-500">
            Your data is private and secure. Dottie does not store your personal health information.
          </p>

          <div className="mt-auto flex w-full justify-between">
            <BackButton destination="/assessment/cycle-length" dataTestId="back-button" />

            <ContinueButton
              ref={continueButtonRef}
              isEnabled={!!selectedDuration}
              onContinue={handleContinue}
              dataTestId="continue-button"
            />
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
