import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/routes/Protect.routes";
import Navbar from "@/components/User/Navbar";
import Footer from "@/components/User/Footer";

// Public Layout (No Navbar & Footer)
const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Outlet />
    </div>
  );
};

// Private Layout (Static Navbar & Footer)
const PrivateLayout = () => {
  return (
    <ProtectedRoute>
      <div className="private-layout">
        <Navbar />
        <main className="content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export { PublicLayout, PrivateLayout };
