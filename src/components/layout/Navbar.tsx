"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session?.user;
  // The dashboard has its own chrome (sidebar), so hide the site navbar there.
  const links = [
    { name: "Browse Jobs", href: "/brows-jobs" },
    { name: "Company", href: "/company" },
    { name: "Pricing", href: "/pricing" },
    { name: "Dashboard", href: `/dashboard/${session?.user.role || "seeker"}` },
  ];
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const handleSignout = async () => {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          toast.loading("Signing out...", { id: "signOut" });
        },
        onSuccess: () => {
          router.push("/sign-in"); // redirect to login page
          toast.success("Signed out successfully", { id: "signOut" });
        },
        onError: (err) => {
          toast.error(`Error signing out: ${err.error.message}`, {
            id: "signOut",
          });
        },
      },
    });
  };

  if (isDashboard) return null;

  return (
    <header className="fixed top-0 z-50 w-full px-3 pt-1.5 sm:px-5 sm:pt-2">
      <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#141414] px-3 shadow-lg sm:h-12 sm:px-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={154}
            height={44}
            loading="eager"
            className="h-5 w-auto sm:h-6"
          />
        </Link>

        {/* Desktop links + buttons */}
        <div className="hidden items-center gap-3 font-manrope md:flex lg:gap-5">
          <nav className="flex items-center gap-3 border-r border-[rgba(168,168,168,0.41)] py-1 pr-3 lg:gap-6 lg:pr-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b pb-1 text-[10px] transition-colors hover:text-white lg:text-xs ${
                  isActive(pathname, link.href)
                    ? "border-[#5C53FE] text-white"
                    : "border-transparent text-neutral-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          {/* log-in and sign up buttons */}
          {user ? (
            <button
              onClick={handleSignout}
              className="inline-block min-h-7 bg-red-600 px-5.5 py-3 text-[10px] text-white hover:bg-red-600/90 lg:px-3 lg:text-xs rounded-md"
            >
              Sign out
            </button>
          ) : (
            <div className="flex items-center gap-2 lg:gap-4">
              <Link
                href="/sign-in"
                className="px-2 py-1 text-xs font-medium text-[#5C53FE] transition-colors hover:opacity-80 lg:px-3"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="inline-block min-h-7 bg-[#5C53FE] px-5.5 py-3 text-[10px] text-white hover:bg-[#5C53FE]/90 lg:px-3 lg:text-xs rounded-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu — click the icon to open */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className={`text-white hover:bg-white/10 ${
              menuOpen ? "border-white/20 bg-white/5" : ""
            }`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
          </Button>

          {menuOpen && (
            <>
              {/* Click anywhere outside closes the menu */}
              <div
                className="fixed inset-0"
                onClick={() => setMenuOpen(false)}
              />

              <div className="absolute inset-x-2 top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#141414] p-3 font-manrope shadow-lg">
                <nav className="flex flex-col gap-1">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-md border-b-2 px-3 py-2.5 text-[16px] transition-colors hover:bg-white/10 hover:text-white ${
                        isActive(pathname, link.href)
                          ? "border-[#5C53FE] text-white"
                          : "border-transparent text-neutral-400"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                {/* Login and sign up buttons */}
                {user ? (
                  <button
                    onClick={handleSignout}
                    className="inline-block min-h-7 bg-red-600 px-5.5 py-3 text-[10px] text-white hover:bg-red-600/90 lg:px-3 lg:text-xs rounded-md"
                  >
                    Sign out
                  </button>
                ) : (
                  <div className="mt-3 flex flex-col gap-4 border-t border-white/10 pt-3">
                    <Link
                      href="/sign-in"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg border border-white/15 px-6 py-4 text-center text-base font-medium text-[#5C53FE] transition-colors hover:bg-white/5"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      className="block px-5.5 py-3 w-full bg-[#5C53FE] text-base text-white hover:bg-[#5C53FE]/90"
                      onClick={() => setMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
