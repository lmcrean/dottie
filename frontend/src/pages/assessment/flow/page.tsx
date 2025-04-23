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

export default function FlowPage() {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [refTarget, setRefTarget] = useState("");
  const location = useLocation();
  const radioRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (!isQuickResponse) return;
    const options = [
      "light",
      "moderate",
      "heavy",
      "very heavy",
      "It varies",
      "I'm not sure",
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

  const handleFlowChange = (value: string) => {
    setSelectedFlow(value);
    sessionStorage.setItem("flowLevel", value);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">

        <main className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">67% Complete</div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
            <div className="bg-pink-500 h-2 rounded-full w-[67%]"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-1/2 flex items-top justify-center lg:justify-start text-center lg:text-left">
              <div className="flex flex-col gap-3">
                <h1 className="text-xl dark:text-slate-100 font-bold mb-2">Question 4 of 6</h1>
                <h2 className="text-3xl dark:text-slate-100 font-semibold mb-1">
                  How would you describe your menstrual flow?
                </h2>
                <p className="text-sm dark:text-slate-200 text-gray-500 mb-6">
                  Select the option that best describes your typical flow heaviness
                </p>
                <img src="/assessmentAssets/flow.svg" alt="" className="filter contrast-125 hover:scale-105 transition duration-300" />
              </div>
            </div>

            <Card className="w-full lg:w-1/2 shadow-md border dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <RadioGroup
                  value={selectedFlow || ""}
                  onValueChange={handleFlowChange}
                  className="mb-6"
                >
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900  ${
                      selectedFlow === "light"
                        ? "border-pink-500 bg-pink-50 dark:text-gray-900"
                        : "hover:bg-gray-50"
                  }`}>
                      <RadioGroupItem
                        value="light"
                        id="light"
                        ref={refTarget === "light" ? radioRef : null}
                      />
                      <Label htmlFor="light" className="flex-1 cursor-pointer">
                        <div className="font-medium">Light</div>
                        <p className="text-sm text-gray-500">
                          Minimal bleeding, may only need panty liners
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900  ${
                      selectedFlow === "moderate"
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
                          Regular bleeding, requires normal protection
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900  ${
                      selectedFlow === "heavy"
                        ? "border-pink-500 bg-pink-50 dark:text-gray-900"
                        : "hover:bg-gray-50"
                  }`}>
                      <RadioGroupItem
                        value="heavy"
                        id="heavy"
                        ref={refTarget === "heavy" ? radioRef : null}
                      />
                      <Label htmlFor="heavy" className="flex-1 cursor-pointer">
                        <div className="font-medium">Heavy</div>
                        <p className="text-sm text-gray-500">
                          Substantial bleeding, requires frequent changes
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900  ${
                      selectedFlow === "very-heavy"
                        ? "border-pink-500 bg-pink-50 dark:text-gray-900"
                        : "hover:bg-gray-50"
                  }`}>
                      <RadioGroupItem
                        value="very-heavy"
                        id="very-heavy"
                        ref={refTarget === "very heavy" ? radioRef : null}
                      />
                      <Label htmlFor="very-heavy" className="flex-1 cursor-pointer">
                        <div className="font-medium">Very Heavy</div>
                        <p className="text-sm text-gray-500">
                          Excessive bleeding, may soak through protection
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900   ${
                      selectedFlow === "varies"
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
                          Changes throughout your period or between cycles
                        </p>
                      </Label>
                    </div>

                    <div className={`flex items-center space-x-2 border dark:border-slate-800 rounded-lg p-3 transition-all duration-300  dark:hover:text-gray-900   ${
                      selectedFlow === "not-sure"
                        ? "border-pink-500 bg-pink-50 dark:text-gray-900"
                        : "hover:bg-gray-50"
                  }`}>
                      <RadioGroupItem
                        value="not-sure"
                        id="not-sure"
                        ref={refTarget === "I'm not sure" ? radioRef : null}
                      />
                      <Label htmlFor="not-sure" className="flex-1 cursor-pointer">
                        <div className="font-medium">I'm not sure</div>
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

          <Card className="w-full mb-8 bg-pink-50 border-pink-100">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <InfoIcon className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">About Flow Heaviness</h3>
                  <p className="text-sm text-gray-600">
                    Most people lose 30-80ml of blood during their period. Menstrual flow that consistently soaks through
                    a pad/tampon every hour for several hours may indicate heavy menstrual bleeding (menorrhagia).
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Flow often varies throughout your period, typically starting lighter, becoming heavier in the middle,
                    and ending with lighter flow.
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
            <Link to="/assessment/period-duration">
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
                selectedFlow
                  ? `/assessment/pain${
                      location.search.includes("mode=quickresponse")
                        ? "?mode=quickresponse"
                        : ""
                    }`
                  : "#"
              }
            >
              <Button
                className={`flex items-center px-6 py-6 text-lg ${
                  selectedFlow
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                ref={continueButtonRef}
                disabled={!selectedFlow}
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
