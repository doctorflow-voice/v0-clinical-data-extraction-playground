"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Wrench, Scissors, Brain, CheckCircle2, Database, Target, ChevronDown, ChevronUp } from "lucide-react"
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
    icon: Wrench,
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
    icon: Scissors,
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
    icon: Brain,
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
    icon: CheckCircle2,
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

  const [deIdEnabled, setDeIdEnabled] = useState(true)
  const [deIdMethod, setDeIdMethod] = useState("placeholder")
  const [preprocessOps, setPreprocessOps] = useState({
    stripWhitespace: true,
    normalizeSpacing: true,
    removeSpecialChars: false,
  })
  const [llmRouting, setLlmRouting] = useState("auto")

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

  const renderStageExpandedContent = (stageId: number) => {
    switch (stageId) {
      case 1: // De-Identification
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-yellow-800">
                <span>ℹ️</span>
                <span>Required for external API usage. Optional for local models.</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <label htmlFor="enable-deid" className="text-sm font-medium text-gray-900">
                Enable De-Identification
              </label>
              <input
                type="checkbox"
                id="enable-deid"
                checked={deIdEnabled}
                onChange={(e) => setDeIdEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">De-ID Method</div>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="deid-method"
                    value="placeholder"
                    checked={deIdMethod === "placeholder"}
                    onChange={(e) => setDeIdMethod(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Placeholder</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">→ Patient [NAME], DOB [DATE]</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="deid-method"
                    value="asterisk"
                    checked={deIdMethod === "asterisk"}
                    onChange={(e) => setDeIdMethod(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Asterisk Masking</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">→ Patient *****, DOB **********</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="deid-method"
                    value="philter"
                    checked={deIdMethod === "philter"}
                    onChange={(e) => setDeIdMethod(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Philter Pipeline</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">→ Patient Alex Johnson, DOB 03/22/1970</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Before/After Preview</div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">Before:</div>
                  <div className="text-xs text-gray-600 font-mono">Patient John Smith, DOB 01/15/1965, MRN 123456</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">After:</div>
                  <div className="text-xs text-gray-600 font-mono">Patient [NAME], DOB [DATE], MRN [MRN]</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1 text-xs">
              <div className="font-semibold text-blue-900">Routing Impact</div>
              <div className="text-blue-700">• With De-ID: External API allowed</div>
              <div className="text-blue-700">• Without De-ID: Local only (HIPAA)</div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Input</div>
                <div className="text-sm font-semibold text-gray-900">80KB</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Output</div>
                <div className="text-sm font-semibold text-gray-900">82KB</div>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-xs text-red-500 mb-1">Change</div>
                <div className="text-sm font-semibold text-red-600">+2%</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Time</div>
                <div className="text-sm font-semibold text-gray-900">0.3s</div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View De-identified Text →
            </Button>
          </div>
        )

      case 2: // Preprocessing
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Operations</div>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preprocessOps.stripWhitespace}
                    onChange={(e) => setPreprocessOps({ ...preprocessOps, stripWhitespace: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Strip Whitespace</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">→ "Multiple spaces" → "Multiple spaces"</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preprocessOps.normalizeSpacing}
                    onChange={(e) => setPreprocessOps({ ...preprocessOps, normalizeSpacing: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Normalize Spacing</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">
                      → "Line\n\n\n\nbreaks" → "Line\n\nbreaks"
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preprocessOps.removeSpecialChars}
                    onChange={(e) => setPreprocessOps({ ...preprocessOps, removeSpecialChars: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Remove Special Chars</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">→ "Dose: 100mg/day" → "Dose 100mgday"</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Real-time Preview</div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">Before:</div>
                  <div className="text-xs text-gray-600 font-mono">"Patient presents with\n\n\n\nweakness"</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">After:</div>
                  <div className="text-xs text-gray-600 font-mono">"Patient presents with\n\nweakness"</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1 text-xs">
              <div className="font-semibold text-blue-900">Metrics</div>
              <div className="text-blue-700">• Characters removed: 4,000</div>
              <div className="text-blue-700">• Lines normalized: 342</div>
              <div className="text-blue-700">• Token reduction: 5%</div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Input</div>
                <div className="text-sm font-semibold text-gray-900">82KB</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Output</div>
                <div className="text-sm font-semibold text-gray-900">78KB</div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-green-500 mb-1">Change</div>
                <div className="text-sm font-semibold text-green-600">-5%</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Tokens</div>
                <div className="text-xs font-semibold text-gray-900">20.5K→19.5K</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Time</div>
                <div className="text-sm font-semibold text-gray-900">0.1s</div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Cleaned Text →
            </Button>
          </div>
        )

      case 3: // Snippet Extraction
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Keywords Found</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { word: "walking", count: 3 },
                  { word: "gait", count: 2 },
                  { word: "ADL", count: 4 },
                  { word: "wheelchair", count: 1 },
                  { word: "bathing", count: 2 },
                  { word: "dressing", count: 3 },
                  { word: "ambulatory", count: 1 },
                  { word: "assist", count: 5 },
                ].map((kw) => (
                  <div
                    key={kw.word}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 cursor-pointer"
                  >
                    {kw.word} ({kw.count})
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Token Reduction</div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">🔽 85% reduction</div>
                <div className="w-full bg-purple-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <div className="text-xs text-purple-700 mt-2">(66KB saved)</div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-1 text-xs">
              <div className="font-semibold text-purple-900">Extraction Summary</div>
              <div className="text-purple-700">• Total matches: 15</div>
              <div className="text-purple-700">• Windows extracted: 12</div>
              <div className="text-purple-700">• Overlaps merged: 3</div>
              <div className="text-purple-700">• Avg context: ±500 chars</div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Input</div>
                <div className="text-sm font-semibold text-gray-900">78KB</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Output</div>
                <div className="text-sm font-semibold text-gray-900">12KB</div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-green-500 mb-1">Change</div>
                <div className="text-sm font-semibold text-green-600">-85%</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Time</div>
                <div className="text-sm font-semibold text-gray-900">0.2s</div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Extracted Snippets →
            </Button>
          </div>
        )

      case 4: // LLM Inference
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Model Selection</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-gray-900">Local: Gemma 7B</div>
                  <div className="text-xs text-gray-600">Cost: $0</div>
                  <div className="text-xs text-gray-600">Speed: 2.5s</div>
                  <div className="text-xs text-gray-600">Quality: 85%</div>
                  <div className="text-xs text-green-600 font-medium">✓ Ready</div>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-gray-900">External: Gemini</div>
                  <div className="text-xs text-gray-600">Cost: $0.03</div>
                  <div className="text-xs text-gray-600">Speed: 0.8s</div>
                  <div className="text-xs text-gray-600">Quality: 92%</div>
                  <div className="text-xs text-yellow-600 font-medium">⚠️ Need De-ID</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Routing Strategy</div>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="llm-routing"
                    value="auto"
                    checked={llmRouting === "auto"}
                    onChange={(e) => setLlmRouting(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Auto-route (recommended)</div>
                    <div className="text-xs text-gray-600">Chooses best based on note type</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="llm-routing"
                    value="local"
                    checked={llmRouting === "local"}
                    onChange={(e) => setLlmRouting(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Force Local</div>
                    <div className="text-xs text-gray-600">Always use Gemma 7B</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="llm-routing"
                    value="external"
                    checked={llmRouting === "external"}
                    onChange={(e) => setLlmRouting(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Force External</div>
                    <div className="text-xs text-gray-600">Always use Gemini (requires de-ID)</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Live Progress</div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                <div className="text-xs">
                  <span className="font-medium text-blue-900">Extracting:</span>{" "}
                  <span className="text-blue-700">walking_ability</span>
                </div>
                <div className="text-xs">
                  <span className="font-medium text-blue-900">Streaming:</span>{" "}
                  <span className="text-blue-700 font-mono">"With he|"</span>
                </div>
                <div className="text-xs text-blue-700">Token: 47/150 | Elapsed: 1.2s</div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-900">Fields processed: 4/5</div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { field: "walking_ability", time: "0.8s", status: "✓" },
                      { field: "self_care_adls", time: "0.9s", status: "✓" },
                      { field: "usual_activities", time: "0.7s", status: "✓" },
                      { field: "residual_symptoms", time: "0.6s", status: "✓" },
                      { field: "vital_status", time: "-", status: "🔄 Processing..." },
                    ].map((row) => (
                      <tr key={row.field} className="hover:bg-gray-50">
                        <td className="p-2 text-gray-900">{row.field}</td>
                        <td className="p-2 text-gray-600 text-right">{row.time}</td>
                        <td className="p-2 text-right">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Full Prompt
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Raw Outputs →
              </Button>
            </div>
          </div>
        )

      case 5: // Validation & Retry
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Validation Results</div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="p-2 text-left text-gray-700">Field</th>
                      <th className="p-2 text-center text-gray-700">Try 1</th>
                      <th className="p-2 text-center text-gray-700">Try 2</th>
                      <th className="p-2 text-center text-gray-700">Try 3</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { field: "walking_ability", t1: "✅", t2: "", t3: "" },
                      { field: "self_care_adls", t1: "❌", t2: "✅", t3: "" },
                      { field: "usual_activities", t1: "✅", t2: "", t3: "" },
                      { field: "residual_symptoms", t1: "❌", t2: "❌", t3: "🔄" },
                      { field: "vital_status", t1: "✅", t2: "", t3: "" },
                    ].map((row) => (
                      <tr key={row.field} className="hover:bg-gray-50">
                        <td className="p-2 text-gray-900">{row.field}</td>
                        <td className="p-2 text-center">{row.t1}</td>
                        <td className="p-2 text-center">{row.t2}</td>
                        <td className="p-2 text-center">{row.t3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span>✅</span> <span className="text-gray-600">Valid</span>
              </div>
              <div className="flex items-center gap-1">
                <span>❌</span> <span className="text-gray-600">Invalid</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🔄</span> <span className="text-gray-600">Retry Queue</span>
              </div>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 space-y-1 text-xs">
              <div className="font-semibold text-cyan-900">Success Rates</div>
              <div className="text-cyan-700">First-try success: 60% (3/5 fields)</div>
              <div className="text-cyan-700">After retries: 80% (4/5 fields)</div>
              <div className="text-cyan-700">Manual review: 1 field queued</div>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View residual_symptoms Failures →
            </Button>
          </div>
        )

      case 6: // Cache Storage
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">File Operations Log</div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-gray-600">[2025-12-16 04:12:17] JSON saved</div>
                  <div className="text-gray-500">Path: /mrs_cache/118477832_b16a1a4961...json</div>
                  <div className="text-gray-500">Size: 3.2 KB | Fields: 5</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-600">[2025-12-16 04:12:17] CSV saved</div>
                  <div className="text-gray-500">Path: /mrs_cache/b16a1a4961...csv</div>
                  <div className="text-gray-500">Size: 2.8 KB | Format: HIPAA-compliant</div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-1 text-xs">
              <div className="font-semibold text-orange-900">Cache Statistics</div>
              <div className="text-orange-700">• Cache directory: 247 files</div>
              <div className="text-orange-700">• Total size: 1.2 GB</div>
              <div className="text-orange-700">• This session: +6 KB</div>
            </div>

            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Version History →
            </Button>
          </div>
        )

      case 7: // mRS Calculation
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Decision Tree</div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 font-mono text-xs space-y-2">
                <div>
                  <div className="text-gray-900">Death?</div>
                  <div className="text-gray-600 ml-2">──Yes──&gt; mRS 6</div>
                  <div className="text-green-600 ml-2">✅ No (vital_status = No)</div>
                  <div className="text-gray-600 ml-4">↓</div>
                </div>
                <div>
                  <div className="text-gray-900">Can Walk?</div>
                  <div className="text-gray-600 ml-2">──No──&gt; mRS 5</div>
                  <div className="text-yellow-600 ml-2">⚠️ With help (walking_ability = With help)</div>
                  <div className="text-gray-600 ml-4">↓</div>
                </div>
                <div>
                  <div className="text-gray-900">ADLs?────────────┐</div>
                  <div className="text-red-600 ml-2">⭐ Partially │</div>
                  <div className="text-gray-600 ml-4">↓ Full │</div>
                  <div className="text-red-600 ml-2 font-bold">mRS 3 ◄──────────┘</div>
                  <div className="text-red-600 ml-2 font-bold">[YOU ARE HERE]</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">Component Fields Contributing</div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="p-2 text-left text-gray-700">Field</th>
                      <th className="p-2 text-left text-gray-700">Answer</th>
                      <th className="p-2 text-right text-gray-700">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { field: "vital_status", answer: "No", conf: "0.95", color: "green" },
                      { field: "walking_ability", answer: "With help", conf: "0.92", color: "green" },
                      { field: "self_care_adls", answer: "Partially", conf: "0.88", color: "yellow" },
                      { field: "usual_activities", answer: "Partially", conf: "0.85", color: "yellow" },
                      { field: "residual_symptoms", answer: "Yes", conf: "0.90", color: "green" },
                    ].map((row) => (
                      <tr key={row.field} className="hover:bg-gray-50">
                        <td className="p-2 text-gray-900">{row.field}</td>
                        <td className="p-2 text-gray-700">{row.answer}</td>
                        <td className="p-2 text-right">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              row.color === "green" ? "text-green-600" : "text-yellow-600"
                            }`}
                          >
                            {row.conf} {row.color === "green" ? "✅" : "⚠️"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-600">Overall Confidence: 0.85 (lowest field)</div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 space-y-3">
              <div className="text-lg font-bold text-red-600">📊 mRS 3: Moderate Disability</div>
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-red-900">Why this score?</div>
                <div className="text-red-700">✓ Patient is alive (not mRS 6)</div>
                <div className="text-red-700">✓ Can walk but needs human assistance</div>
                <div className="text-red-700">⭐ Needs help with SOME ADLs</div>
                <div className="text-red-700">✓ This combination = mRS 3</div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-red-900">Clinical Interpretation:</div>
                <div className="text-red-700 italic">
                  "Patient requires some assistance but can walk with help. Dependent for some ADLs."
                </div>
              </div>
            </div>

            <details className="border border-gray-200 rounded-lg">
              <summary className="p-3 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">
                View Supporting Evidence →
              </summary>
              <div className="p-3 pt-0 space-y-3 text-xs border-t border-gray-200">
                <div>
                  <div className="font-semibold text-gray-700">Walking Ability:</div>
                  <div className="text-gray-600 italic">"Patient ambulates with max assist x2"</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700">Self-Care ADLs:</div>
                  <div className="text-gray-600 italic">"Needs help with bathing and dressing"</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700">Usual Activities:</div>
                  <div className="text-gray-600 italic">"Cannot perform all previous duties"</div>
                </div>
              </div>
            </details>
          </div>
        )

      default:
        return null
    }
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
          <Brain className="w-5 h-5 text-purple-600" />
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
                      <CheckCircle2 className="w-5 h-5 text-white" />
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
                <div className="px-4 pb-4 border-t border-gray-200 bg-white animate-in slide-in-from-top-2">
                  <div className="pt-4">{renderStageExpandedContent(stage.id)}</div>
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
