export function GetVideoType({url}: {url: string}): "youtube" | "vimeo" | "video" {
  
  const lowerCaseUrl = url.toLowerCase()

  if (lowerCaseUrl.includes("youtube") || lowerCaseUrl.includes("youtu.be")) {
    return "youtube"
  }

  if (lowerCaseUrl.includes("vimeo")) {
    return "vimeo"
  }

  return "video"
}