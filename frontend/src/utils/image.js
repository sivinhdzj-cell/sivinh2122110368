export function getSafePosterUrl(url, fallback = "https://placehold.co/400x560?text=CinemaMS") {
  if (!url || typeof url !== "string") return fallback;

  const normalized = url.trim();
  if (!normalized) return fallback;

  const isHttp = normalized.startsWith("http://") || normalized.startsWith("https://");
  const isRelative = normalized.startsWith("/");
  const looksLikeApiPath = normalized.startsWith("/api/") || normalized.includes("/api/");
  
  if (isRelative && !looksLikeApiPath) return normalized;
  if (!isHttp || looksLikeApiPath) return fallback;

  return normalized;
}
