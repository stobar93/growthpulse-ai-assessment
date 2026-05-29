import { cookies } from "next/headers";
import { HeroSection } from "@components/sections/HeroSection";
import { FeaturesSection } from "@components/sections/FeaturesSection";

import { PricingSection } from "@components/sections/PricingSection";
import { CTASection } from "@components/sections/CTASection";
import { AnalyticsBootstrap } from "@components/analytics/AnalyticsBootstrap";
import { getHeroVariant } from "@lib/ab";
import { SocialProofSection } from "../src/components/sections/SocialProofSection/SocialProofSection";

export default async function HomePage() {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitor_id")?.value ?? "anonymous";
  const variant = await getHeroVariant(visitorId);

  return (
    <main>
      <AnalyticsBootstrap abVariant={variant} />
      <HeroSection variant={variant} />
      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <CTASection abVariant={variant} />
    </main>
  );
}
