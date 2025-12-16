"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, FileText, Play, RotateCcw } from "lucide-react"
import { StrategySelector } from "@/components/strategy-selector"
import { ModelSettings } from "@/components/model-settings"
import { ClinicalNoteInput } from "@/components/clinical-note-input"
import { PipelineVisualization } from "@/components/pipeline-visualization"

export default function PromptPlayground() {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true)
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [clinicalNote, setClinicalNote] = useState("")

  const handleRunSelected = () => {
    if (selectedStrategies.length === 0) return

    setLeftPanelCollapsed(true)
    setRightPanelCollapsed(false)
    setIsRunning(true)

    // Simulate pipeline execution
    setTimeout(() => {
      setIsRunning(false)
    }, 10000)
  }

  const handleReset = () => {
    setSelectedStrategies([])
    setIsRunning(false)
    setLeftPanelCollapsed(false)
    setRightPanelCollapsed(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prompt Playground</h1>
            <p className="text-sm text-gray-600 mt-1">
              Design, compare, and simulate clinical data extraction strategies.
            </p>
            <div className="flex gap-2 mt-2">
              <div className="group relative">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium cursor-help">
                  <span>📊</span> Enhanced Tables
                  <span className="text-blue-500">ⓘ</span>
                </span>
                <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                  Enhanced Tables: Show AI confidence scores, token counts, sorting, and interactive controls for better
                  analysis
                </div>
              </div>
              <div className="group relative">
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium cursor-help">
                  <span>🧠</span> Smart Prompting
                  <span className="text-purple-500">ⓘ</span>
                </span>
                <div className="absolute left-0 top-full mt-1 w-80 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                  Smart Prompting: Uses field-specific AI contracts for 30-40% better extraction accuracy with type
                  awareness
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <span className="mr-2">↓</span> Import
            </Button>
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <span className="mr-2">↑</span> Export All
            </Button>
            <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700">
              <span className="mr-2">⚡</span> Batch Mode
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Strategies & Settings */}
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 relative ${
            leftPanelCollapsed ? "w-12" : "w-[25%] min-w-[320px]"
          }`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="absolute right-0 top-4 z-10 translate-x-1/2 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50 shadow-sm"
          >
            {leftPanelCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {leftPanelCollapsed ? (
            <div className="flex flex-col items-center pt-16 gap-4">
              <div className="writing-mode-vertical text-sm font-medium text-gray-700">Prompt Strategies</div>
            </div>
          ) : (
            <div className="p-4 overflow-y-auto h-full">
              <StrategySelector selectedStrategies={selectedStrategies} onStrategyChange={setSelectedStrategies} />

              {selectedStrategies.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={handleRunSelected}
                    disabled={isRunning}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Selected ({selectedStrategies.length})
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              )}

              <div className="mt-6">
                <Card className="p-3 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">Data Source: Using Original Clinical Note</span>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <ModelSettings />
              </div>
            </div>
          )}
        </div>

        {/* Center Panel - Clinical Note & Results */}
        <div className="flex-1 bg-white overflow-y-auto">
          <ClinicalNoteInput
            value={clinicalNote}
            onChange={setClinicalNote}
            isRunning={isRunning}
            selectedStrategies={selectedStrategies}
            onStrategyChange={setSelectedStrategies}
          />
        </div>

        {/* Right Panel - Pipeline Visualization */}
        <div
          className={`bg-white border-l border-gray-200 transition-all duration-300 relative ${
            rightPanelCollapsed ? "w-12" : "w-[25%] min-w-[320px]"
          }`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            className="absolute left-0 top-4 z-10 -translate-x-1/2 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50 shadow-sm"
          >
            {rightPanelCollapsed ? (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {rightPanelCollapsed ? (
            <div className="flex flex-col items-center pt-16 gap-4">
              <div className="writing-mode-vertical text-sm font-medium text-gray-700">Pipeline</div>
            </div>
          ) : (
            <div className="p-4 overflow-y-auto h-full">
              <PipelineVisualization isRunning={isRunning} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
