import { useEffect, useState } from "react";

export default function usePostDetailScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollableHeight = Math.max(scrollHeight - viewportHeight, 0);

      if (scrollableHeight === 0) {
        setScrollProgress(0);
        return;
      }

      const nextProgress = Math.min(
        Math.max((scrollTop / scrollableHeight) * 100, 0),
        100,
      );

      setScrollProgress(nextProgress);
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  return scrollProgress;
}
