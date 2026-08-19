import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        relative
        w-14 h-7
        flex items-center
        rounded-full
        bg-bg-secondary-reverse
        transition-colors
        duration-500
        cursor-pointer
      "
    >
      <span className="absolute left-1.5 top-1.5 text-sm">☀️</span>
      <span className="absolute right-1.5 top-1.5 text-sm">🌙</span>

      <div
        className={`
          absolute
          w-5 h-5
          bg-bg
          rounded-full
          shadow
          transition
          duration-500
          ${dark ? "translate-x-7.5" : "translate-x-1.5"}
        `}
      />
    </button>
  );
}
