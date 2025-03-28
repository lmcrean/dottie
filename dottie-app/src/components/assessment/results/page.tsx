import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DotIcon, MessageCircle, Heart, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { ChatModal } from "@/components/chat-modal"


// Define the types of menstrual patterns as per LogicTree.md
type MenstrualPattern = 
  | "regular" 
  | "irregular" 
  | "heavy" 
  | "pain" 
  | "developing"

interface PatternInfo {
  title: string
  description: string
  recommendations: Array<{
    icon: string
    title: string
    description: string
  }>
}

const patternData: Record<MenstrualPattern, PatternInfo> = {
  regular: {
    title: "Regular Menstrual Cycles",
    description: "Your menstrual cycles follow a normal, healthy pattern according to ACOG guidelines.",
    recommendations: [
      {
        icon: "📅",
        title: "Track Your Cycle",
        description: "Regular tracking will help you understand your patterns better and predict your next period."
      },
      {
        icon: "🏃‍♀️",
        title: "Exercise Regularly",
        description: "Light to moderate exercise can help reduce menstrual pain and improve mood."
      },
      {
        icon: "❤️",
        title: "Maintain a Balanced Diet",
        description: "Foods rich in iron, calcium, and omega-3 fatty acids can help manage period symptoms."
      },
      {
        icon: "🌙",
        title: "Prioritize Sleep",
        description: "Aim for 8-10 hours of sleep, especially during your period when fatigue is common."
      }
    ]
  },
  irregular: {
    title: "Irregular Timing Pattern",
    description: "Your cycle length is outside the typical range, which may indicate hormonal fluctuations.",
    recommendations: [
      {
        icon: "📅",
        title: "Track Your Cycle",
        description: "Keeping a detailed record can help identify patterns and share with healthcare providers."
      },
      {
        icon: "👩‍⚕️",
        title: "Consult a Healthcare Provider",
        description: "If your cycles are consistently irregular, consider discussing with a healthcare provider."
      },
      {
        icon: "🥗",
        title: "Focus on Nutrition",
        description: "A balanced diet can help support hormonal balance and regulate cycles."
      },
      {
        icon: "🧘‍♀️",
        title: "Stress Management",
        description: "High stress can affect your cycle. Consider yoga, meditation, or other relaxation techniques."
      }
    ]
  },
  heavy: {
    title: "Heavy or Prolonged Flow Pattern",
    description: "Your flow is heavier or longer than typical, which could impact your daily activities.",
    recommendations: [
      {
        icon: "🍳",
        title: "Iron-rich Foods",
        description: "Include lean red meat, spinach, beans, and fortified cereals to prevent iron deficiency."
      },
      {
        icon: "💧",
        title: "Stay Hydrated",
        description: "Drink plenty of water to help replace fluids lost during your period."
      },
      {
        icon: "👩‍⚕️",
        title: "Medical Evaluation",
        description: "If your flow regularly soaks through pads/tampons hourly, consult a healthcare provider."
      },
      {
        icon: "⏰",
        title: "Plan Ahead",
        description: "Keep extra supplies and a change of clothes available during heavy flow days."
      }
    ]
  },
  pain: {
    title: "Pain-Predominant Pattern",
    description: "Your menstrual pain is higher than typical and may interfere with daily activities.",
    recommendations: [
      {
        icon: "🔥",
        title: "Heat Therapy",
        description: "Apply a heating pad to your lower abdomen to help relieve menstrual cramps."
      },
      {
        icon: "💊",
        title: "Pain Management",
        description: "Over-the-counter pain relievers like ibuprofen can help reduce pain and inflammation."
      },
      {
        icon: "🧘‍♀️",
        title: "Gentle Exercise",
        description: "Light activities like walking or stretching can help alleviate menstrual pain."
      },
      {
        icon: "👩‍⚕️",
        title: "Medical Support",
        description: "If pain is severe, talk to a healthcare provider about additional treatment options."
      }
    ]
  },
  developing: {
    title: "Developing Pattern",
    description: "Your cycles are still establishing a regular pattern, which is normal during adolescence.",
    recommendations: [
      {
        icon: "⏱️",
        title: "Be Patient",
        description: "It's normal for your cycle to be irregular during adolescence. It can take 2-3 years to establish a regular pattern."
      },
      {
        icon: "📅",
        title: "Track Your Cycle",
        description: "Start keeping a record of your periods to observe patterns as they develop."
      },
      {
        icon: "🧠",
        title: "Learn About Your Body",
        description: "Understanding menstrual health can help you recognize what's normal for you."
      },
      {
        icon: "👩‍👧",
        title: "Talk to Someone You Trust",
        description: "Discuss concerns with a parent, school nurse, or healthcare provider."
      }
    ]
  }
}

