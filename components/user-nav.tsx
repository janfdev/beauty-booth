"use client";

import * as React from "react";
import Link from "next/link";
import { User, LogIn, LogOut, ChevronDown, Award, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "USER" | "SUPER_ADMIN";
}

export function UserNav() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Check local session or mock auth token
    const saved = localStorage.getItem("lovefun_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginGoogle = () => {
    // Redirect to Google OAuth URL (or mock login for preview)
    const mockUser: AuthUser = {
      id: "usr_google_123",
      name: "Fauzan Rizqi",
      email: "fauzanrizqinoor@gmail.com",
      role: "SUPER_ADMIN",
    };
    localStorage.setItem("lovefun_user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("lovefun_user");
    setUser(null);
    setDropdownOpen(false);
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleLoginGoogle}
        className="rounded-full text-xs font-semibold gap-1.5"
      >
        <LogIn className="size-3.5 text-[#FB6F92]" />
        <span>Masuk Akun</span>
      </Button>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-[#FB6F92]/25 bg-white p-1 pr-3 text-xs font-bold text-[#2B2D42] shadow-2xs hover:border-[#FB6F92]/50 transition select-none"
      >
        <div className="size-7 rounded-full bg-[#FFE5EC] border border-[#FB6F92]/30 flex items-center justify-center text-[#FB6F92] font-display font-black text-xs">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
        <ChevronDown className="size-3 text-[#7D7F9A]" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-[#FB6F92]/20 bg-white/95 p-2 shadow-xl shadow-[#FB6F92]/10 backdrop-blur-md">
          <div className="px-3 py-2 border-b border-[#2B2D42]/10 mb-1">
            <p className="font-display font-bold text-xs text-[#2B2D42] truncate">{user.name}</p>
            <p className="font-mono text-[10px] text-[#7D7F9A] truncate">{user.email}</p>
          </div>

          <div className="space-y-0.5">
            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2B2D42] hover:bg-[#FFE5EC] hover:text-[#FB6F92] transition"
            >
              <User className="size-3.5" />
              <span>Profil Saya</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2B2D42] hover:bg-[#FFE5EC] hover:text-[#FB6F92] transition"
            >
              <ImageIcon className="size-3.5" />
              <span>Riwayat Photo Strip</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2B2D42] hover:bg-[#FFE5EC] hover:text-[#FB6F92] transition"
            >
              <Award className="size-3.5" />
              <span>Koleksi Badges</span>
            </Link>

            {user.role === "SUPER_ADMIN" && (
              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#FB6F92] hover:bg-[#FFE5EC] transition border-t border-[#2B2D42]/10 mt-1 pt-1.5"
              >
                <ShieldCheck className="size-3.5" />
                <span>Dashboard Admin</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition border-t border-[#2B2D42]/10 mt-1 pt-1.5"
            >
              <LogOut className="size-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
