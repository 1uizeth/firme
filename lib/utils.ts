import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Standard cn utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Moved from reclaim-types.ts to make utils self-sufficient for these
export const formatDisplayTimestamp = (isoString: string | null | undefined): string => {
  if (!isoString) return "N/A"
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      console.error("Invalid date string for display timestamp:", isoString)
      return "Invalid Date"
    }
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting display timestamp:", error, "Input:", isoString)
    return "Invalid Date"
  }
}

export const formatShortTimestamp = (isoString: string | null | undefined): string => {
  if (!isoString) return "N/A"
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      console.error("Invalid date string for short timestamp:", isoString)
      return "Invalid Date"
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting short timestamp:", error, "Input:", isoString)
    return "Invalid Date"
  }
}
