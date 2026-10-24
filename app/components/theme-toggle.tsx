'use client'

import { useSyncExternalStore } from "react"
import { useDictionary } from "@/app/providers/dictionary-provider"
import { MoonIcon } from "@/app/components/icons/moon"
import { SunIcon } from "@/app/components/icons/sun"
import { THEME_STORAGE_KEY } from "@/helpers/theme"

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ["class"] })

  return () => observer.disconnect()
}

function isDarkMode() {
  return document.documentElement.classList.contains("dark")
}

export function ThemeToggle() {
  const dictionary = useDictionary()
  const darkMode = useSyncExternalStore(subscribe, isDarkMode, () => false)

  function toggleTheme() {
    const next = !darkMode
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light")
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dictionary.main_nav.toggle_theme}
      className="flex items-center px-4 py-3"
    >
      {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
    </button>
  )
}
