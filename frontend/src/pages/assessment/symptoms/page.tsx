'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/!to-migrate/button';
import { Card, CardContent } from '@/src/components/ui/!to-migrate/card';
import { Checkbox } from '@/src/components/ui/!to-migrate/checkbox';
import { Input } from '@/src/components/ui/!to-migrate/input';
import { ChevronRight, ChevronLeft, InfoIcon } from 'lucide-react';
import { useQuickNavigate } from '@/src/hooks/useQuickNavigate';
import PageTransition from '../page-transitions';

export default function SymptomsPage() {
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([]);
  const [emotionalSymptoms, setEmotionalSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState('');
  const [refTarget, setRefTarget] = useState('');
  const symptomRef = useRef<HTMLDivElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (!isQuickResponse) return;
    const symptomsList = [
      { id: 'bloating', label: 'Bloating', emoji: '🫃' },
      { id: 'breast-tenderness', label: 'Breast tenderness', emoji: '🤱' },
      { id: 'headaches', label: 'Headaches', emoji: '🤕' },
      { id: 'back-pain', label: 'Back pain', emoji: '⬇️' },
      { id: 'nausea', label: 'Nausea', emoji: '🤢' },
      { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
      { id: 'dizziness', label: 'Dizziness', emoji: '💫' },
      { id: 'acne', label: 'Acne', emoji: '😖' },
      { id: 'digestive-issues', label: 'Digestive issues', emoji: '🚽' },
      { id: 'sleep-disturbances', label: 'Sleep disturbances', emoji: '🛌' },
      { id: 'hot-flashes', label: 'Hot flashes', emoji: '🔥' },
      { id: 'joint-pain', label: 'Joint pain', emoji: '🦴' },
      { id: 'irritability', label: 'Irritability', emoji: '😠' },
      { id: 'mood-swings', label: 'Mood swings', emoji: '🙂😢' },
      { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
      { id: 'depression', label: 'Depression', emoji: '😔' },
      {
        id: 'difficulty-concentrating',
        label: 'Difficulty concentrating',
        emoji: '🧠'
      },
      { id: 'food-cravings', label: 'Food cravings', emoji: '🍫' },
      {
        id: 'emotional-sensitivity',
        label: 'Emotional sensitivity',
        emoji: '💔'
      },
      { id: 'low-energy', label: 'Low energy/motivation', emoji: '⚡' }
    ];

    const random = symptomsList[Math.floor(Math.random() * symptomsList.length)].id;
    setRefTarget(random);
  }, [isQuickResponse]);

  useEffect(() => {
    if (!refTarget) return;

    const timeout = setTimeout(() => {
      if (symptomRef.current) {
        symptomRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      togglePhysicalSymptom(refTarget);
    }, 100); // or 1000

    const continueTimeout = setTimeout(() => {
      if (continueButtonRef.current) {
        continueButtonRef.current.click();
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
      clearTimeout(continueTimeout);
    };
  }, [refTarget]);

  const togglePhysicalSymptom = (symptom: string) => {
    setPhysicalSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const toggleEmotionalSymptom = (symptom: string) => {
    setEmotionalSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleContinue = () => {
    // Combine all symptoms
    const allSymptoms = [
      ...physicalSymptoms.map((id) => {
        const symptom = [
          { id: 'bloating', label: 'Bloating' },
          { id: 'breast-tenderness', label: 'Breast tenderness' },
          { id: 'headaches', label: 'Headaches' },
          { id: 'back-pain', label: 'Back pain' },
          { id: 'nausea', label: 'Nausea' },
          { id: 'fatigue', label: 'Fatigue' },
          { id: 'dizziness', label: 'Dizziness' },
          { id: 'acne', label: 'Acne' },
          { id: 'digestive-issues', label: 'Digestive issues' },
          { id: 'sleep-disturbances', label: 'Sleep disturbances' },
          { id: 'hot-flashes', label: 'Hot flashes' },
          { id: 'joint-pain', label: 'Joint pain' }
        ].find((s) => s.id === id);
        return symptom?.label || id;
      }),
      ...emotionalSymptoms.map((id) => {
        const symptom = [
          { id: 'irritability', label: 'Irritability' },
          { id: 'mood-swings', label: 'Mood swings' },
          { id: 'anxiety', label: 'Anxiety' },
          { id: 'depression', label: 'Depression' },
          { id: 'difficulty-concentrating', label: 'Difficulty concentrating' },
          { id: 'food-cravings', label: 'Food cravings' },
          { id: 'emotional-sensitivity', label: 'Emotional sensitivity' },
          { id: 'low-energy', label: 'Low energy/motivation' }
        ].find((s) => s.id === id);
        return symptom?.label || id;
      }),
      ...(otherSymptoms ? [otherSymptoms] : [])
    ];

    // Save to sessionStorage
    sessionStorage.setItem('symptoms', JSON.stringify(allSymptoms));
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">100% Complete</div>
          </div>

          <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 w-full rounded-full bg-pink-500"></div>
          </div>

          <div className="mb-8 flex flex-col gap-8 lg:flex-row">
            <div className="items-top flex justify-center text-center lg:w-1/2 lg:justify-start lg:text-left">
              <div className="flex flex-col gap-3">
                <h1 className="mb-2 text-xl font-bold dark:text-slate-100">Question 6 of 6</h1>
                <h2 className="mb-1 text-3xl font-semibold dark:text-slate-100">
                  Do you experience any other symptoms with your period?
                </h2>
                <p className="mb-6 text-sm text-gray-500 dark:text-slate-200">
                  Select all that apply. These could occur before, during, or after your period.
                </p>
                <img
                  src="/assessmentAssets/othersymptoms.svg"
                  alt=""
                  className="contrast-125 filter transition duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-center text-base font-medium dark:text-slate-100">
              Physical symptoms
            </h3>
            <div className="grid grid-cols-2 gap-3 dark:text-slate-200">
              {[
                { id: 'bloating', label: 'Bloating', emoji: '🫃' },
                {
                  id: 'breast-tenderness',
                  label: 'Breast tenderness',
                  emoji: '🤱'
                },
                { id: 'headaches', label: 'Headaches', emoji: '🤕' },
                { id: 'back-pain', label: 'Back pain', emoji: '⬇️' },
                { id: 'nausea', label: 'Nausea', emoji: '🤢' },
                { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
                { id: 'dizziness', label: 'Dizziness', emoji: '💫' },
                { id: 'acne', label: 'Acne', emoji: '😖' },
                {
                  id: 'digestive-issues',
                  label: 'Digestive issues',
                  emoji: '🚽'
                },
                {
                  id: 'sleep-disturbances',
                  label: 'Sleep disturbances',
                  emoji: '🛌'
                },
                { id: 'hot-flashes', label: 'Hot flashes', emoji: '🔥' },
                { id: 'joint-pain', label: 'Joint pain', emoji: '🦴' }
              ].map((symptom) => (
                <div
                  role="button"
                  tabIndex={0}
                  key={symptom.id}
                  className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                    physicalSymptoms.includes(symptom.id)
                      ? 'border-pink-300 bg-pink-50 dark:text-gray-900'
                      : 'hover:bg-gray-50'
                  }`}
                  ref={refTarget === symptom.id ? symptomRef : null}
                  onClick={() => togglePhysicalSymptom(symptom.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      togglePhysicalSymptom(symptom.id);
                    }
                  }}
                >
                  <span className="mb-1 text-2xl">{symptom.emoji}</span>
                  <span className="text-center text-sm">{symptom.label}</span>
                  <Checkbox
                    id={`physical-${symptom.id}`}
                    checked={physicalSymptoms.includes(symptom.id)}
                    onCheckedChange={() => togglePhysicalSymptom(symptom.id)}
                    className="sr-only"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-center text-base font-medium dark:text-slate-100">
              Emotional/Mood symptoms
            </h3>
            <div className="grid grid-cols-2 gap-3 dark:text-slate-200">
              {[
                { id: 'irritability', label: 'Irritability', emoji: '😠' },
                { id: 'mood-swings', label: 'Mood swings', emoji: '🙂😢' },
                { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
                { id: 'depression', label: 'Depression', emoji: '😔' },
                {
                  id: 'difficulty-concentrating',
                  label: 'Difficulty concentrating',
                  emoji: '🧠'
                },
                { id: 'food-cravings', label: 'Food cravings', emoji: '🍫' },
                {
                  id: 'emotional-sensitivity',
                  label: 'Emotional sensitivity',
                  emoji: '💔'
                },
                { id: 'low-energy', label: 'Low energy/motivation', emoji: '⚡' }
              ].map((symptom) => (
                <div
                  role="button"
                  tabIndex={0}
                  key={symptom.id}
                  className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border p-3 transition-all duration-300 dark:border-slate-800 dark:hover:text-gray-900 ${
                    emotionalSymptoms.includes(symptom.id)
                      ? 'border-pink-300 bg-pink-50 dark:text-gray-900'
                      : 'hover:bg-gray-50'
                  }`}
                  ref={refTarget === symptom.id ? symptomRef : null}
                  onClick={() => toggleEmotionalSymptom(symptom.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleEmotionalSymptom(symptom.id);
                    }
                  }}
                >
                  <span className="mb-1 text-2xl">{symptom.emoji}</span>
                  <span className="text-center text-sm">{symptom.label}</span>
                  <Checkbox
                    id={`emotional-${symptom.id}`}
                    checked={emotionalSymptoms.includes(symptom.id)}
                    onCheckedChange={() => toggleEmotionalSymptom(symptom.id)}
                    className="sr-only"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 font-medium">Other symptoms not listed?</h3>
            <Input
              placeholder="Type any other symptoms here..."
              value={otherSymptoms}
              onChange={(e) => setOtherSymptoms(e.target.value)}
            />
          </div>

          <Card className="mb-8 w-full border-pink-100 bg-pink-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <InfoIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-600" />
                <div>
                  <h3 className="mb-1 font-semibold text-gray-800">About Period Symptoms</h3>
                  <p className="text-sm text-gray-600">
                    {`It's normal to experience several symptoms during your menstrual cycle. Hormonal
                    fluctuations can affect your body in many ways beyond just bleeding.`}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    However, symptoms that significantly interfere with daily life are not normal
                    and may indicate conditions like PMDD (Premenstrual Dysphoric Disorder) or other
                    reproductive health issues.
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Tracking these symptoms can help your healthcare provider make better
                    assessments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mb-4 text-center text-xs text-gray-500">
            Your data is private and secure. Dottie does not store your personal health information.
          </p>

          <div className="mt-auto flex w-full justify-between">
            <Link to="/assessment/pain">
              <Button
                variant="outline"
                className="flex items-center px-6 py-6 text-lg dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            </Link>

            <Link to="/assessment/results" onClick={handleContinue}>
              <Button
                className="flex items-center bg-pink-600 px-6 py-6 text-lg text-white hover:bg-pink-700"
                ref={continueButtonRef}
              >
                Finish Assessment
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
