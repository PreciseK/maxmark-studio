"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/(public)/contact/contact.module.css";
import { submitContact } from "@/lib/actions/cms";

const inquiryTypes = ["Start a project", "Book the studio", "General inquiry"];

export default function ContactForm() {
  const [inquiryType, setInquiryType] = useState(inquiryTypes[0]);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    const result = await submitContact({ name: String(data.get("name") || ""), email: String(data.get("email") || ""), company: String(data.get("company") || ""), inquiry_type: inquiryType, message: String(data.get("message") || "") });
    setStatus(result.message); setSubmitting(false);
    if (result.ok) event.currentTarget.reset();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className={styles.inquiryTypes}>
        <legend>What can we help with?</legend>
        <div>
          {inquiryTypes.map((type) => (
            <label className={inquiryType === type ? styles.selectedType : undefined} key={type}>
              <input type="radio" name="inquiryType" value={type} checked={inquiryType === type} onChange={() => setInquiryType(type)} />
              {type}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.fieldGrid}>
        <label><span>Your name</span><input name="name" type="text" placeholder="Name" required /></label>
        <label><span>Email address</span><input name="email" type="email" placeholder="you@company.com" required /></label>
      </div>
      <label className={styles.fullField}><span>Company or artist</span><input name="company" type="text" placeholder="Optional" /></label>
      <label className={styles.fullField}><span>Tell us about it</span><textarea name="message" placeholder="A little about the idea, timing, and budget range…" rows={5} required /></label>

      <button className={styles.submitButton} type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send inquiry"} <span aria-hidden="true">↗</span>
      </button>
      <p className={styles.formNote} aria-live="polite">{status || "Your inquiry is saved securely for the studio team."}</p>
    </form>
  );
}
