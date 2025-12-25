export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0b0b0f] via-[#14101b] to-[#0b0b0f] text-white lg:px-48">
      <div className="mx-auto max-w-8xl md:px-10 px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* LEFT — CONTACT */}
          <div className="space-y-4 text-sm">
            <h4 className="text-base font-semibold tracking-widest text-white uppercase">
              Contact Us
            </h4>

            <p className="text-white/80">(855) 900-9111</p>

            <p className="text-white/80">
              sales@proliftrigging.com
            </p>
          </div>

          {/* CENTER — ADDRESS */}
          <div className="space-y-2 text-sm md:text-center">
            <p className="text-white/80">1840 Pyramid Pl</p>
            <p  className="text-white/80">Memphis, TN 38132</p>
          </div>

          {/* RIGHT — NAVIGATION */}
          <div className="space-y-3 text-sm md:text-right">
            <ul className="space-y-2">
              <li className="font-semibold text-white">
                <span className="border-b-2 border-[#9f2b34] pb-1">
                  HOME
                </span>
              </li>

              {[
                'STATIONERY',
                'APPAREL',
                'PROMO ITEMS',
                'DISPLAY',
                'COLLATERAL',
                'GIFT CARDS',
                'FAQs'
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer text-white/80 hover:text-white transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} V-Card Generator. All rights reserved.
      </div>
    </footer>
  );
}
