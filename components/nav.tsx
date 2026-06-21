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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold text-brand">Sotara CRM</span>
          <nav className="flex gap-6 text-sm font-medium text-slate-600">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout}>
          <button className="text-sm text-slate-500 hover:text-slate-800" type="submit">
            Log out ({user.email})
          </button>
        </form>
      </div>
    </header>
  );
}
