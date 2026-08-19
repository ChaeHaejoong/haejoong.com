import { useEffect } from "react";

export default function useHideDetailScrollbar() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.classList.add("no-scrollbar");
    body.classList.add("no-scrollbar");

    return () => {
      html.classList.remove("no-scrollbar");
      body.classList.remove("no-scrollbar");
    };
  }, []);
}
