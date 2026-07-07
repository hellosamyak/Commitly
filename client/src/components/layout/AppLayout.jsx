import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 sm:px-6">
        <Sidebar />
        <main className="min-w-0 flex-1 py-6 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <Footer />
    </div>
  );
}
