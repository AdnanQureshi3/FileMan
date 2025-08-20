import React from 'react';
import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fixed at top */}
      <Header />

      {/* Main content pushes footer down */}
      <main className="flex-1 pt-[70px] pb-[120px]"> {/* adjust padding to match header/footer heights */}
        <Outlet />
      </main>

      {/* Footer stays at bottom */}
      <Footer />
    </div>
  );
}

export default MainLayout;
