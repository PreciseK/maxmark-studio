import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { studio } from "@/content/studio";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Get in Touch — Maxmark Studio",
  description: "Start a production or book Maxmark Studio for recording, podcasting, and rehearsals.",
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Lagos · Available worldwide</p>
        <h1>Get in touch.</h1>
        <p className={styles.heroCopy}>Bring us the ambitious brief, the unfinished thought, or the room you need to make something happen.</p>
        <a className={styles.emailHero} href="mailto:info@maxmarkstudio.com">info@maxmarkstudio.com <span aria-hidden="true">↗</span></a>
      </header>

      <main className={styles.contactGrid}>
        <section className={styles.directory} aria-labelledby="direct-title">
          <p className={styles.sectionLabel} id="direct-title">Go direct</p>
          <div className={styles.emailList}>
            {studio.contactEmails.map((contact, index) => (
              <a href={`mailto:${contact.email}`} key={contact.email}>
                <span>{String(index + 1).padStart(2, "0")} · {contact.label}</span>
                <strong>{contact.email}</strong>
                <p>{contact.description}</p>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </div>

          <div className={styles.availability}>
            <span className={styles.statusDot} aria-hidden="true" />
            <div><strong>Studio bookings open</strong><p>Recording · Rehearsals · Podcasts · Small shoots</p></div>
          </div>
        </section>

        <section className={styles.formSection} aria-labelledby="form-title">
          <div className={styles.formHeading}>
            <p className={styles.sectionLabel}>Send a brief</p>
            <h2 id="form-title">Let’s make the first conversation useful.</h2>
          </div>
          <ContactForm />
        </section>
      </main>

      <section className={styles.socialSection}>
        <p className={styles.sectionLabel}>Elsewhere</p>
        <div>
          {studio.socials.map((social) => <a href={social.url} target="_blank" rel="noopener noreferrer" key={social.name}>{social.name}<span aria-hidden="true">↗</span></a>)}
        </div>
      </section>
    </div>
  );
}
