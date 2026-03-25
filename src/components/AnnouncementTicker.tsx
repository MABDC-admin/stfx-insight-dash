import { useEffect, useRef } from "react";

const announcements = [
  { text: "3rd Quarter Examination Schedule Released", priority: "HIGH" },
  { text: "Enrollment for SY 2026-2027 Now Open", priority: "HIGH" },
  { text: "Submission of SF Forms Reminder", priority: "NORMAL" },
  { text: "Intramurals 2026 Team Registration", priority: "NORMAL" },
  { text: "Parent-Teacher Conference — March 28", priority: "HIGH" },
];

const AnnouncementTicker = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    const animate = () => {
      pos -= speed;
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  const items = [...announcements, ...announcements];

  return (
    <div className="overflow-hidden rounded-lg border bg-card/60 backdrop-blur-sm px-4 py-2">
      <div ref={scrollRef} className="flex whitespace-nowrap gap-8">
        {items.map((a, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-sm">
            <span>{a.text}</span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                a.priority === "HIGH"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-primary/20 text-primary"
              }`}
            >
              {a.priority}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementTicker;
