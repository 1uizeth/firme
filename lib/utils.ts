export const cn = (...inputs: (string | undefined | null)[]) => {
  return inputs.filter(Boolean).join(" ")
}

export const formatShortTimestamp = (isoString: string | null | undefined): string => {
  if (!isoString) return "N/A"
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return "Invalid Date"
  }
}
