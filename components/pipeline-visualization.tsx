"use client"

import { Card } from "@/components/ui/card"
import { Shield, FileCheck, FileText, Zap, CheckCircle, Database, Target, ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"

const stages = [
  {
    id: 1,
    name: "De-Identification",
    icon: Shield,
    color: "purple",
    desc: "Remove PHI",
    duration: 300,
    details: {
      input: "Raw clinical note with PHI",
      output: "De-identified note with masked entities",
      metrics: "142 tokens processed, 8 entities masked",
    },
  },
  {
    id: 2,
    name: "Preprocessing",
    icon: FileCheck,
    color: "blue",
    desc: "Clean & normalize",
    duration: 100,
    details: {
      input: "De-identified clinical note",
      output: "Cleaned and normalized text",
      metrics: "Whitespace normalized, special chars removed",
    },
  },
  {
    id: 3,
    name: "Snippet Extraction",
    icon: FileText,
    color: "teal",
    desc: "Extract sections",
    duration: 200,
    details: {
      input: "Preprocessed clinical note",
      output: "Relevant snippets for each field",
      metrics: "12 snippets extracted across 8 fields",
    },
  },
  {
    id: 4,
    name: "LLM Inference",
    icon: Zap,
    color: "orange",
    desc: "AI extraction",
    duration: 2500,
    details: {
      input: "Field-specific snippets + prompts",
      output: "Structured JSON with extracted fields",
      metrics: "Model: gemini-2.5-pro, 1,247 tokens, 2.3s",
    },
  },
  {
    id: 5,
    name: "Validation",
    icon: CheckCircle,
    color: "green",
    desc: "Verify output",
    duration: 150,
    details: {
      input: "Raw LLM output JSON",
      output: "Validated and sanitized data",
      metrics: "All fields passed validation checks",
    },
  },
  {
    id: 6,
    name: "Cache Storage",
    icon: Database,
    color: "indigo",
    desc: "Store results",
    duration: 50,
    details: {
      input: "Validated extraction results",
      output: "Cached for future use",
      metrics: "Stored in Redis, 45ms write time",
    },
  },
  {
    id: 7,
    name: "mRS Calculation",
    icon: Target,
    color: "red",
    desc: "Final score",
    duration: 100,
    details: {
      input: "All extracted clinical fields",
      output: "Modified Rankin Scale score",
      metrics: "mRS: 3 (Moderate disability)",
    },
  },
]

interface PipelineVisualizationProps {
  isRunning: boolean
}

export function PipelineVisualization({ isRunning }: PipelineVisualizationProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [expandedStages, setExpandedStages] = useState<number[]>([])
  const [mrsScore, setMrsScore] = useState<number | null>(null)
  const [totalDuration, setTotalDuration] = useState<number>(0)

  useEffect(() => {
    if (isRunning) {
      setCurrentStage(0)
      setCompletedStages([])
      setMrsScore(null)
      setExpandedStages([])
      setTotalDuration(0)

      let elapsedTime = 0

      stages.forEach((stage, index) => {
        setTimeout(
          () => {
            setCurrentStage(stage.id)
            setExpandedStages((prev) => [...prev, stage.id])

            setTimeout(() => {
              setCompletedStages((prev) => [...prev, stage.id])
              elapsedTime += stage.duration
              setTotalDuration(elapsedTime)

              setTimeout(() => {
                setExpandedStages((prev) => prev.filter((id) => id !== stage.id))
              }, 2000)

              if (index === stages.length - 1) {
                setMrsScore(3)
              }
            }, stage.duration)
          },
          stages.slice(0, index).reduce((sum, s) => sum + s.duration, 0),
        )
      })
    }
  }, [isRunning])

  const toggleStageExpansion = (stageId: number) => {
    setExpandedStages((prev) => (prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]))
  }

  if (!isRunning && completedStages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="text-6xl mb-4">🔬</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Ready</h3>
        <p className="text-sm text-gray-600 mb-6">
          Select strategies and click "Run Selected" to activate the 7-stage processing pipeline.
        </p>

        {/* Preview of 7 stages */}
        <div className="w-full max-w-sm space-y-2">
          {stages.map((stage) => {
            const Icon = stage.icon
            return (
              <div
                key={stage.id}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-left"
              >
                <div className={`w-8 h-8 rounded-full bg-${stage.color}-100 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${stage.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900">{stage.name}</div>
                  <div className="text-xs text-gray-500">{stage.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Processing Pipeline</h2>
        </div>
        {totalDuration > 0 && (
          <div className="text-xs text-gray-600">
            {completedStages.length}/{stages.length} • {(totalDuration / 1000).toFixed(1)}s
          </div>
        )}
      </div>

      {/* Stage Cards */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {stages.map((stage) => {
          const Icon = stage.icon
          const isComplete = completedStages.includes(stage.id)
          const isCurrent = currentStage === stage.id && !isComplete
          const isExpanded = expandedStages.includes(stage.id)

          return (
            <Card
              key={stage.id}
              className={`transition-all border-2 ${
                isComplete
                  ? "border-green-500 bg-green-50"
                  : isCurrent
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
              }`}
            >
              {/* Stage Header - Always Visible */}
              <button
                onClick={() => toggleStageExpansion(stage.id)}
                disabled={!isComplete && !isCurrent}
                className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50/50 transition-colors disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isComplete ? "bg-green-500" : isCurrent ? "bg-blue-500 animate-pulse" : "bg-gray-300"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900">{stage.name}</h3>
                        <p className="text-xs text-gray-600">{stage.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {isCurrent && (
                          <span className="text-xs font-medium text-blue-600 px-2 py-1 bg-blue-100 rounded whitespace-nowrap">
                            Processing...
                          </span>
                        )}
                        {isComplete && (
                          <span className="text-xs font-medium text-green-600 px-2 py-1 bg-green-100 rounded whitespace-nowrap">
                            ✓ Complete
                          </span>
                        )}
                        {(isComplete || isCurrent) && (
                          <div className="ml-1">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary info in collapsed view */}
                    {!isExpanded && (isComplete || isCurrent) && (
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-gray-700 w-16 flex-shrink-0">Input:</span>
                          <span className="text-gray-600 flex-1 line-clamp-1">{stage.details.input}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-gray-700 w-16 flex-shrink-0">Output:</span>
                          <span className="text-gray-600 flex-1 line-clamp-1">{stage.details.output}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-gray-700 w-16 flex-shrink-0">Metrics:</span>
                          <span className="text-gray-600 flex-1 line-clamp-1">{stage.details.metrics}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-gray-700 w-16 flex-shrink-0">Duration:</span>
                          <span className="text-gray-600">{stage.duration}ms</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (isComplete || isCurrent) && (
                <div className="px-4 pb-4 border-t border-gray-200 bg-white/50 animate-in slide-in-from-top-2">
                  <div className="pt-3 space-y-3 text-xs">
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Input:</div>
                      <div className="text-gray-600 bg-gray-50 p-2 rounded">{stage.details.input}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Output:</div>
                      <div className="text-gray-600 bg-gray-50 p-2 rounded">{stage.details.output}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Metrics:</div>
                      <div className="text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                        {stage.details.metrics}
                      </div>
                    </div>
                    <div className="text-gray-500 italic">Duration: {stage.duration}ms</div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Final mRS Score */}
      {mrsScore !== null && (
        <Card className="mt-4 p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-500 flex-shrink-0">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">mRS: {mrsScore}</div>
            <p className="text-sm font-medium text-gray-700">Modified Rankin Scale Score</p>
            <div className="mt-3 text-xs text-gray-600">
              Extraction completed in {(totalDuration / 1000).toFixed(1)}s
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
