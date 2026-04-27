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

export default function App() {
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

