export default function Footer() {
  return (
    <footer className="bg-teal-dark text-white/80 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-lg font-semibold text-white mb-2">Galanga</p>
        <p className="text-sm">Cuisine Indonesienne</p>
        <div className="mt-4 text-xs text-white/50">
          &copy; {new Date().getFullYear()} Galanga. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