export default function ResultsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [pattern, setPattern] = useState<MenstrualPattern>("developing")
  const [age, setAge] = useState<string>("")
  const [cycleLength, setCycleLength] = useState<string>("")
  const [periodDuration, setPeriodDuration] = useState<string>("")
  const [flowLevel, setFlowLevel] = useState<string>("")
  const [painLevel, setPainLevel] = useState<string>("")
  const [symptoms, setSymptoms] = useState<string[]>([])

  useEffect(() => {
    // Get data from session storage
    const storedAge = sessionStorage.getItem("age")
    const storedCycleLength = sessionStorage.getItem("cycleLength")
    const storedPeriodDuration = sessionStorage.getItem("periodDuration")
    const storedFlowLevel = sessionStorage.getItem("flowLevel")
    const storedPainLevel = sessionStorage.getItem("painLevel")
    const storedSymptoms = sessionStorage.getItem("symptoms")
    
    if (storedAge) setAge(storedAge)
    if (storedCycleLength) setCycleLength(storedCycleLength)
    if (storedPeriodDuration) setPeriodDuration(storedPeriodDuration)
    if (storedFlowLevel) setFlowLevel(storedFlowLevel)
    if (storedPainLevel) setPainLevel(storedPainLevel)
    if (storedSymptoms) {
      try {
        setSymptoms(JSON.parse(storedSymptoms))
      } catch (e) {
        console.error("Error parsing symptoms:", e)
      }
    }

    // Determine the pattern based on LogicTree logic
    let determinedPattern: MenstrualPattern = "developing"

    // Check for irregular timing (O1)
    if (storedCycleLength === "Irregular" || storedCycleLength === "Less than 21 days" || storedCycleLength === "More than 45 days") {
      determinedPattern = "irregular"
    } 
    // Check for heavy flow (O2)
    else if (storedPeriodDuration === "More than 7 days" || storedPeriodDuration === "8+ days" || storedFlowLevel === "Heavy") {
      determinedPattern = "heavy"
    } 
    // Check for pain-predominant (O3)
    else if (storedPainLevel === "Severe") {
      determinedPattern = "pain"
    } 
    // Check for regular cycles (O4)
    else if (
      (storedCycleLength && storedCycleLength.includes("days")) && 
      (storedPeriodDuration && storedPeriodDuration.includes("days")) &&
      storedFlowLevel !== "Heavy" &&
      storedPainLevel !== "Severe"
    ) {
      determinedPattern = "regular"
    } 
    // Default to developing pattern (O5)
    else if (storedAge && storedAge.includes("13-17")) {
      determinedPattern = "developing"
    }

    setPattern(determinedPattern)
  }, [])

  const patternInfo = patternData[pattern]

  // Calculate progress bar widths based on values
  const getProgressWidth = (value: string) => {
    if (value.includes("Less than")) return "20%"
    if (value.includes("More than")) return "80%"
    if (value === "Heavy") return "80%"
    if (value === "Severe") return "80%"
    if (value === "Moderate") return "50%"
    if (value === "Light") return "20%"
    if (value === "Mild") return "20%"
    return "50%"
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/public/chatb.png" alt="Dottie Logo" width={32} height={32} />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <Link to="/" className="text-gray-500">
          X
        </Link>
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold mb-2">Your Menstrual Pattern is {patternInfo.title}</h1>
              <p className="text-sm text-gray-600">
                {patternInfo.description}
              </p>
            </div>

            <div className="flex gap-3 mb-4">
              <Button className="flex-1 bg-pink-500 hover:bg-pink-600" onClick={() => setIsChatOpen(true)}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Dottie
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Save Results
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              *According to the American College of Obstetricians and Gynecologists
            </p>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Cycle Summary</h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Age</span>
                <span className="text-sm text-gray-500">{age || "Not provided"}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: getProgressWidth(age) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cycle Length</span>
                <span className="text-sm text-gray-500">{cycleLength || "Not provided"}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: getProgressWidth(cycleLength) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Period Duration</span>
                <span className="text-sm text-gray-500">{periodDuration || "Not provided"}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: getProgressWidth(periodDuration) }}></div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Symptoms</h3>
              <div className="grid grid-cols-2 gap-2">
                {symptoms.length > 0 ? (
                  symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-sm bg-pink-100 flex items-center justify-center">
                        <span className="text-pink-500 text-xs">✓</span>
                      </div>
                      <span className="text-sm">{symptom}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No symptoms selected</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Pain Level</span>
                <span className="text-sm text-gray-500">{painLevel || "Not provided"}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: getProgressWidth(painLevel) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Flow Heaviness</span>
                <span className="text-sm text-gray-500">{flowLevel || "Not provided"}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: getProgressWidth(flowLevel) }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Personalized Recommendations</h2>

          <div className="space-y-4">
            {patternInfo.recommendations.map((rec, index) => (
              <div key={index} className="flex gap-3">
                <div className="bg-pink-100 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-500">{rec.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-gray-600">
                    {rec.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/assessment/resources">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            View Resources & Next Steps
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>

        <ChatModal 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          userData={{
            age,
            cycleLength,
            periodDuration,
            flowHeaviness: flowLevel,
            painLevel,
            symptoms
          }} 
        />
      </main>
    </div>
  )
}

