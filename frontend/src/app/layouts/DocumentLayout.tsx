import { Outlet } from "react-router-dom";
import Nav from "../../widgets/layouts/Nav";
import Footer from "@/widgets/layouts/Footer";

export default function DocumentLayout() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Nav />
      <main className="px-layout flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
