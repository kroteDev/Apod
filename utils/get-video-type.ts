export function GetVideoType({url}: {url: string}): "youtube" | "vimeo" | "video" | null {
  
  const VIDEOTYPES: string[] = ["MP4", "MPG", "WMV", "MPEG"] 
  const lowerCaseUrl = url.toLowerCase()

  if (lowerCaseUrl.includes("youtube") || lowerCaseUrl.includes("youtu.be")) {
    return "youtube"
  }

  if (lowerCaseUrl.includes("vimeo")) {
    return "vimeo"
  }
  
  if(VIDEOTYPES.some((ext) => lowerCaseUrl.endsWith(ext.toLowerCase()))) {
    return "video"
  }
  
  return null
}