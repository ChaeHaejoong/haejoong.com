import { FiGithub } from "react-icons/fi";

export default function FooterDesktop() {
  return (
    <div className="hidden md:flex max-w-3xl mx-auto py-7 flex-col items-center gap-4">
      <div className="flex flex-col items-center justify-center">
        <img src="/imgs/icon.png" className="w-8 h-8 object-contain mb-3" />
        <span className="text-title font-semibold md:text-lg">
          haejoong.com
        </span>
      </div>

      <p className="text-sm text-secondary text-center">
        채해중만 글을 작성하는 채해중의 개발일지
      </p>

      <div className="flex gap-6 text-muted text-sm">
        <a
          href="https://github.com/ChaeHaejoong"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <FiGithub size={16} />
          GitHub
        </a>
        <a href="/copyright" className="hover:text-primary transition">
          © Copyright
        </a>
      </div>

      <p className="text-xs text-muted">
        © {new Date().getFullYear()} Haejoong. All rights reserved.
      </p>
    </div>
  );
}
