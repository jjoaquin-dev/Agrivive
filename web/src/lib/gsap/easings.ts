// One motion vocabulary for the landing page. Tailwind mirrors these as ease-pop / ease-settle / ease-glide.
export const EASINGS = {
  /** Small things arriving: letters, veggies, slices, cards. Light overshoot, never wobbly. */
  POP: "back.out(1.6)",
  /** Text and content blocks arriving. */
  SETTLE: "power3.out",
  /** Splash only: the Agrivive letters' springy entrance and the cart's heavy wobble. */
  BOUNCE: "elastic.out(1.15, 0.45)",
  /** Things travelling across the screen: cart, wave, logo flight. */
  GLIDE: "power2.inOut",
} as const;

export const DURATIONS = {
  hover: 0.2,
  small: 0.45,
  block: 0.7,
  image: 0.9,
} as const;
