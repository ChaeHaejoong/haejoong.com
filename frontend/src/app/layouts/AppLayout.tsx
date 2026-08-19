import { Outlet } from "react-router-dom";
import Nav from "@/widgets/layouts/Nav";
import Footer from "@/widgets/layouts/Footer";

export default function AppLayout() {
  return (
    <div className="w-full min-h-screen overflow-hidden flex flex-col">
      <Nav />
      <main className="px-layout flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
