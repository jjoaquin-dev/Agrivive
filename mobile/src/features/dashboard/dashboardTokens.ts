import { surface } from "../../theme/surface";

/** The dashboard surfaces: the shared website white, plus the one heading size. */
export const dash = {
  page: surface.page,
  card: surface.card,
  border: surface.border,
  shadow: surface.shadow,
  sectionHeading: { fontSize: 18, lineHeight: 24 },
} as const;
