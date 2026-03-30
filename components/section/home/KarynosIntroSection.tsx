"use client"
import DreamMatching from "@/components/parts/DreamMatching"
import DreamAction from "@/components/parts/DreamAction"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "matching", label: "Dream Matching" },
  { id: "action", label: "Dream Action" },
]

const KarynosIntroSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === current)
        const nextIndex = (currentIndex + 1) % tabs.length
        return tabs[nextIndex].id
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <div id="productsSection" className="py-10">
      <div className="px-6 md:px-15 flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-2 md:mb-0">Product</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative mr-4 flex-1 py-5 text-center transition-all duration-300 hover:bg-muted/50"
          >
            <span className={cn(
              "text-xl font-bold transition-colors duration-100",
              activeTab === tab.id
                ? tab.id === "matching"
                  ? "text-blue-500"
                  : "text-red-500"
                : "text-muted-foreground"
            )}>
              {tab.label}
            </span>
            <div
              className={cn(
                "absolute bottom-0 left-1/2 h-1 -translate-x-1/2 rounded-full transition-all duration-300",
                tab.id === "matching" ? "bg-blue-500" : "bg-red-500",
                activeTab === tab.id ? "w-2/3 opacity-100" : "w-0 opacity-0"
              )}
            />
          </button>
        ))}
      </div>
      <div className="mt-4 mx-1 p-8 border rounded-lg bg-card">
        <div>
          {activeTab === "matching" ? (
            <div className="space-y-4">
              <DreamMatching />
            </div>
          ) : (
            <div className="space-y-4">
              <DreamAction />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KarynosIntroSection
