"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Send, User, FileSearch, GraduationCap, Zap, Trash2, Edit, X } from "lucide-react"
import { useState } from "react"

const strategies = [
  {
    id: "direct",
    name: "Direct Extraction",
    icon: FileText,
    color: "blue",
    description: "Straightforward field extraction",
    fullDescription: "Directly extracts data using the defined form fields as questions.",
  },
  {
    id: "role",
    name: "Role-Based Prompt",
    icon: User,
    color: "purple",
    description: "AI assumes expert role",
    fullDescription: "AI assumes an expert medical role to extract information.",
  },
  {
    id: "summary",
    name: "Summary-First Chain",
    icon: FileSearch,
    color: "green",
    description: "Summarize then extract",
    fullDescription: "Generates a summary first, then extracts from the summary.",
  },
  {
    id: "fewShot",
    name: "Few-Shot Learning",
    icon: GraduationCap,
    color: "orange",
    description: "Learn from examples",
    fullDescription: "Provides examples to the model to guide its output.",
  },
  {
    id: "hybrid",
    name: "Hybrid Strategy",
    icon: Zap,
    color: "teal",
    description: "Custom pipeline",
    fullDescription: "Combines multiple strategies in a custom pipeline.",
  },
]

interface ClinicalNoteInputProps {
  value: string
  onChange: (value: string) => void
  isRunning: boolean
  selectedStrategies: string[]
  onStrategyChange: (strategies: string[]) => void
}

