"use client"
import { Button } from "@/components/ui/button"
import { Settings, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export function ModelSettings() {
  const [model, setModel] = useState("ooba_mistral")
  const [temperature, setTemperature] = useState("0.0")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [maxTokens, setMaxTokens] = useState("131072")
  const [topP, setTopP] = useState("0.95")
  const [seed, setSeed] = useState("")
  const [preset, setPreset] = useState("custom")

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Model Settings</h2>
        </div>
        <button onClick={() => setShowAdvanced(!showAdvanced)}>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showAdvanced ? "" : "rotate-180"}`} />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">Configure model parameters that apply to all strategy executions.</p>

      <div className="space-y-4">
        {/* Model Selector */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span className="text-purple-600">🤖</span>
            Model:
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ooba_mistral">Default (ooba_mistral)</option>
            <option value="ooba_mistral_detailed">ooba_mistral — TheBloke_Mistral-7B-Instruct-v0.2-GPTQ • 8,192</option>
            <option value="ooba_gemma">ooba_gemma — models/google_gemma-3-4b-it • 131,072</option>
            <option value="custom_gemma">custom_gemma — gemma-3-4b-it • 131,072</option>
            <option value="gemini_2_5_pro_openrouter">
              Gemini 2.5 Pro (OpenRouter) — google/gemini-2.5-pro-latest • 2,000,000
            </option>
            <option value="gemini_2_5_pro">Gemini 2.5 Pro — gemini-2.5-pro • 2,000,000</option>
            <option value="openrouter_gpt_oss">OpenRouter GPT-OSS-20B — openai/gpt-oss-20b:free • 131,072</option>
            <option value="deepseek_v3_1">
              OpenRouter DeepSeek V3.1 Free — deepseek/deepseek-chat-v3.1:free • 128,000
            </option>
            <option value="gemini_2_5_flash">Gemini 2.5 Flash Paid — google/gemini-2.5-flash • 1,000,000</option>
            <option value="gpt_oss_120b">GPT-OSS-120B_Together_PAID — openai/gpt-oss-120b • 131,072</option>
          </select>
        </div>

        {/* Temperature */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">🌡️</span>
            Temp:
          </label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            step="0.1"
            min="0"
            max="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">(0=deterministic, 1=balanced, 2=creative)</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => {
              setTemperature("0.0")
              setMaxTokens("131072")
              setTopP("0.95")
              setSeed("")
              setPreset("custom")
            }}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button
            variant={showAdvanced ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Hide Advanced
              </>
            ) : (
              <>
                <Settings className="w-3 h-3 mr-1" />
                Advanced
              </>
            )}
          </Button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            {/* Max Tokens */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Max Tokens:</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Response length limit</p>
            </div>

            {/* Top P (Nucleus) */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Top P (Nucleus):</label>
              <input
                type="number"
                value={topP}
                onChange={(e) => setTopP(e.target.value)}
                step="0.01"
                min="0"
                max="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Sampling probability threshold</p>
            </div>

            {/* Seed (Reproducibility) */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Seed (Reproducibility):</label>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Random (leave empty)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">For reproducible results</p>
            </div>

            {/* Preset */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Preset:</label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="custom">Custom</option>
                <option value="clinical_default">Clinical Default</option>
                <option value="creative_interpretation">Creative Interpretation</option>
                <option value="research_reproducible">Research (Reproducible)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Quick parameter profiles</p>
            </div>

            {/* Reset to Defaults */}
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={() => {
                setMaxTokens("131072")
                setTopP("0.95")
                setSeed("")
                setPreset("custom")
              }}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset to Defaults
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
