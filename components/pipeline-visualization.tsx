"use client"

import { Card } from "@/components/ui/card"
import { Shield, FileCheck, FileText, Zap, CheckCircle, Database, Target } from "lucide-react"
import { useEffect, useState } from "react"

const stages = [
  { id: 1, name: "De-ID", icon: Shield, color: "purple", desc: "Remove PHI" },
  { id: 2, name: "Preprocessing", icon: FileCheck, color: "blue", desc: "Clean text" },
  { id: 3, name: "Snippets", icon: FileText, color: "teal", desc: "Extract sections" },
  { id: 4, name: "LLM", icon: Zap, color: "orange", desc: "AI extraction" },
  { id: 5, name: "Validation", icon: CheckCircle, color: "green", desc: "Verify output" },
  { id: 6, name: "Cache", icon: Database, color: "indigo", desc: "Store results" },
  { id: 7, name: "mRS", icon: Target, color: "red", desc: "Final score" },
]

interface PipelineVisualizationProps {
  isRunning: boolean
}

export function PipelineVisualization({ isRunning }: PipelineVisualizationProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [mrsScore, setMrsScore] = useState<number | null>(null)

  useEffect(() => {
    if (isRunning) {
      setCurrentStage(0)
      setCompletedStages([])
      setMrsScore(null)

      // Simulate progressive stages
      stages.forEach((stage, index) => {
        setTimeout(() => {
          setCurrentStage(index + 1)
          setTimeout(() => {
            setCompletedStages((prev) => [...prev, stage.id])
            if (index === stages.length - 1) {
              setMrsScore(3)
            }
          }, 800)
        }, index * 1400)
      })
    }
  }, [isRunning])

  if (!isRunning && completedStages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="text-6xl mb-4">🔬</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Inactive</h3>
        <p className="text-sm text-gray-600">
          Select strategies and click "Run Selected" to activate the 7-stage processing pipeline.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Processing Pipeline</h2>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => {
          const Icon = stage.icon
          const isComplete = completedStages.includes(stage.id)
          const isCurrent = currentStage === stage.id
          const isPending = !isComplete && !isCurrent

          return (
            <Card
              key={stage.id}
              className={`p-4 transition-all ${
                isComplete
                  ? "border-green-500 bg-green-50"
                  : isCurrent
                    ? "border-blue-500 bg-blue-50 animate-pulse"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete ? "bg-green-500" : isCurrent ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900">{stage.name}</h3>
                  <p className="text-xs text-gray-600">{stage.desc}</p>
                </div>
                {isCurrent && <div className="text-xs font-medium text-blue-600">Processing...</div>}
                {isComplete && <div className="text-xs font-medium text-green-600">✓ Complete</div>}
              </div>
            </Card>
          )
        })}
      </div>

      {mrsScore !== null && (
        <Card className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-500">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">mRS: {mrsScore}</div>
            <p className="text-sm text-gray-700">Modified Rankin Scale Score</p>
            <div className="mt-4 text-xs text-gray-600">Extraction completed in 9.8s</div>
          </div>
        </Card>
      )}
    </div>
  )
}
