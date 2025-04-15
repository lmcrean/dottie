"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DotIcon, ChevronRight, ChevronLeft, InfoIcon } from "lucide-react"

export default function FlowPage() {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)

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
          <div className="text-sm text-gray-500">67% Complete</div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-pink-500 h-2 rounded-full w-[67%]"></div>
        </div>

        <h1 className="text-xl font-bold mb-2">Question 4 of 6</h1>
        <h2 className="text-3xl font-semibold mb-1">How would you describe your menstrual flow?</h2>
        <p className="text-sm text-gray-500 mb-6">Select the option that best describes your typical flow heaviness</p>

        <RadioGroup value={selectedFlow || ""} onValueChange={setSelectedFlow} className="mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex-1 cursor-pointer">
                <div className="font-medium">Light</div>
                <p className="text-sm text-gray-500">Minimal bleeding, may only need panty liners</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                <div className="font-medium">Moderate</div>
                <p className="text-sm text-gray-500">Regular bleeding, requires normal protection</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="heavy" id="heavy" />
              <Label htmlFor="heavy" className="flex-1 cursor-pointer">
                <div className="font-medium">Heavy</div>
                <p className="text-sm text-gray-500">Substantial bleeding, requires frequent changes</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="very-heavy" id="very-heavy" />
              <Label htmlFor="very-heavy" className="flex-1 cursor-pointer">
                <div className="font-medium">Very Heavy</div>
                <p className="text-sm text-gray-500">Excessive bleeding, may soak through protection</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="varies" id="varies" />
              <Label htmlFor="varies" className="flex-1 cursor-pointer">
                <div className="font-medium">It varies</div>
                <p className="text-sm text-gray-500">Changes throughout your period or between cycles</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
              <RadioGroupItem value="not-sure" id="not-sure" />
              <Label htmlFor="not-sure" className="flex-1 cursor-pointer">
                <div className="font-medium">I'm not sure</div>
                <p className="text-sm text-gray-500">Need help determining flow heaviness</p>
              </Label>
            </div>
          </div>
        </RadioGroup>

        <Card className="w-full mb-8 bg-pink-50 border-pink-100">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <InfoIcon className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
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
          Your data is private and secure. Dottie does not store your personal health information.
        </p>

        <div className="flex justify-between w-full mt-auto">
          <Link href="/assessment/period-duration">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Link href={selectedFlow ? "/assessment/pain" : "#"}>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white" disabled={!selectedFlow}>
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

