"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Academy.module.css";

const faqs = [
  {
    q: "What types of video projects will I be able to create?",
    a: "You will learn to direct and produce complete narrative short films, cinematic animated music videos, commercial brand spots, and worldbuilding trailers. The curriculum covers the full spectrum from emotional micro-stories to high-energy action animations.",
  },
  {
    q: "Do I need prior coding, 3D, or drawing experience?",
    a: "None at all. We teach from foundational narrative structuring and visual grammar up to advanced generative video tools (Midjourney, Runway Gen-3, Kling, Luma Dream Machine, ComfyUI) and editorial software (DaVinci Resolve / Premiere Pro). Complete prompt templates, seed sheets, and timeline projects are provided.",
  },
  {
    q: "Do I need a high-end expensive GPU to follow the curriculum?",
    a: "No. Over 85% of our primary animation and video pipelines are cloud-accessible via standard browser interfaces. For students interested in advanced local workflows, we also provide pre-packaged ComfyUI nodes, but it is completely optional.",
  },
  {
    q: "How does persistent character consistency work across multiple scenes?",
    a: "Stage 02 is dedicated exclusively to solving character consistency. You will learn multi-angle turnaround generation, seed locking, facial embeddings, and reference rigging so your characters remain identical across different scenes, outfits, and emotional beats.",
  },
  {
    q: "How does access work immediately after payment?",
    a: "Immediately upon completing payment via Paystack, your account is activated and granted instant access to the student portal. If you purchased Lifetime Access, your access never expires and automatically includes all future curriculum modules.",
  },
  {
    q: "Can I cancel my monthly subscription anytime?",
    a: "Yes, you can cancel your subscription at any time with a single click from your student account settings. You will retain full access until the end of your paid billing period.",
  },
];

export default function AcademyFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.faqSection} id="faq">
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}>Frequently Asked Questions · Help</p>
        <h2>Everything you need to know.</h2>
      </div>

      <div className={styles.faqGrid}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={styles.faqItem} key={i}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={styles.faqButton}
                aria-expanded={isOpen}
              >
                <span className={styles.faqQuestion}>{faq.q}</span>
                <span className={styles.faqToggleIcon}>{isOpen ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
