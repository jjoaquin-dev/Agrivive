import { LandingHeader } from "@/src/features/home/components/LandingHeader";
import { HomeHero } from "@/src/features/home/components/HomeHero";
import { HomeCategories } from "@/src/features/home/components/HomeCategories";
import { HomeFeaturedProduce } from "@/src/features/home/components/HomeFeaturedProduce";
import { HomeHowItWorks } from "@/src/features/home/components/HomeHowItWorks";
import { HomeWhySurplus } from "@/src/features/home/components/HomeWhySurplus";
import { HomeImpactTestimonials } from "@/src/features/home/components/HomeImpactTestimonials";
import { HomeFarmerFaq } from "@/src/features/home/components/HomeFarmerFaq";
import { HomeFinalCta } from "@/src/features/home/components/HomeFinalCta";
import { HomeFooter } from "@/src/features/home/components/HomeFooter";

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <main className="bg-white text-neutral-900">
        <HomeHero />
        <HomeCategories />
        <HomeFeaturedProduce />
        <HomeHowItWorks />
        <HomeWhySurplus />
        <HomeImpactTestimonials />
        <HomeFarmerFaq />
        <HomeFinalCta />
      </main>
      <HomeFooter />
    </>
  );
}
