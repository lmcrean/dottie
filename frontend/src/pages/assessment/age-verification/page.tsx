"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/src/components/ui/!to-migrate/button"
import { Card, CardContent } from "@/src/components/ui/!to-migrate/card"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/!to-migrate/radio-group"
import { Label } from "@/src/components/ui/!to-migrate/label"
import { ChevronRight, ChevronLeft, DotIcon } from "lucide-react"
import UserIcon from "@/src/components/navigation/UserIcon"
import PageTransition from "../page-transitions"

export default function AgeVerificationPage() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null)

  const handleAgeChange = (value: string) => {
    setSelectedAge(value)
    sessionStorage.setItem("age", value)
  }

  return (
    <PageTransition>
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-pink-50">
      <header className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <DotIcon className="h-6 w-6 text-pink-500 fill-pink-500" />
          <img src="/chatb.png" alt="Dottie Logo" className="w-10 h-10" />
          <span className="font-bold text-xl text-pink-500">Dottie</span>
        </div>
        <UserIcon />
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-2xl mx-auto w-full">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div className="bg-pink-500 h-2 rounded-full w-[16%] transition-all duration-500"></div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">What is your age range?</h1>
          <p className="text-gray-600">This helps us provide age-appropriate information and recommendations.</p>
        </div>

        <Card className="w-full mb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-8 pb-8">
            <RadioGroup value={selectedAge || ""} onValueChange={handleAgeChange}>
              <div className="space-y-4">
                <div className={`flex items-center space-x-3 border rounded-xl p-4 transition-all duration-300 ${selectedAge === "under-13" ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"}`}>
                  <RadioGroupItem value="under-13" id="under-13" className="text-pink-500" />
                  <Label htmlFor="under-13" className="flex-1 cursor-pointer">
                    <div className="font-medium text-lg">Under 13 years</div>
                    <p className="text-sm text-gray-500">Parental guidance recommended</p>
                  </Label>
                </div>

                <div className={`flex items-center space-x-3 border rounded-xl p-4 transition-all duration-300 ${selectedAge === "13-17" ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"}`}>
                  <RadioGroupItem value="13-17" id="13-17" className="text-pink-500" />
                  <Label htmlFor="13-17" className="flex-1 cursor-pointer">
                    <div className="font-medium text-lg">13-17 years</div>
                    <p className="text-sm text-gray-500">Teen-appropriate content</p>
                  </Label>
                </div>

                <div className={`flex items-center space-x-3 border rounded-xl p-4 transition-all duration-300 ${selectedAge === "18-24" ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"}`}>
                  <RadioGroupItem value="18-24" id="18-24" className="text-pink-500" />
                  <Label htmlFor="18-24" className="flex-1 cursor-pointer">
                    <div className="font-medium text-lg">18-24 years</div>
                    <p className="text-sm text-gray-500">Young adult content</p>
                  </Label>
                </div>

                <div className={`flex items-center space-x-3 border rounded-xl p-4 transition-all duration-300 ${selectedAge === "25-plus" ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"}`}>
                  <RadioGroupItem value="25-plus" id="25-plus" className="text-pink-500" />
                  <Label htmlFor="25-plus" className="flex-1 cursor-pointer">
                    <div className="font-medium text-lg">25+ years</div>
                    <p className="text-sm text-gray-500">Adult content</p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between w-full mt-auto">
          <Link to="/">
            <Button variant="outline" className="flex items-center px-6 py-6 text-lg">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </Link>

          <Link to={selectedAge ? "/assessment/cycle-length" : "#"}>
            <Button 
              className={`flex items-center px-6 py-6 text-lg ${selectedAge ? "bg-pink-500 hover:bg-pink-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} 
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
  )
}

