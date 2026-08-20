export function getAvatarUrl(avatar?: string, name?: string): string {
  if (avatar && /^https?:\/\//.test(avatar)) {
    return avatar;
  }

  const initial = (name?.trim().charAt(0) || "A").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#2F2FE4"/><text x="40" y="48" text-anchor="middle" fill="#ffffff" font-size="32" font-family="Arial, sans-serif">${initial}</text></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
