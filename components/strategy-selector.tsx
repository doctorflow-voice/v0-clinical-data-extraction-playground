"use client"
import { FileText, User, FileSearch, GraduationCap, Zap, X } from "lucide-react"
import { Settings } from "lucide-react" // Declared the Settings variable

const strategies = [
  {
    id: "direct",
    name: "Direct Extraction",
    icon: FileText,
    color: "blue",
    description: "Straightforward field extraction",
  },
  {
    id: "role",
    name: "Role-Based Prompt",
    icon: User,
    color: "purple",
    description: "AI assumes expert role",
  },
  {
    id: "summary",
    name: "Summary-First Chain",
    icon: FileSearch,
    color: "green",
    description: "Summarize then extract",
  },
  {
    id: "fewShot",
    name: "Few-Shot Learning",
    icon: GraduationCap,
    color: "orange",
    description: "Learn from examples",
  },
  {
    id: "hybrid",
    name: "Hybrid Strategy",
    icon: Zap,
    color: "teal",
    description: "Custom pipeline",
  },
]

interface StrategySelectorProps {
  selectedStrategies: string[]
  onStrategyChange: (strategies: string[]) => void
}

export function StrategySelector({ selectedStrategies, onStrategyChange }: StrategySelectorProps) {
  const toggleStrategy = (strategyId: string) => {
    if (selectedStrategies.includes(strategyId)) {
      onStrategyChange(selectedStrategies.filter((id) => id !== strategyId))
    } else {
      onStrategyChange([...selectedStrategies, strategyId])
    }
  }

  const removeStrategy = (strategyId: string) => {
    onStrategyChange(selectedStrategies.filter((id) => id !== strategyId))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Prompt Strategies</h2>
      </div>

      {/* Selected Strategies Queue */}
      {selectedStrategies.length > 0 && (
        <div className="mb-4 space-y-2">
          {selectedStrategies.map((strategyId, index) => {
            const strategy = strategies.find((s) => s.id === strategyId)
            if (!strategy) return null
            const Icon = strategy.icon

            return (
              <div
                key={strategyId}
                className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <span className="text-sm font-semibold text-blue-700">{index + 1}.</span>
                <Icon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 flex-1">{strategy.name}</span>
                <button
                  onClick={() => removeStrategy(strategyId)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { strategies }
