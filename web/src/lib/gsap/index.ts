import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ autoSleep: 60 });
}

export { gsap, ScrollTrigger };
export default gsap;
