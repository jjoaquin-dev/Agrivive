import { SplashScreen } from "@/src/components/sections/SplashScreen";
import { LandingHeader } from "@/src/features/home/components/LandingHeader";
import { Hero } from "@/src/components/sections/Hero";
import { Features } from "@/src/components/sections/Features";
import { HomeFooter } from "@/src/features/home/components/HomeFooter";

export default function HomePage() {
  return (
    <>
      <SplashScreen />
      <LandingHeader />
      <main className="bg-white text-neutral-900">
        <Hero />
        <Features />
      </main>
      <HomeFooter />
    </>
  );
}
