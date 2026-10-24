'use client'

import { useState } from "react"
import { useDictionary } from "@/app/providers/dictionary-provider"
import { MoonIcon } from "@/app/components/icons/moon"
import { SunIcon } from "@/app/components/icons/sun"

export function ThemeToggle() {
  const dictionary = useDictionary()
  const [darkMode, setDarkMode] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      aria-label={dictionary.main_nav.toggle_theme}
      className="flex items-center px-4 py-3"
    >
      {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
    </button>
  )
}
