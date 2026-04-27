import { ShoppingBasket } from "lucide-react";
import { IMAGES } from "../constants";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FFFDF5]/80 backdrop-blur-md border-b-2 border-creamy-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/images/Takoyaki-FF-LOGO.png" 
            alt="Takoyaki FF Logo" 
            className="w-15 h-15 rounded-full object-cover"
          />
          <span className="text-2xl font-black text-brand-red-dark tracking-tighter font-display">
            Takoyaki FF
          </span>
        </div>
      </div>
    </header>
  );
}
