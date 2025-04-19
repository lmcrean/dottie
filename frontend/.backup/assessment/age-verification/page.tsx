"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function AgeVerificationPage() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null)

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
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-pink-500 h-2 rounded-full w-[16%]"></div>
        </div>

        <h1 className="text-xl font-bold mb-2">Question 1 of 6</h1>
        <h2 className="text-xl font-bold mb-6">What is your age range?</h2>

        <Card className="w-full mb-8">
          <CardContent className="pt-6">
            <RadioGroup value={selectedAge || ""} onValueChange={setSelectedAge}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="under-13" id="under-13" />
                  <Label htmlFor="under-13" className="flex-1 cursor-pointer">
                    <div className="font-medium">Under 13 years</div>
                    <p className="text-sm text-gray-500">Parental guidance recommended</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="13-17" id="13-17" />
                  <Label htmlFor="13-17" className="flex-1 cursor-pointer">
                    <div className="font-medium">13-17 years</div>
                    <p className="text-sm text-gray-500">Teen-appropriate content</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="18-24" id="18-24" />
                  <Label htmlFor="18-24" className="flex-1 cursor-pointer">
                    <div className="font-medium">18-24 years</div>
                    <p className="text-sm text-gray-500">Young adult content</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="25-plus" id="25-plus" />
                  <Label htmlFor="25-plus" className="flex-1 cursor-pointer">
                    <div className="font-medium">25+ years</div>
                    <p className="text-sm text-gray-500">Adult content</p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between w-full mt-auto">
          <Link href="/">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Link href={selectedAge ? "/assessment/cycle-length" : "#"}>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white" disabled={!selectedAge}>
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

