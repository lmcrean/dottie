import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, X } from "lucide-react"
import { getAIFeedback } from "../services/ai"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  userData: {
    age: string
    cycleLength: string
    periodDuration: string
    flowHeaviness: string
    painLevel: string
    symptoms: string[]
  }
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatModal({ isOpen, onClose, userData }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasInitialRecommendations, setHasInitialRecommendations] = useState(false)

  // Get initial recommendations when modal opens
  useEffect(() => {
    if (isOpen && !hasInitialRecommendations) {
      const getInitialRecommendations = async () => {
        setIsLoading(true)
        try {
          const aiResponse = await getAIFeedback(userData)
          if (aiResponse) {
            setMessages([{ 
              role: 'assistant', 
              content: aiResponse 
            }])
            setHasInitialRecommendations(true)
          } else {
            throw new Error("Empty response from AI")
          }
        } catch (error) {
          console.error('Error getting initial recommendations:', error)
          setMessages([{ 
            role: 'assistant', 
            content: "I apologize, but I'm having trouble analyzing your data right now. Please try again." 
          }])
        } finally {
          setIsLoading(false)
        }
      }
      getInitialRecommendations()
    }
  }, [isOpen, userData, hasInitialRecommendations])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const aiResponse = await getAIFeedback(userData, userMessage)
      if (aiResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
      } else {
        throw new Error("Empty response from AI")
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble providing a personalized response right now. Could you please rephrase your question or try again?" 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Reset messages when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([])
      setInput("")
      setHasInitialRecommendations(false)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Chat with Dottie</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Dottie anything..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}