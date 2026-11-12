/** The website white: a very slightly soft page behind pure white cards, a faint border and a barely-there shadow. Screens that were cleaned up share these. */
export const surface = {
  page: "#FDFDFD",
  card: "#FFFFFF",
  border: "#EEECE6",
  shadow: { shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 0 },
  /** Spread into a CardComponent style to restyle it. */
  cardStyle: { backgroundColor: "#FFFFFF", borderColor: "#EEECE6", shadowColor: "#000000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 0 },
  /** The one card that holds the next thing to do. */
  nextStyle: { backgroundColor: "#F7FAF2", borderColor: "#DDEBCB", shadowOpacity: 0, elevation: 0 },
} as const;
