"use client"

import type React from "react"
import type { Question, Option } from "../types/assessment"

interface QuestionCardProps {
  question: Question
  selectedValue?: number
  onAnswer: (questionId: string, value: number, category: string) => void
  onNextQuestion: () => void
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedValue, onAnswer, onNextQuestion }) => {
  const handleOptionChange = (value: number, category: string) => {
    onAnswer(question.id, value, category)
    // Automatically advance to the next question after a short delay
    setTimeout(() => {
      onNextQuestion()
    }, 300) // Small delay for better UX
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full mb-3">
          {question.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option: Option) => (
          <label
            key={option.value}
            className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:border-red-500 hover:bg-red-50 ${
              selectedValue === option.value ? "border-red-500 bg-red-50 ring-2 ring-red-200" : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleOptionChange(option.value, question.category)}
              className="sr-only"
            />
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 w-4 h-4 rounded-full border-2 mr-3 mt-0.5 ${
                  selectedValue === option.value ? "border-red-500 bg-red-500" : "border-gray-300"
                }`}
              >
                {selectedValue === option.value && <div className="w-full h-full rounded-full bg-white scale-50" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                {option.description && <div className="text-sm text-gray-600">{option.description}</div>}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
