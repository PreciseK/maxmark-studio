"use client";

import PillButton from "@/components/ui/PillButton";
import styles from "./Academy.module.css";

const tiers = [
  {
    id: "subscription_monthly",
    number: "01",
    name: "Monthly Membership",
    priceDisplay: "₦25,000",
    intervalDisplay: "/ month",
    description: "Full access to the library with monthly updates and live studio critiques.",
    benefits: [
      "Access to all AI animation & storytelling masterclasses",
      "Production project files, prompt bibles & assets",
      "Monthly live creative review & film critiques",
      "Cancel anytime without hassle",
    ],
    isPopular: false,
    ctaText: "Start Monthly",
  },
  {
    id: "lifetime",
    number: "02",
    name: "Lifetime All-Access",
    badge: "Recommended",
    priceDisplay: "₦150,000",
    intervalDisplay: "one-time payment",
    originalPrice: "₦250,000",
    description: "Permanent ownership of all current and future AI animation & filmmaking masterclasses forever.",
    benefits: [
      "Permanent lifetime access to all lessons & modules",
      "Every future masterclass added automatically",
      "Full library of prompt bibles, character turnarounds & workflows",
      "Direct entry to private Maxmark Director Circle",
      "Priority script, storyboard & film critique from directors",
      "Official certificate of film completion",
    ],
    isPopular: true,
    ctaText: "Get Lifetime Access",
  },
  {
    id: "subscription_yearly",
    number: "03",
    name: "Annual Membership",
    badge: "Save 33%",
    priceDisplay: "₦200,000",
    intervalDisplay: "/ year",
    originalPrice: "₦300,000",
    description: "12 months of full access with priority critique and early studio releases.",
    benefits: [
      "Save ₦100,000 compared to monthly",
      "All monthly membership benefits included",
      "Priority project & film reviews by directors",
      "Early preview of upcoming generative tools and case studies",
    ],
    isPopular: false,
    ctaText: "Get Annual Access",
  },
];

export default function AcademyPricing() {
  return (
    <section className={styles.pricingSection} id="pricing">
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}>Tuition & Enrollment · Filmmaking Cohort</p>
        <h2>Secure your spot.</h2>
        <p className={styles.heroDescription} style={{ margin: "24px 0 0", maxWidth: "700px" }}>
          Choose between permanent lifetime ownership or flexible membership. Learn the complete
          AI animation and narrative storytelling pipeline with instant portal access.
        </p>
      </div>

      <div className={styles.pricingGrid}>
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`${styles.pricingCol} ${tier.isPopular ? styles.pricingFeatured : ""}`}
          >
            {tier.badge && <span className={styles.pricingBadge}>{tier.badge}</span>}

            <div>
              <span className={styles.curriculumNumber}>{tier.number}</span>
              <h3 className={styles.pricingTierName}>{tier.name}</h3>
              <p className={styles.pricingDescription}>{tier.description}</p>

              <div className={styles.pricingPriceBox}>
                {tier.originalPrice && (
                  <span className={styles.pricingOriginal}>{tier.originalPrice}</span>
                )}
                <div className={styles.pricingMainPrice}>
                  <span className={styles.pricingAmount}>{tier.priceDisplay}</span>
                  <span className={styles.pricingInterval}>{tier.intervalDisplay}</span>
                </div>
              </div>

              <ul className={styles.pricingBenefits}>
                {tier.benefits.map((benefit, i) => (
                  <li key={i}>
                    <span>✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: "24px" }}>
              <PillButton
                href={`/academy/checkout?plan=${tier.id}`}
                variant={tier.isPopular ? "solid" : "glass"}
                size="large"
                withArrow
                className="w-full justify-center"
              >
                {tier.ctaText}
              </PillButton>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pricingGuarantee}>
        🔒 Secure 256-bit encryption · Powered by Paystack · Instant Student Portal Access
      </div>
    </section>
  );
}
