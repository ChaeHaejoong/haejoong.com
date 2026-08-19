import { FiGithub } from "react-icons/fi";

export default function FooterMobile() {
  return (
    <div className="md:hidden flex items-center justify-between px-5 py-3 text-xs text-muted">
      <span>© {new Date().getFullYear()} Haejoong</span>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/ChaeHaejoong"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <FiGithub size={13} />
          GitHub
        </a>
        <a href="/copyright" className="hover:text-primary transition">
          © Copyright
        </a>
      </div>
    </div>
  );
}