export function ClinicalNoteInput({
  value,
  onChange,
  isRunning,
  selectedStrategies,
  onStrategyChange,
}: ClinicalNoteInputProps) {
  const [configuredStrategy, setConfiguredStrategy] = useState<string | null>(
    selectedStrategies.length > 0 ? selectedStrategies[0] : null,
  )

  const [fewShotExamples, setFewShotExamples] = useState([
    {
      id: 1,
      input: "45yo male w/ chest pain. DOB: 01/15/1979.",
      output: '{ "dob": "01/15/1979" }',
    },
  ])

  const toggleStrategy = (strategyId: string) => {
    if (selectedStrategies.includes(strategyId)) {
      onStrategyChange(selectedStrategies.filter((id) => id !== strategyId))
      if (configuredStrategy === strategyId) {
        setConfiguredStrategy(null)
      }
    } else {
      onStrategyChange([...selectedStrategies, strategyId])
      setConfiguredStrategy(strategyId)
    }
  }

  const addFewShotExample = () => {
    setFewShotExamples([
      ...fewShotExamples,
      {
        id: Date.now(),
        input: "",
        output: "",
      },
    ])
  }

  const removeFewShotExample = (id: number) => {
    setFewShotExamples(fewShotExamples.filter((ex) => ex.id !== id))
  }

  const updateFewShotExample = (id: number, field: "input" | "output", value: string) => {
    setFewShotExamples(fewShotExamples.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)))
  }

  const renderStrategyConfiguration = () => {
    if (!configuredStrategy) return null

    const strategy = strategies.find((s) => s.id === configuredStrategy)
    if (!strategy) return null

    const Icon = strategy.icon

    const bgColorClass =
      strategy.color === "blue"
        ? "bg-blue-50 border-blue-200"
        : strategy.color === "purple"
          ? "bg-purple-50 border-purple-200"
          : strategy.color === "green"
            ? "bg-green-50 border-green-200"
            : strategy.color === "orange"
              ? "bg-orange-50 border-orange-200"
              : "bg-teal-50 border-teal-200"

    const textColorClass =
      strategy.color === "blue"
        ? "text-blue-900"
        : strategy.color === "purple"
          ? "text-purple-900"
          : strategy.color === "green"
            ? "text-green-900"
            : strategy.color === "orange"
              ? "text-orange-900"
              : "text-teal-900"

    const iconColorClass =
      strategy.color === "blue"
        ? "text-blue-600"
        : strategy.color === "purple"
          ? "text-purple-600"
          : strategy.color === "green"
            ? "text-green-600"
            : strategy.color === "orange"
              ? "text-orange-600"
              : "text-teal-600"

    return (
      <Card className={`p-4 mb-6 ${bgColorClass}`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${iconColorClass} mt-0.5`} />
          <div className="flex-1">
            <h3 className={`font-semibold text-base ${textColorClass} mb-1`}>
              {strategy.name}
              {strategy.id === "summary" && " Instructions"}
              {strategy.id === "fewShot" && " Configuration"}
            </h3>
            <p className="text-sm text-gray-700 mb-4">{strategy.fullDescription}</p>

            {/* Direct Extraction - No additional config needed */}
            {strategy.id === "direct" && (
              <div className="text-sm text-gray-600">
                This strategy uses the form fields defined below as direct questions to the model.
              </div>
            )}

            {/* Role-Based Prompt Configuration */}
            {strategy.id === "role" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Expert Role</label>
                  <input
                    type="text"
                    placeholder="e.g., experienced cardiologist, board-certified neurologist"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    defaultValue="medical records specialist"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Context</label>
                  <textarea
                    placeholder="Any additional instructions for the AI role..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-20 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Summary-First Chain Configuration */}
            {strategy.id === "summary" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Summary Generation Instructions
                  </label>
                  <textarea
                    placeholder="e.g., Summarize the patient's history, diagnoses..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-20 resize-none"
                    defaultValue="Summarize the patient's history, diagnoses..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Focus Areas</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded text-green-600" />
                        <span className="text-sm text-gray-700">Demographics</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded text-green-600" />
                        <span className="text-sm text-gray-700">Diagnoses</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-green-600" />
                        <span className="text-sm text-gray-700">Medications</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-green-600" />
                        <span className="text-sm text-gray-700">Procedures</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Length Preference</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Brief</option>
                      <option selected>Moderate</option>
                      <option>Detailed</option>
                    </select>
                    <label className="flex items-center gap-2 mt-3">
                      <input type="checkbox" className="rounded text-green-600" />
                      <span className="text-sm text-gray-700">Auto-approve summary</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Few-Shot Learning Configuration */}
            {strategy.id === "fewShot" && (
              <div className="space-y-4">
                {fewShotExamples.map((example, index) => (
                  <div key={example.id} className="border border-orange-200 rounded-lg p-4 bg-white relative">
                    <button
                      onClick={() => removeFewShotExample(example.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <h4 className="font-medium text-sm text-gray-900 mb-3">Example {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Clinical Note Input</label>
                        <textarea
                          value={example.input}
                          onChange={(e) => updateFewShotExample(example.id, "input", e.target.value)}
                          placeholder="Enter example clinical note..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Expected JSON Output</label>
                        <textarea
                          value={example.output}
                          onChange={(e) => updateFewShotExample(example.id, "output", e.target.value)}
                          placeholder="Enter expected JSON output..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addFewShotExample}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                >
                  + Add Example
                </Button>
              </div>
            )}

            {/* Hybrid Strategy Configuration */}
            {strategy.id === "hybrid" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Pipeline Steps</label>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure the sequence of strategies to apply in your custom pipeline.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-white border border-teal-200 rounded">
                      <span className="text-sm font-medium text-gray-700">1.</span>
                      <select className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                        <option>Summary-First Chain</option>
                        <option>Direct Extraction</option>
                        <option>Role-Based Prompt</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white border border-teal-200 rounded">
                      <span className="text-sm font-medium text-gray-700">2.</span>
                      <select className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                        <option>Direct Extraction</option>
                        <option>Summary-First Chain</option>
                        <option>Role-Based Prompt</option>
                      </select>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 text-teal-600 bg-transparent">
                    + Add Step
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Strategy Selector</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {strategies.map((strategy) => {
            const Icon = strategy.icon
            const isSelected = selectedStrategies.includes(strategy.id)

            return (
              <Card
                key={strategy.id}
                onClick={() => toggleStrategy(strategy.id)}
                className={`p-4 cursor-pointer transition-all hover:shadow-md relative min-w-[180px] flex-shrink-0 ${
                  isSelected ? "border-2 border-blue-500 bg-blue-50" : "border-2 border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Checkbox indicator */}
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
                <div
                  className={`p-2 rounded-lg mb-2 w-fit ${
                    strategy.color === "blue"
                      ? "bg-blue-100"
                      : strategy.color === "purple"
                        ? "bg-purple-100"
                        : strategy.color === "green"
                          ? "bg-green-100"
                          : strategy.color === "orange"
                            ? "bg-orange-100"
                            : "bg-teal-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      strategy.color === "blue"
                        ? "text-blue-600"
                        : strategy.color === "purple"
                          ? "text-purple-600"
                          : strategy.color === "green"
                            ? "text-green-600"
                            : strategy.color === "orange"
                              ? "text-orange-600"
                              : "text-teal-600"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{strategy.name}</h3>
                <p className="text-xs text-gray-600">{strategy.description}</p>
              </Card>
            )
          })}
        </div>
      </div>

      {renderStrategyConfiguration()}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Clinical Note Input</h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Context Used: 0%</span>
            <span>Tokens: 0</span>
            <span>Characters: {value.length}</span>
          </div>
        </div>

        <Card className="p-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter clinical note here or use preprocessing tools below..."
            className="w-full h-64 resize-none focus:outline-none text-sm text-gray-700 font-mono"
            disabled={isRunning}
          />
        </Card>

        <Button className="mt-4 bg-green-600 hover:bg-green-700">
          <Send className="w-4 h-4 mr-2" />
          Send for Preprocessing
        </Button>
      </div>

      <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📋</span>
          <h3 className="font-semibold text-gray-900">Input & Preprocessing</h3>
        </div>
        <p className="text-sm text-gray-700 mb-3">Clinical Note Input</p>
        <textarea
          placeholder="Enter clinical note here or use 'Combine Staged Notes' from Developer Mode..."
          className="w-full h-32 px-3 py-2 border border-yellow-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
        />

        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-900 mb-2">Preprocessing Pipeline</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span className="text-sm text-gray-700">Strip Extra Whitespace</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span className="text-sm text-gray-700">Remove Special Characters</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-sm text-gray-700">Apply Regex Rules</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-sm text-gray-700">Normalize Line Spacing</span>
            </label>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium">
              Context Window Used: 0%
            </span>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-xs text-gray-700">Auto-extract</span>
            </label>
          </div>
        </div>

        <Button className="mt-4 bg-green-600 hover:bg-green-700 w-full">
          <span className="mr-2">⚙️</span>
          Apply Preprocessing
        </Button>
      </Card>

      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h3 className="font-semibold text-gray-900">Form Fields & Prompt Variables</h3>
          </div>
          <span className="text-sm text-purple-700 font-medium">2 fields</span>
        </div>
        <p className="text-sm text-gray-700 mb-4">Configure extraction fields and competitive branching</p>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs text-gray-600 mb-1 block">Load Form:</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Select a form...</option>
              <option>mRS Score</option>
              <option>Patient Demographics</option>
              <option>Clinical Assessment</option>
            </select>
          </div>
          <Button variant="outline" size="sm" className="mt-5 bg-transparent">
            Load Questions
          </Button>
          <div className="flex-1">
            <label className="text-xs text-gray-600 mb-1 block">Model:</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Default (ooba_mistral)</option>
            </select>
          </div>
          <Button variant="outline" size="sm" className="mt-5 bg-blue-600 text-white hover:bg-blue-700">
            + Add Field
          </Button>
        </div>

        {/* Form Fields Table */}
        <div className="overflow-x-auto border border-purple-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-purple-100">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">ID</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Question</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Priority</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Context Hints</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Validation</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t border-purple-200">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    defaultValue="dob"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    defaultValue="Patient's date of birth?"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    <option>String</option>
                    <option>Integer</option>
                    <option>Date</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    defaultValue="born, DOB, birth date"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    defaultValue="Date format"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-purple-200">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    defaultValue="age_diagnosis"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    defaultValue="Patient's age at diagnosis?"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    <option>Integer</option>
                    <option>String</option>
                    <option>Date</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    defaultValue="diagnosed at, age when"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    defaultValue="Numeric, 0-120"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
