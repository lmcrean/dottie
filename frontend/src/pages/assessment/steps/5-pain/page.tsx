'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { InfoIcon } from 'lucide-react';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';
import PageTransition from '../../animations/page-transitions';
import { usePainLevel } from './hooks/use-pain-level';
import { PainLevel } from '@/src/pages/assessment/steps/context/types';
import ContinueButton from '../components/ContinueButton';
import BackButton from '../components/BackButton';

export default function PainPage() {
  const { painLevel, setPainLevel } = usePainLevel();
  const [selectedPain, setSelectedPain] = useState<PainLevel | undefined>(painLevel);
  const [refTarget, setRefTarget] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (painLevel) {
      setSelectedPain(painLevel);
    }
  }, [painLevel]);

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = ['no-pain', 'mild', 'moderate', 'severe', 'debilitating', 'varies'];
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

  const handleOptionClick = (value: PainLevel) => {
    setSelectedPain(value);
    setPainLevel(value);
  };

  const handleContinue = () => {
    if (selectedPain) {
      const queryParams = location.search.includes('mode=quickresponse')
        ? '?mode=quickresponse'
        : '';
      navigate(`/assessment/symptoms${queryParams}`);
    }
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
                <div className="space-y-3">
                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedPain === 'no-pain'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('no-pain')}
                    ref={refTarget === 'no-pain' ? buttonRef : null}
                    data-testid="option-no-pain"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedPain === 'no-pain' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">No Pain</div>
                      <p className="text-sm text-gray-500">
                        {" I don't experience any discomfort during my period"}
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedPain === 'mild'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('mild')}
                    ref={refTarget === 'mild' ? buttonRef : null}
                    data-testid="option-mild"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedPain === 'mild' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Mild</div>
                      <p className="text-sm text-gray-500">
                        {"Noticeable but doesn't interfere with daily activities"}
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedPain === 'moderate'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('moderate')}
                    ref={refTarget === 'moderate' ? buttonRef : null}
                    data-testid="option-moderate"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedPain === 'moderate' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Moderate</div>
                      <p className="text-sm text-gray-500">
                        Uncomfortable and may require pain relief
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedPain === 'severe'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('severe')}
                    ref={refTarget === 'severe' ? buttonRef : null}
                    data-testid="option-severe"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedPain === 'severe' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Severe</div>
                      <p className="text-sm text-gray-500">
                        Significant pain that limits normal activities
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedPain === 'debilitating'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('debilitating')}
                    ref={refTarget === 'debilitating' ? buttonRef : null}
                    data-testid="option-debilitating"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedPain === 'debilitating' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">Debilitating</div>
                      <p className="text-sm text-gray-500">
                        Extreme pain that prevents normal activities
                      </p>
                    </Label>
                  </button>

                  <button
                    type="button"
                    className={`flex w-full items-center space-x-2 rounded-lg border p-3 text-left transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                      selectedPain === 'varies'
                        ? 'border-pink-500 bg-pink-50 dark:text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionClick('varies')}
                    ref={refTarget === 'varies' ? buttonRef : null}
                    data-testid="option-varies"
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary">
                      {selectedPain === 'varies' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                      )}
                    </div>
                    <Label className="flex-1 cursor-pointer">
                      <div className="font-medium">It varies</div>
                      <p className="text-sm text-gray-500">
                        Pain level changes throughout your period or between cycles
                      </p>
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
            <BackButton destination="/assessment/flow" dataTestId="back-button" />

            <ContinueButton
              ref={continueButtonRef}
              isEnabled={!!selectedPain}
              onContinue={handleContinue}
              dataTestId="continue-button"
            />
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
