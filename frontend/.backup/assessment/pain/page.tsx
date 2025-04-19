"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft, InfoIcon } from "lucide-react"

export default function PainPage() {
  const [selectedPain, setSelectedPain] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Image src="/chatb.png" alt="Dottie Logo" width={32} height={32} />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <Link href="/" className="text-gray-500">
          X
        </Link>
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">83% Complete</div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-pink-500 h-2 rounded-full w-[83%]"></div>
        </div>

        <h1 className="text-xl font-bold mb-2">Question 5 of 6</h1>
        <h2 className="text-3xl font-semibold mb-1">How would you rate your menstrual pain?</h2>
        <p className="text-sm text-gray-500 mb-6">
          Select the option that best describes your typical pain level during your period
        </p>

        <RadioGroup value={selectedPain || ""} onValueChange={setSelectedPain} className="mb-6">
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
          <Link href="/assessment/flow">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Link href={selectedPain ? "/assessment/symptoms" : "#"}>
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

