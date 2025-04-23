"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/src/components/ui/!to-migrate/button";
import { Card, CardContent } from "@/src/components/ui/!to-migrate/card";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/components/ui/!to-migrate/radio-group";
import { Label } from "@/src/components/ui/!to-migrate/label";
import { ChevronRight, ChevronLeft, InfoIcon } from "lucide-react";
import UserIcon from "@/src/components/navigation/UserIcon";
import { useQuickNavigate } from "@/src/hooks/useQuickNavigate";
import PageTransition from "../page-transitions";

export default function PainPage() {
  const [selectedPain, setSelectedPain] = useState<string | null>(null);
  const [refTarget, setRefTarget] = useState("");
  const location = useLocation();
  const radioRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = [
      "no pain",
      "mild",
      "moderate",
      "severe",
      "debilitating",
      "It varies",
    ];
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
    setSelectedPain(value);
    sessionStorage.setItem("painLevel", value);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">

        <main className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">83% Complete</div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div className="bg-pink-500 h-2 rounded-full w-[83%]"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-1/2 flex items-top justify-center lg:justify-start text-center lg:text-left">
              <div className="flex flex-col gap-3">
                <h1 className="text-xl dark:text-slate-100 font-bold mb-2">Question 5 of 6</h1>
                <h2 className="text-3xl dark:text-slate-100 font-semibold mb-1">How would you rate your menstrual pain?</h2>
                <p className="text-sm text-gray-500 dark:text-slate-200 mb-6">
                  Select the option that best describes your typical pain level during your period
                </p>
                <img src="/assessmentAssets/pain.svg" alt="" className="filter contrast-125 hover:scale-105 transition duration-300" />
              </div>
            </div>

            <Card className="w-full lg:w-1/2 shadow-md border dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <RadioGroup
                  value={selectedPain || ""}
                  onValueChange={handlePainChange}
                  className="mb-6"
                >
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300 dark:hover:text-gray-900  ${selectedPain === "no-pain"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900" 
                          : "hover:bg-gray-50"
                        }`}>
                      <RadioGroupItem
                        value="no-pain"
                        id="no-pain"
                        ref={refTarget === "no pain" ? radioRef : null}
                      />
                      <Label htmlFor="no-pain" className="flex-1 cursor-pointer">
                        <div className="font-medium">No Pain</div>
                        <p className="text-sm text-gray-500">
                          I don't experience any discomfort during my period
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900  ${selectedPain === "mild"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900" 
                          : "hover:bg-gray-50"
                        }`}>

                      <RadioGroupItem
                        value="mild"
                        id="mild"
                        ref={refTarget === "mild" ? radioRef : null}
                      />
                      <Label htmlFor="mild" className="flex-1 cursor-pointer">
                        <div className="font-medium">Mild</div>
                        <p className="text-sm text-gray-500">
                          Noticeable but doesn't interfere with daily activities
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900  ${selectedPain === "moderate"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900" 
                          : "hover:bg-gray-50"
                        }`}>
                      <RadioGroupItem
                        value="moderate"
                        id="moderate"
                        ref={refTarget === "moderate" ? radioRef : null}
                      />
                      <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                        <div className="font-medium">Moderate</div>
                        <p className="text-sm text-gray-500">
                          Uncomfortable and may require pain relief
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900  ${selectedPain === "severe"
                      ? "border-pink-500 bg-pink-50 dark:text-gray-900" 
                      : "hover:bg-gray-50"
                    }`}>
                      <RadioGroupItem
                        value="severe"
                        id="severe"
                        ref={refTarget === "severe" ? radioRef : null}
                      />
                      <Label htmlFor="severe" className="flex-1 cursor-pointer">
                        <div className="font-medium">Severe</div>
                        <p className="text-sm text-gray-500">
                          Significant pain that limits normal activities
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900  ${selectedPain === "debilitating"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900" 
                          : "hover:bg-gray-50"
                        }`}>
                      <RadioGroupItem
                        value="debilitating"
                        id="debilitating"
                        ref={refTarget === "debilitating" ? radioRef : null}
                      />
                      <Label
                        htmlFor="debilitating"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">Debilitating</div>
                        <p className="text-sm text-gray-500">
                          Extreme pain that prevents normal activities
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300 dark:hover:text-gray-900  ${selectedPain === "varies"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900" 
                          : "hover:bg-gray-50"
                        }`}>
                      <RadioGroupItem
                        value="varies"
                        id="varies"
                        ref={refTarget === "It varies" ? radioRef : null}
                      />
                      <Label htmlFor="varies" className="flex-1 cursor-pointer">
                        <div className="font-medium">It varies</div>
                        <p className="text-sm text-gray-500">
                          Pain level changes throughout your period or between
                          cycles
                        </p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full mb-8 bg-pink-50 border-pink-100">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <InfoIcon className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    About Menstrual Pain
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mild to moderate menstrual cramps (dysmenorrhea) are common.
                    They're caused by substances called prostaglandins that help
                    the uterus contract to shed its lining.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Severe pain that disrupts your life may be a sign of
                    conditions like endometriosis, adenomyosis, or uterine
                    fibroids, and should be discussed with a healthcare provider.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-gray-500 mb-4">
            Your data is private and secure. Dottie does not store your personal
            health information.
          </p>

          <div className="flex justify-between w-full mt-auto">
            <Link to="/assessment/flow">
              <Button
                variant="outline"
                className="flex items-center dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700 px-6 py-6 text-lg"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            </Link>

            <Link
              to={
                selectedPain
                  ? `/assessment/symptoms${
                      location.search.includes("mode=quickresponse")
                        ? "?mode=quickresponse"
                        : ""
                    }`
                  : "#"
              }
            >
              <Button
                className={`flex items-center px-6 py-6 text-lg ${
                  selectedPain
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!selectedPain}
                ref={continueButtonRef}
              >
                Continue
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
