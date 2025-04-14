
"use client";

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/!to-migrate/button"
import { Card, CardContent } from "@/src/components/ui/!to-migrate/card"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/!to-migrate/radio-group"
import { Label } from "@/src/components/ui/!to-migrate/label"
import { ChevronRight, ChevronLeft, InfoIcon } from "lucide-react"
import UserIcon from "@/src/components/navigation/UserIcon"
import PageTransition from "../page-transitions"

export default function CycleLengthPage() {
  const [selectedLength, setSelectedLength] = useState<string | null>(null);

  const handleLengthChange = (value: string) => {
    setSelectedLength(value);
    sessionStorage.setItem("cycleLength", value);
  };

  return (
    <PageTransition>
    <div className="flex min-h-screen flex-col  bg-gradient-to-b from-white to-pink-5">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/chatb.png" alt="Dottie Logo" width={32} height={32} />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <UserIcon />
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">33% Complete</div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-pink-500 h-2 rounded-full w-[33%]"></div>
        </div>

        <h1 className="text-xl font-bold mb-2">Question 2 of 6</h1>
        <h2 className="text-lg font-semibold mb-1">
          How long is your menstrual cycle?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Count from the first day of one period to the first day of the next
          period
        </p>

        <Card className="w-full mb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-8 pb-8">
            <RadioGroup
              value={selectedLength || ""}
              onValueChange={handleLengthChange}
              className="mb-6"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="21-25" id="21-25" />
                  <Label htmlFor="21-25" className="flex-1 cursor-pointer">
                    <div className="font-medium">21-25 days</div>
                    <p className="text-sm text-gray-500">
                      Shorter than average
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="26-30" id="26-30" />
                  <Label htmlFor="26-30" className="flex-1 cursor-pointer">
                    <div className="font-medium">26-30 days</div>
                    <p className="text-sm text-gray-500">Average length</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="31-35" id="31-35" />
                  <Label htmlFor="31-35" className="flex-1 cursor-pointer">
                    <div className="font-medium">31-35 days</div>
                    <p className="text-sm text-gray-500">Longer than average</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="36-40" id="36-40" />
                  <Label htmlFor="36-40" className="flex-1 cursor-pointer">
                    <div className="font-medium">36-40 days</div>
                    <p className="text-sm text-gray-500">Extended cycle</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="irregular" id="irregular" />
                  <Label htmlFor="irregular" className="flex-1 cursor-pointer">
                    <div className="font-medium">Irregular</div>
                    <p className="text-sm text-gray-500">
                      Varies by more than 7 days
                    </p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="not-sure" id="not-sure" />
                  <Label htmlFor="not-sure" className="flex-1 cursor-pointer">
                    <div className="font-medium">I'm not sure</div>
                    <p className="text-sm text-gray-500">Need help tracking</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex-1 cursor-pointer">
                    <div className="font-medium">Other</div>
                    <p className="text-sm text-gray-500">
                      Specify your own cycle length
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="w-full mb-8 bg-pink-50 border-pink-100 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <InfoIcon className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  About Menstrual Cycles
                </h3>
                <p className="text-sm text-gray-600">
                  A typical menstrual cycle can range from 21 to 35 days. Cycles
                  outside this range or that vary significantly may indicate
                  hormonal fluctuations.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Not sure? Try using our period tracker for 2-3 months to
                  discover your pattern.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between w-full mt-auto">
          <Link to="/assessment/age-verification">
            <Button
              variant="outline"
              className="flex items-center px-6 py-6 text-lg"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </Link>

          <Link to={selectedLength ? "/assessment/period-duration" : "#"}>
            <Button
              className={`flex items-center px-6 py-6 text-lg ${
                selectedLength
                  ? "bg-pink-500 hover:bg-pink-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!selectedLength}
            >
              Continue
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
   </PageTransition>
  )
}
