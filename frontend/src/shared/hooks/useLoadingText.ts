import { useEffect, useState } from "react";

type Options = {
  baseText?: string;
  maxDots?: number;
  intervalMs?: number;
};

export function useLoadingText({
  baseText = "로딩중",
  maxDots = 3,
  intervalMs = 300
}: Options = {}) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDots(prev => (prev % maxDots) + 1);
    }, intervalMs);

    return () => clearInterval(id);
  }, [maxDots, intervalMs]);

  return `${baseText}${".".repeat(dots)}`;
}
