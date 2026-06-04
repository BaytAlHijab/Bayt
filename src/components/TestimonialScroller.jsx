import { useEffect, useRef, useState } from "react";

export default function TestimonialsScroller({ testimonials = [] }) {
  const scrollerRef = useRef(null);
  const dragState = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
  });

  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const loopedTestimonials = [...testimonials, ...testimonials];
  const halfWidthRef = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || testimonials.length === 0) return;

    let rafId;
    const speed = 1.15; // lower = slower

    const tick = () => {
      if (!paused && !dragging) {
        const halfWidth = el.scrollWidth / 2;
        halfWidthRef.current = halfWidth;

        el.scrollLeft += speed;

        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [paused, dragging, testimonials.length]);

  const endDrag = () => {
    dragState.current.isDown = false;
    setDragging(false);
    setPaused(false);
  };

  const handlePointerDown = (e) => {
    const el = scrollerRef.current;
    if (!el) return;

    dragState.current.isDown = true;
    dragState.current.startX = e.clientX;
    dragState.current.startScrollLeft = el.scrollLeft;

    setPaused(true);
    setDragging(true);

    el.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const el = scrollerRef.current;
    if (!el || !dragState.current.isDown) return;

    e.preventDefault();

    const dx = e.clientX - dragState.current.startX;
    const halfWidth = halfWidthRef.current || el.scrollWidth / 2;

    let nextScrollLeft = dragState.current.startScrollLeft - dx;

    if (nextScrollLeft >= halfWidth) nextScrollLeft -= halfWidth;
    if (nextScrollLeft < 0) nextScrollLeft += halfWidth;

    el.scrollLeft = nextScrollLeft;
  };

  return (
    <section className="section-wrap">
      <div className="section-header">
        <h2 className="section-title">What customers say</h2>
      </div>

      <div
        ref={scrollerRef}
        className={`testimonials-scroller ${dragging ? "is-dragging" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          if (!dragging) setPaused(false);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {loopedTestimonials.map((t, i) => (
          <div
            className="test-card test-card-scroll"
            key={`${i}-${t.name}-${t.location}`}
          >
            <div className="test-stars">{"★".repeat(t.stars)}</div>
            <p className="test-text">"{t.text}"</p>
            <div className="test-name">
              {t.name} · {t.location}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
