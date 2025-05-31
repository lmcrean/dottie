'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { InfoIcon } from 'lucide-react';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';
import { useCycleLength } from '@/src/pages/assessment/steps/2-cycle-length/hooks/use-cycle-length';
import { CycleLength } from '@/src/pages/assessment/steps/context/types';
import PageTransition from '../../animations/page-transitions';
import ContinueButton from '../components/ContinueButton';
import BackButton from '../components/BackButton';

export default function CycleLengthPage() {
  const { cycleLength, setCycleLength } = useCycleLength();
  const [selectedLength, setSelectedLength] = useState<CycleLength | undefined>(cycleLength);
  const [refTarget, setRefTarget] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (cycleLength) {
      setSelectedLength(cycleLength);
    }
  }, [cycleLength]);

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = ['21-25', '26-30', '31-35', '36-40', 'irregular', 'not-sure', 'other'];
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

  const handleOptionClick = (value: CycleLength) => {
    setSelectedLength(value);
    setCycleLength(value);
    sessionStorage.setItem('cycleLength', value);
  };

  const handleContinue = () => {
    if (selectedLength) {
      const queryParams = location.search.includes('mode=quickresponse')
        ? '?mode=quickresponse'
        : '';
      navigate(`/assessment/period-duration${queryParams}`);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">33% Complete</div>
          </div>

          <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 w-[33%] rounded-full bg-pink-500"></div>
          </div>

          <div className="mb-8 flex flex-col gap-8 lg:flex-row">
            <div className="items-top flex justify-center text-center lg:w-1/2 lg:justify-start lg:text-left">
              <div className="flex flex-col gap-3">
                <h1 className="mb-2 text-xl font-bold dark:text-slate-100">Question 2 of 6</h1>
                <h2 className="mb-1 text-3xl font-semibold dark:text-slate-100">
                  How long is your menstrual cycle?
                </h2>
                <p className="mb-6 text-sm text-gray-500 dark:text-slate-200">
                  Count from the first day of one period to the first day of the next period
                </p>
                <img
                  src="/assessmentAssets/cycle.svg"
                  alt=""
                  className="contrast-125 filter transition duration-300 hover:scale-105"
                />
              </div>
            </div>

            <Card className="w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800 lg:w-1/2">
              <CardContent className="pb-8 pt-8">
                <div className="space-y-3">
                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedLength === '21-25'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('21-25')}
                    ref={refTarget === '21-25' ? buttonRef : null}
                    data-testid="option-21-25"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedLength === '21-25' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">21-25 days</div>
                      <p className="text-sm text-gray-500">Shorter than average</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedLength === '26-30'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('26-30')}
                    ref={refTarget === '26-30' ? buttonRef : null}
                    data-testid="option-26-30"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedLength === '26-30' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">26-30 days</div>
                      <p className="text-sm text-gray-500">Average length</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedLength === '31-35'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('31-35')}
                    ref={refTarget === '31-35' ? buttonRef : null}
                    data-testid="option-31-35"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedLength === '31-35' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">31-35 days</div>
                      <p className="text-sm text-gray-500">Longer than average</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedLength === '36-40'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('36-40')}
                    ref={refTarget === '36-40' ? buttonRef : null}
                    data-testid="option-36-40"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedLength === '36-40' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">36-40 days</div>
                      <p className="text-sm text-gray-500">Extended cycle</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedLength === 'irregular'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('irregular')}
                    ref={refTarget === 'irregular' ? buttonRef : null}
                    data-testid="option-irregular"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedLength === 'irregular' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Irregular</div>
                      <p className="text-sm text-gray-500">Varies by more than 7 days</p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedLength === 'not-sure'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('not-sure')}
                    ref={refTarget === 'not-sure' ? buttonRef : null}
                    data-testid="option-not-sure"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedLength === 'not-sure' && (
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
                      selectedLength === 'other'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('other')}
                    ref={refTarget === 'other' ? buttonRef : null}
                    data-testid="option-other"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedLength === 'other' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Other</div>
                      <p className="text-sm text-gray-500">Specify your own cycle length</p>
                    </Label>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 w-full border-pink-100 bg-pink-50">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <InfoIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-600" />
                <div>
                  <h3 className="mb-1 font-semibold text-gray-800">About Menstrual Cycles</h3>
                  <p className="text-sm text-gray-600">
                    A typical menstrual cycle can range from 21 to 35 days. Cycles outside this
                    range or that vary significantly may indicate hormonal fluctuations.
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Not sure? Try using our period tracker for 2-3 months to discover your pattern.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-auto flex w-full justify-between">
            <BackButton destination="/assessment/age-verification" dataTestId="back-button" />

            <ContinueButton
              ref={continueButtonRef}
              isEnabled={!!selectedLength}
              onContinue={handleContinue}
              dataTestId="continue-button"
            />
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
