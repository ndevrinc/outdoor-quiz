import type React from "react"

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = "" }) => {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-red-600">{percentage}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-red-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
