"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DotIcon, ChevronRight, ChevronLeft, InfoIcon } from "lucide-react"

export default function SymptomsPage() {
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([])
  const [emotionalSymptoms, setEmotionalSymptoms] = useState<string[]>([])
  const [otherSymptoms, setOtherSymptoms] = useState("")

  const togglePhysicalSymptom = (symptom: string) => {
    setPhysicalSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const toggleEmotionalSymptom = (symptom: string) => {
    setEmotionalSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

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
          <div className="text-sm text-gray-500">100% Complete</div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div className="bg-pink-500 h-2 rounded-full w-full"></div>
        </div>

        <h1 className="text-xl font-bold mb-2">Question 6 of 6</h1>
        <h2 className="text-3xl font-semibold mb-1">Do you experience any other symptoms with your period?</h2>
        <p className="text-sm text-gray-500 mb-6">
          Select all that apply. These could occur before, during, or after your period.
        </p>

        <div className="mb-6">
          <h3 className="font-medium mb-3">Physical symptoms</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "bloating", label: "Bloating", emoji: "🫃" },
              { id: "breast-tenderness", label: "Breast tenderness", emoji: "🤱" },
              { id: "headaches", label: "Headaches", emoji: "🤕" },
              { id: "back-pain", label: "Back pain", emoji: "⬇️" },
              { id: "nausea", label: "Nausea", emoji: "🤢" },
              { id: "fatigue", label: "Fatigue", emoji: "😴" },
              { id: "dizziness", label: "Dizziness", emoji: "💫" },
              { id: "acne", label: "Acne", emoji: "😖" },
              { id: "digestive-issues", label: "Digestive issues", emoji: "🚽" },
              { id: "sleep-disturbances", label: "Sleep disturbances", emoji: "🛌" },
              { id: "hot-flashes", label: "Hot flashes", emoji: "🔥" },
              { id: "joint-pain", label: "Joint pain", emoji: "🦴" },
            ].map((symptom) => (
              <div
                key={symptom.id}
                className={`flex flex-col items-center justify-center border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${
                  physicalSymptoms.includes(symptom.id) ? "bg-pink-50 border-pink-300" : ""
                }`}
                onClick={() => togglePhysicalSymptom(symptom.id)}
              >
                <span className="text-2xl mb-1">{symptom.emoji}</span>
                <span className="text-sm text-center">{symptom.label}</span>
                <Checkbox
                  id={`physical-${symptom.id}`}
                  checked={physicalSymptoms.includes(symptom.id)}
                  onCheckedChange={() => togglePhysicalSymptom(symptom.id)}
                  className="sr-only"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-3">Emotional/Mood symptoms</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "irritability", label: "Irritability", emoji: "😠" },
              { id: "mood-swings", label: "Mood swings", emoji: "🙂😢" },
              { id: "anxiety", label: "Anxiety", emoji: "😰" },
              { id: "depression", label: "Depression", emoji: "😔" },
              { id: "difficulty-concentrating", label: "Difficulty concentrating", emoji: "🧠" },
              { id: "food-cravings", label: "Food cravings", emoji: "🍫" },
              { id: "emotional-sensitivity", label: "Emotional sensitivity", emoji: "💔" },
              { id: "low-energy", label: "Low energy/motivation", emoji: "⚡" },
            ].map((symptom) => (
              <div
                key={symptom.id}
                className={`flex flex-col items-center justify-center border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${
                  emotionalSymptoms.includes(symptom.id) ? "bg-pink-50 border-pink-300" : ""
                }`}
                onClick={() => toggleEmotionalSymptom(symptom.id)}
              >
                <span className="text-2xl mb-1">{symptom.emoji}</span>
                <span className="text-sm text-center">{symptom.label}</span>
                <Checkbox
                  id={`emotional-${symptom.id}`}
                  checked={emotionalSymptoms.includes(symptom.id)}
                  onCheckedChange={() => toggleEmotionalSymptom(symptom.id)}
                  className="sr-only"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Other symptoms not listed?</h3>
          <Input
            placeholder="Type any other symptoms here..."
            value={otherSymptoms}
            onChange={(e) => setOtherSymptoms(e.target.value)}
          />
        </div>

        <Card className="w-full mb-8 bg-pink-50 border-pink-100">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <InfoIcon className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">About Period Symptoms</h3>
                <p className="text-sm text-gray-600">
                  It's normal to experience several symptoms during your menstrual cycle. Hormonal fluctuations can
                  affect your body in many ways beyond just bleeding.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  However, symptoms that significantly interfere with daily life are not normal and may indicate
                  conditions like PMDD (Premenstrual Dysphoric Disorder) or other reproductive health issues.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Tracking these symptoms can help your healthcare provider make better assessments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-gray-500 mb-4">
          Your data is private and secure. Dottie does not store your personal health information.
        </p>

        <div className="flex justify-between w-full mt-auto">
          <Link href="/assessment/pain">
            <Button variant="outline" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Link href="/assessment/results">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              Complete Assessment
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

