"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const links = [
  { name: "Browse Jobs", href: "/jobs" },
  { name: "Company", href: "/company" },
  { name: "Pricing", href: "/pricing" },
];

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const Navbar = () => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[rgba(10,10,10,0.79)] px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="relative mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#141414] px-4 shadow-lg sm:h-16 sm:px-5">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={154}
            height={44}
            loading="eager"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop links + buttons */}
        <div className="hidden items-center gap-6 font-manrope md:flex">
          <nav className="flex items-center gap-6 lg:gap-10 border-r-[3px] py-1.5 pr-6 border-[rgba(168,168,168,0.41)]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 pb-1.5 text-sm transition-colors hover:text-white ${
                  isActive(pathname, link.href)
                    ? "border-[#5C53FE] text-white"
                    : "border-transparent text-neutral-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:gap-6">
            <Link
              href="/sign-in"
              className="text-base px-6 py-4 font-medium text-[#5C53FE] transition-colors hover:opacity-80"
            >
              Sign In
            </Link>
            <Button className="inline-block bg-[#5C53FE] min-h-12.5 text-base px-6 py-3 text-white hover:bg-[#5C53FE]/90">
              Get Started
            </Button>
          </div>
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

                <div className="mt-3 flex flex-col gap-4 border-t border-white/10 pt-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg border border-white/15 px-6 py-4 text-center text-base font-medium text-[#5C53FE] transition-colors hover:bg-white/5"
                  >
                    Sign In
                  </Link>

                  <Button
                    className="block h-[50px] w-full bg-[#5C53FE] text-base text-white hover:bg-[#5C53FE]/90"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
