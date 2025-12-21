export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-white/60 sm:flex-row">
        <span>© {new Date().getFullYear()} V-Card Generator. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span className="text-white/70">Crafted for modern networking.</span>
        </div>
      </div>
    </footer>
  );
}
