"use client"

import type React from "react"

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-4">
          <img src="/images/ndevr-logo.png" alt="NDEVR Logo" className="mx-auto h-8 w-auto" />
        </div>
        <p className="text-xs text-gray-500">Powered by NDEVR</p>
      </div>
    </footer>
  )
}
