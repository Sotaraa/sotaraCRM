import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import { SidebarNav } from "@/components/sidebar-nav";
import { Avatar } from "@/components/avatar";

export async function Sidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-shrink-0 flex-col border-r border-white/50 bg-white/70 shadow-glass backdrop-blur-xl">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand font-display text-xs font-bold text-white shadow-crisp">
          S
        </span>
        <span className="font-display text-[15px] font-semibold tracking-tight text-stone-900">
          Sotara CRM
        </span>
      </div>

      <div className="flex-1 px-3">
        <SidebarNav />
      </div>

      <div className="border-t border-white/50 p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <Avatar name={user.email ?? "?"} size="sm" />
          <span className="flex-1 truncate text-xs text-stone-500">{user.email}</span>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Log out"
              className="flex items-center justify-center rounded p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
            >
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
