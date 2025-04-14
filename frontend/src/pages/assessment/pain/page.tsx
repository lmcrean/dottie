"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/!to-migrate/button"
import { Card, CardContent } from "@/src/components/ui/!to-migrate/card"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/!to-migrate/radio-group"
import { Label } from "@/src/components/ui/!to-migrate/label"
import { ChevronRight, ChevronLeft, InfoIcon } from "lucide-react"
import UserIcon from "@/src/components/navigation/UserIcon"

export default function PainPage() {
  const [selectedPain, setSelectedPain] = useState<string | null>(null)

  const handlePainChange = (value: string) => {
    setSelectedPain(value)
    sessionStorage.setItem("painLevel", value)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
        <img src="/chatb.png" alt="Dottie Logo" width={32} height={32} />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <UserIcon />
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">83% Complete</div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-pink-500 h-2 rounded-full w-[83%]"></div>
        </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="lg:w-1/2 flex items-center justify-center lg:justify-start text-center lg:text-left">
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-bold mb-2">Question 5 of 6</h1>
              <h2 className="text-lg font-semibold mb-1">How would you rate your menstrual pain?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Select the option that best describes your typical pain level during your period
              </p>
            </div>
          </div>

          <Card className="w-full lg:w-1/2 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-8 pb-8">
              <RadioGroup value={selectedPain || ""} onValueChange={handlePainChange} className="mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                    <RadioGroupItem value="no-pain" id="no-pain" />
                    <Label htmlFor="no-pain" className="flex-1 cursor-pointer">
                      <div className="font-medium">No Pain</div>
                      <p className="text-sm text-gray-500">I don't experience any discomfort during my period</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild" className="flex-1 cursor-pointer">
                      <div className="font-medium">Mild</div>
                      <p className="text-sm text-gray-500">Noticeable but doesn't interfere with daily activities</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                      <div className="font-medium">Moderate</div>
                      <p className="text-sm text-gray-500">Uncomfortable and may require pain relief</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe" className="flex-1 cursor-pointer">
                      <div className="font-medium">Severe</div>
                      <p className="text-sm text-gray-500">Significant pain that limits normal activities</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                    <RadioGroupItem value="debilitating" id="debilitating" />
                    <Label htmlFor="debilitating" className="flex-1 cursor-pointer">
                      <div className="font-medium">Debilitating</div>
                      <p className="text-sm text-gray-500">Extreme pain that prevents normal activities</p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                    <RadioGroupItem value="varies" id="varies" />
                    <Label htmlFor="varies" className="flex-1 cursor-pointer">
                      <div className="font-medium">It varies</div>
                      <p className="text-sm text-gray-500">Pain level changes throughout your period or between cycles</p>
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
              <InfoIcon className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">About Menstrual Pain</h3>
                <p className="text-sm text-gray-600">
                  Mild to moderate menstrual cramps (dysmenorrhea) are common. They're caused by substances called
                  prostaglandins that help the uterus contract to shed its lining.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Severe pain that disrupts your life may be a sign of conditions like endometriosis, adenomyosis, or
                  uterine fibroids, and should be discussed with a healthcare provider.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-gray-500 mb-4">
          Your data is private and secure. Dottie does not store your personal health information.
        </p>

        <div className="flex justify-between w-full mt-auto">
          <Link to="/assessment/flow">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Link to={selectedPain ? "/assessment/symptoms" : "#"}>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white" disabled={!selectedPain}>
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

