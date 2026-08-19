const theme = localStorage.getItem("theme");

if (!theme || theme === "dark") {
  localStorage.setItem("theme", "dark");
  document.documentElement.classList.add("dark");
}
