"use client";

import { useMemo, useState } from "react";
import { createBooking } from "@/lib/actions/cms";
import type { BookingServiceRow } from "@/types/database";
import styles from "@/app/(public)/booking/booking.module.css";

const slots = ["09:00", "11:30", "14:00", "16:30", "19:00"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export default function BookingCalendar({ services }: { services: BookingServiceRow[] }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const service = services.find((x) => x.id === serviceId) ?? services[0];

  const days = useMemo(() => {
    const start = (month.getDay() + 6) % 7;
    const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array(start).fill(null),
      ...Array.from({ length: total }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
    ];
  }, [month]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date || !time || !service) {
      setMessage("Please choose an animation track, date, and preferred time.");
      return;
    }
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const result = await createBooking({
      service_id: service.id,
      service_name: service.name,
      booking_date: date,
      start_time: time,
      duration_minutes: service.duration_minutes,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      company: String(fd.get("company") || ""),
      notes: String(fd.get("notes") || ""),
    });
    setMessage(result.message);
    setSubmitting(false);
    if (result.ok) {
      e.currentTarget.reset();
      setDate("");
      setTime("");
    }
  }

  return (
    <form className={styles.bookingFlow} onSubmit={submit}>
      {/* 01 · Animation Scope */}
      <section className={styles.serviceChoice}>
        <p className={styles.stepLabel}>01 · Select Animation Track</p>
        <div>
          {services.map((item) => (
            <button
              type="button"
              className={serviceId === item.id ? styles.activeChoice : ""}
              onClick={() => setServiceId(item.id)}
              key={item.id}
            >
              <strong>{item.name}</strong>
              <span>
                {item.duration_minutes} min intake · {item.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 02 · Discovery Date */}
      <section className={styles.calendarSection}>
        <p className={styles.stepLabel}>02 · Select Discovery Date</p>
        <div className={styles.calendarHead}>
          <button
            type="button"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            ←
          </button>
          <strong>
            {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </strong>
          <button
            type="button"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            →
          </button>
        </div>
        <div className={styles.weekdays}>
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className={styles.days}>
          {days.map((day, index) => {
            if (!day) return <span key={`blank-${index}`} />;
            const disabled = day < today || day.getDay() === 0;
            const value = iso(day);
            return (
              <button
                type="button"
                disabled={disabled}
                className={date === value ? styles.selectedDay : ""}
                onClick={() => {
                  setDate(value);
                  setTime("");
                }}
                key={value}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </section>

      {/* 03 · Time Window */}
      <section className={styles.timeSection}>
        <p className={styles.stepLabel}>03 · Preferred Time Window</p>
        {date ? (
          <div className={styles.slots}>
            {slots.map((slot) => (
              <button
                type="button"
                className={time === slot ? styles.selectedTime : ""}
                onClick={() => setTime(slot)}
                key={slot}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>Choose a discovery date to view available session windows.</p>
        )}
      </section>

      {/* 04 · Project Brief & Details */}
      <section className={styles.detailsSection}>
        <p className={styles.stepLabel}>04 · Project Brief & Creator Details</p>
        <div className={styles.detailGrid}>
          <label>
            Your Name *
            <input name="name" placeholder="Director / Brand Lead" required />
          </label>
          <label>
            Email Address *
            <input name="email" type="email" placeholder="directors@studio.com" required />
          </label>
          <label>
            Phone / WhatsApp
            <input name="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </label>
          <label>
            Studio, Agency or Artist Name
            <input name="company" placeholder="e.g. Acme Media / Independent" />
          </label>
        </div>

        <label className={styles.notes}>
          Animation Project Brief & Visual References
          <textarea
            name="notes"
            rows={4}
            placeholder="Share details about your animation concept, target runtime, aesthetic style (3D cinematic, anime, AI hybrid, photoreal), reference links, and timeline expectations..."
          />
        </label>

        <div className={styles.summary}>
          <span>TRACK: {service?.name ?? "Animation Production"}</span>
          <span>
            DATE:{" "}
            {date
              ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "Pending Selection"}
          </span>
          <span>TIME: {time || "Pending Selection"}</span>
        </div>

        <button className={styles.submit} disabled={submitting}>
          <span>{submitting ? "Processing Request…" : "Book Animation Video"}</span>
          <span>↗</span>
        </button>

        <p className={styles.response} aria-live="polite">
          {message ||
            "No upfront payment required. Our directing team will review your brief and confirm the production session within 24 hours."}
        </p>
      </section>
    </form>
  );
}
