"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/!to-migrate/button"
import { Card, CardContent } from "@/src/components/ui/!to-migrate/card"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/!to-migrate/radio-group"
import { Label } from "@/src/components/ui/!to-migrate/label"
import { ChevronRight, ChevronLeft, InfoIcon } from "lucide-react"
import UserIcon from "@/src/components/navigation/UserIcon"

export default function FlowPage() {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)

  const handleFlowChange = (value: string) => {
    setSelectedFlow(value)
    sessionStorage.setItem("flowLevel", value)
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

      <main className="flex-1 flex flex-col p-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">67% Complete</div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-pink-500 h-2 rounded-full w-[67%]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center content-center mb-8">
            <h1 className="text-xl font-bold mb-2">Question 4 of 6</h1>
            <h1 className="text-3xl font-bold mb-3">How would you describe your menstrual flow?</h1>
            <p className="text-gray-600">
              Select the option that best describes your typical flow heaviness</p>
          </div>
          
          <RadioGroup value={selectedFlow || ""} onValueChange={handleFlowChange} className="mb-6">
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
        </div>

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

        <div className="flex justify-between w-full">
          <Link to="/assessment/period-duration">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Link to={selectedFlow ? "/assessment/pain" : "#"}>
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

