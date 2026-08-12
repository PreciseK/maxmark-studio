"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./StudioSpacesModal.module.css";

export type StudioSpace = { title: string; eyebrow: string; copy: string; image: string };

export default function StudioSpacesModal({ open, onClose, spaces }: { open: boolean; onClose: () => void; spaces: StudioSpace[] }) {
  const [active, setActive] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") setActive((current) => (current - 1 + spaces.length) % spaces.length);
      if (event.key === "ArrowRight") setActive((current) => (current + 1) % spaces.length);
      if (event.key === "Tab" && modalRef.current) {
        const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      returnFocusRef.current?.focus();
    };
  }, [open, onClose, spaces.length]);

  if (!spaces.length) return null;
  const previous = (active - 1 + spaces.length) % spaces.length;
  const next = (active + 1) % spaces.length;
  const space = spaces[active];

  return (
    <div className={`${styles.backdrop} ${open ? styles.backdropOpen : styles.backdropClosing}`} aria-hidden={!open} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={modalRef} className={`t-modal ${open ? "is-open" : "is-closing"} ${styles.modal}`} role={open ? "dialog" : undefined} aria-modal={open ? "true" : undefined} aria-labelledby={open ? "spaces-modal-title" : undefined} inert={!open}>
        <div className={styles.topbar}>
          <span>Maxmark Studio · Space tour</span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close space gallery">Close <i aria-hidden="true">×</i></button>
        </div>
        <div className={styles.stage}>
          <button className={`${styles.side} ${styles.previous}`} type="button" onClick={() => setActive(previous)} aria-label={`View ${spaces[previous].title}`}><Image src={spaces[previous].image} alt="" fill sizes="28vw" /></button>
          <div className={styles.activeMedia} key={space.title}><Image src={space.image} alt={`${space.title} at Maxmark Studio`} fill priority sizes="(max-width: 800px) 92vw, 58vw" /></div>
          <button className={`${styles.side} ${styles.next}`} type="button" onClick={() => setActive(next)} aria-label={`View ${spaces[next].title}`}><Image src={spaces[next].image} alt="" fill sizes="28vw" /></button>
        </div>
        <div className={styles.caption} aria-live="polite">
          <div><span>{space.eyebrow}</span><h2 id="spaces-modal-title">{space.title}</h2></div>
          <p>{space.copy}</p>
          <Link href="/booking">Book this space <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={() => setActive(previous)} aria-label="Previous space">←</button>
          <div aria-hidden="true">{spaces.map((item, index) => <span className={index === active ? styles.activeDot : undefined} key={item.title} />)}</div>
          <button type="button" onClick={() => setActive(next)} aria-label="Next space">→</button>
        </div>
      </section>
    </div>
  );
}
