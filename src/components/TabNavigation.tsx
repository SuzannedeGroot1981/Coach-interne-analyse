'use client'

import { useState, useEffect } from 'react'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  progress: { completed: number; total: number }
}

const TABS = [
  { id: 'harde-s', label: 'Harde S\'en (1-3)', icon: 'build' },
  { id: 'zachte-s', label: 'Zachte S\'en (4-7)', icon: 'lightbulb' },
  { id: 'financieel', label: 'Financiële Analyse', icon: 'payments' },
  { id: 'export', label: 'Export', icon: 'description' }
]

export default function TabNavigation({ activeTab, onTabChange, progress }: TabNavigationProps) {
  return (
    <div className="hl-card p-6 mb-8 sticky top-4 z-10">
      {/* Progressie Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold hl-donkergroen-text">Voortgang</h3>
          <span className="text-sm hl-donkerpaars-text font-medium">
            {progress.completed} van {progress.total} secties ingevuld
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="hl-donkergroen-bg h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs hl-donkerpaars-text mt-2">
          <span>Start</span>
          <span>{Math.round((progress.completed / progress.total) * 100)}%</span>
          <span>Compleet</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'hl-donkergroen-bg text-white hl-glow-green'
                : 'bg-gray-100 hl-donkerpaars-text hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-sharp hl-icon-sm">
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}