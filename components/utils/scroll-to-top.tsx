"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // Use 'instant' to avoid smooth scroll interference
      })
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0)
    }
  }, [pathname]) // Re-run effect when pathname changes

  return null // This component does not render anything
}
