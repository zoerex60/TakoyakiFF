/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Location from "./components/Location";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Admin from "./components/Admin";

if (window.location.pathname === "/admin") {
  document.title = "Admin · Takoyaki FF";
}

export default function App() {
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24">
        <Hero />
        
        <div id="menu">
          <Menu />
        </div>
        
        <div id="location">
          <Location />
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

