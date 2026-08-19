import FooterMobile from "./Footer.mobile";
import FooterDesktop from "./Footer.desktop";

export default function Footer() {
  return (
    <footer className="mt-5 border-t border-divider">
      <FooterMobile />
      <FooterDesktop />
    </footer>
  );
}
