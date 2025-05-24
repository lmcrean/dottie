'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { InfoIcon } from 'lucide-react';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';
import PageTransition from '../../animations/page-transitions';
import { useFlowHeaviness } from './hooks/use-flow-heaviness';
import { FlowHeaviness } from '@/src/pages/assessment/steps/context/types';
import ContinueButton from '../components/ContinueButton';
import BackButton from '../components/BackButton';

export default function FlowPage() {
  const { flowHeaviness, setFlowHeaviness } = useFlowHeaviness();
  const [selectedFlow, setSelectedFlow] = useState<FlowHeaviness | undefined>(flowHeaviness);
  const [refTarget, setRefTarget] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (flowHeaviness) {
      setSelectedFlow(flowHeaviness);
    }
  }, [flowHeaviness]);

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = ['light', 'moderate', 'heavy', 'very-heavy', 'varies', 'not-sure'];
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

  const handleOptionClick = (value: FlowHeaviness) => {
    setSelectedFlow(value);
    setFlowHeaviness(value);
  };

  const handleContinue = () => {
    if (selectedFlow) {
      const queryParams = location.search.includes('mode=quickresponse')
        ? '?mode=quickresponse'
        : '';
      navigate(`/assessment/pain${queryParams}`);
    }
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
                <div className="space-y-3">
                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedFlow === 'light'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('light')}
                    ref={refTarget === 'light' ? buttonRef : null}
                    data-testid="option-light"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedFlow === 'light' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Light</div>
                      <p className="text-sm text-gray-500">
                        Minimal bleeding, may only need panty liners
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedFlow === 'moderate'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('moderate')}
                    ref={refTarget === 'moderate' ? buttonRef : null}
                    data-testid="option-moderate"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedFlow === 'moderate' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Moderate</div>
                      <p className="text-sm text-gray-500">
                        Regular bleeding, requires normal protection
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedFlow === 'heavy'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('heavy')}
                    ref={refTarget === 'heavy' ? buttonRef : null}
                    data-testid="option-heavy"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedFlow === 'heavy' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Heavy</div>
                      <p className="text-sm text-gray-500">
                        Substantial bleeding, requires frequent changes
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedFlow === 'very-heavy'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('very-heavy')}
                    ref={refTarget === 'very-heavy' ? buttonRef : null}
                    data-testid="option-very-heavy"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedFlow === 'very-heavy' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Very Heavy</div>
                      <p className="text-sm text-gray-500">
                        Excessive bleeding, may soak through protection
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedFlow === 'varies'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('varies')}
                    ref={refTarget === 'varies' ? buttonRef : null}
                    data-testid="option-varies"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedFlow === 'varies' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">It varies</div>
                      <p className="text-sm text-gray-500">
                        Changes throughout your period or between cycles
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedFlow === 'not-sure'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('not-sure')}
                    ref={refTarget === 'not-sure' ? buttonRef : null}
                    data-testid="option-not-sure"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedFlow === 'not-sure' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">{"I'm not sure"}</div>
                      <p className="text-sm text-gray-500">Need help determining flow heaviness</p>
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
            <BackButton destination="/assessment/period-duration" dataTestId="back-button" />

            <ContinueButton
              ref={continueButtonRef}
              isEnabled={!!selectedFlow}
              onContinue={handleContinue}
              dataTestId="continue-button"
            />
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
