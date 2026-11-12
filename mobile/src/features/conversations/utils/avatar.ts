import { colors } from "../../../theme";

const AVATAR_PALETTE = [
  colors.primary,
  colors.terracotta,
  colors.sage,
  colors.textMuted,
];

export function getAvatarColor(nameOrId: string = "Buyer"): string {
  let hash = 0;
  for (let i = 0; i < nameOrId.length; i++) {
    hash = nameOrId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "BY";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}
