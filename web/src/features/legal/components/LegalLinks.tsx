import Link from "next/link";

const links = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Notice" },
];

export function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Legal" className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="font-medium underline-offset-4 hover:text-white hover:underline">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
