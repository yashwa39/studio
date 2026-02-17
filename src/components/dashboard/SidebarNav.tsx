"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings2, Info, BookOpen, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Driver Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'What-If Scenarios', href: '/scenarios', icon: Settings2 },
  { name: 'Education Center', href: '/tutorial', icon: BookOpen },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-md flex flex-col hidden md:flex">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="p-2 bg-primary rounded-lg">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight leading-none">VISIONARY</h1>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-1">Transit Guardian</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <div className="bg-secondary/50 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
            <Info className="w-3 h-3" />
            System Status
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-medium">Sensors Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-medium">AI Core Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}