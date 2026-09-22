import { notFound } from "next/navigation";
/*
import type { Metadata } from "next";
import BookingCalendar from "@/components/booking/BookingCalendar";
import { getBookingServices } from "@/lib/content";
import styles from "./booking.module.css";

export const metadata: Metadata = {
  title: "Book the Studio — Maxmark Animations",
  description: "Choose a studio service, date, and time for your Maxmark Animations session.",
};
*/

export default async function BookingPage() {
  // Booking is hidden from users for now
  notFound();

  /*
  const services = await getBookingServices();
  return (
    <div className={`${styles.page} booking-theme-surface`}>
      <header className={styles.hero}>
        <p>Maxmark Animations · Lagos</p>
        <h1>Book the room.</h1>
        <div><span>Recording</span><span>Rehearsals</span><span>Podcasts</span></div>
      </header>
      <main>
        <div className={styles.intro}>
          <p>Choose a session, date, and preferred start time. We’ll review the request and confirm the booking with final pricing and access details.</p>
          <span>Open Monday—Saturday</span>
        </div>
        <BookingCalendar services={services} />
      </main>
    </div>
  );
  */
}
