import { useEffect, useRef, useState } from "react";

const MouseFollower = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX - 250, y: e.clientY - 250 });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="mouse-gradient"
      style={{ left: pos.x, top: pos.y }}
    />
  );
};

export default MouseFollower;
