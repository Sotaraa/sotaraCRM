import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/companies", label: "Companies" },
  { href: "/contacts", label: "Contacts" },
];

export async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <span className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand font-display text-xs font-bold text-white">
              S
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-stone-900">
              Sotara CRM
            </span>
          </span>
          <nav className="flex gap-7 text-sm text-stone-500">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-stone-900">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout}>
          <button className="text-xs text-stone-400 transition-colors hover:text-stone-700" type="submit">
            {user.email} · Log out
          </button>
        </form>
      </div>
    </header>
  );
}
