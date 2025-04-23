"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/src/components/ui/!to-migrate/button";
import { Card, CardContent } from "@/src/components/ui/!to-migrate/card";
import { Label } from "@/src/components/ui/!to-migrate/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/components/ui/!to-migrate/radio-group";
import { ChevronRight, ChevronLeft, DotIcon } from "lucide-react";
import UserIcon from "@/src/components/navigation/UserIcon";
import { useQuickNavigate } from "@/src/hooks/useQuickNavigate";
import PageTransition from "../page-transitions";

export default function AgeVerificationPage() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [refTarget, setRefTarget] = useState("");
  const location = useLocation();
  const radioRef = useRef<HTMLButtonElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isQuickResponse } = useQuickNavigate();

  useEffect(() => {
    if (!isQuickResponse) return;

    const options = ["under-13", "13-17", "18-24", "25-plus"];
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

  const handleAgeChange = (value: string) => {
    setSelectedAge(value);
    sessionStorage.setItem("age", value);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">

        <main className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div className="bg-pink-500 h-2 rounded-full w-[16%] transition-all duration-500"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-1/2 flex items-top justify-center lg:justify-start text-center lg:text-left">
              <div className="flex flex-col gap-3">
                <h1 className="text-xl dark:text-slate-100 font-bold mb-2">Question 1 of 6</h1>
                <h2 className="text-3xl dark:text-slate-100 font-semibold mb-1">What is your age range?</h2>
                <p className="text-gray-600 dark:text-slate-200">This helps us provide age-appropriate information and recommendations.</p>
                <img src="/assessmentAssets/age.svg" alt="" className="filter contrast-125 hover:scale-105 transition duration-300" />
              </div>
              <div>
              </div>
            </div>
            <Card className="w-full lg:w-1/2 shadow-md border dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <RadioGroup
                  value={selectedAge || ""}
                  onValueChange={handleAgeChange}
                >
                  <div className="space-y-4">
                    <div
                      className={`flex items-center space-x-3 border border dark:border-slate-800 rounded-xl p-4 transition-all duration-300 dark:hover:text-gray-900 ${selectedAge === "under-13"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900" 
                          : "hover:bg-gray-50"
                        }`}
                    >
                      <RadioGroupItem
                        value="under-13"
                        id="under-13"
                        className="text-pink-600"
                        ref={refTarget === "under-13" ? radioRef : null}
                      />
                      <Label
                        htmlFor="under-13"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-lg">
                          Under 13 years
                        </div>
                        <p className="text-sm text-gray-500">
                          Parental guidance recommended
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 border dark:border-slate-800 rounded-xl p-4 transition-all duration-300 dark:hover:text-gray-900  ${selectedAge === "13-17"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900"
                          : "hover:bg-gray-50"
                        }`}
                    >
                      <RadioGroupItem
                        value="13-17"
                        id="13-17"
                        className="text-pink-600"
                        ref={refTarget === "13-17" ? radioRef : null}
                      />
                      <Label htmlFor="13-17" className="flex-1 cursor-pointer">
                        <div className="font-medium text-lg">13-17 years</div>
                        <p className="text-sm text-gray-500">
                          Teen-appropriate content
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 border dark:border-slate-800 rounded-xl p-4 transition-all duration-300 dark:hover:text-gray-900  ${selectedAge === "18-24"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900"
                          : "hover:bg-gray-50"
                        }`}
                    >
                      <RadioGroupItem
                        value="18-24"
                        id="18-24"
                        className="text-pink-600"
                        ref={refTarget === "18-24" ? radioRef : null}
                      />
                      <Label htmlFor="18-24" className="flex-1 cursor-pointer">
                        <div className="font-medium text-lg">18-24 years</div>
                        <p className="text-sm text-gray-500">
                          Young adult content
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-3 border dark:border-slate-800 rounded-xl p-4 transition-all duration-300 dark:hover:text-gray-900 ${selectedAge === "25-plus"
                          ? "border-pink-500 bg-pink-50 dark:text-gray-900"
                          : "hover:bg-gray-50"
                        }`}
                    >
                      <RadioGroupItem
                        value="25-plus"
                        id="25-plus"
                        className="text-pink-600"
                        ref={refTarget === "25-plus" ? radioRef : null}
                      />
                      <Label
                        htmlFor="25-plus"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-lg">25+ years</div>
                        <p className="text-sm text-gray-500">Adult content</p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between w-full mt-auto">
            <Link to="/">
              <Button
                variant="outline"
                className="flex dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700 items-center px-6 py-6 text-lg"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            </Link>


            <Link
              to={
                selectedAge
                  ? `/assessment/cycle-length${location.search.includes("mode=quickresponse")
                    ? "?mode=quickresponse"
                    : ""
                  }`
                  : "#"
              }
            >
              <Button
                className={`flex items-center px-6 py-6 text-lg ${selectedAge
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                ref={continueButtonRef}
                disabled={!selectedAge}
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
