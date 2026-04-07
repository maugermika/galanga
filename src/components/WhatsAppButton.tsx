"use client";

export default function WhatsAppButton() {
  const phone = "33749545047";
  const message = encodeURIComponent(
    "Bonjour ! Je souhaite passer une commande chez Galanga."
  );
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1da851] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.342 22.616c-.392 1.098-1.94 2.01-3.172 2.276-.846.18-1.95.324-5.67-1.218-4.762-1.97-7.826-6.798-8.064-7.114-.228-.316-1.918-2.556-1.918-4.876 0-2.32 1.214-3.462 1.646-3.934.392-.428 1.03-.632 1.64-.632.198 0 .376.01.536.018.47.02.706.048 1.016.788.388.926 1.332 3.246 1.45 3.482.118.236.236.554.078.87-.148.326-.278.47-.514.742-.236.272-.46.48-.696.774-.216.256-.46.53-.196.998.264.46 1.174 1.936 2.522 3.136 1.734 1.542 3.194 2.02 3.648 2.246.354.178.776.138 1.05-.158.348-.376.778-.998 1.214-1.612.31-.44.702-.494 1.096-.336.398.148 2.522 1.19 2.954 1.408.432.216.72.326.826.504.108.178.108 1.028-.284 2.126z" />
      </svg>
    </a>
  );
}
