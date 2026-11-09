import Image from "next/image";
import {
  Briefcase,
  Building2,
  Flame,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
];

const stats = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
];

const Banner = () => {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#050505] font-manrope text-white">
      <div
        aria-hidden="true"
        className=" pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#292929_0%,#111111_28%,#050505_58%,#050505_100%)]"
      />

      <Image
        src="/images/globe-gray.png"
        alt=""
        width={1440}
        height={500}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[clamp(-9rem,-33vw,-6rem)] z-0 h-auto w-[min(1440px,150vw)] max-w-none -translate-x-1/2 select-none"
      />

      <div className="md:mt-35 mt-30   relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 sm:pt-24 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-full py-8">
            <div className="relative flex items-center justify-center w-full max-w-xl px-4">
              {/* Horizontal divider lines with gradient fade */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

              {/* Pill Badge Container */}
              <div className="absolute flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800/80 shadow-inner backdrop-blur-sm">
                {/* Briefcase Icon / Image */}
                <div className="p-1 rounded-md ">
                  💼
                </div>

                {/* Text Content */}
                <div className="flex items-center gap-1.5 text-sm md:text-[20px]  tracking-wider uppercase">
                  <span className="font-bold text-white">50,000+</span>
                  <span className="font-medium text-neutral-400">
                    New Jobs This Month
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="mt-8 font-manrope text-[32px] leading-[1.05] font-semibold tracking-[-0.04em] text-white sm:mt-4 sm:text-4xl lg:text-6xl">
            Find Your Dream Job Today
          </h1>

          <p className="mt-1 font-manrope text-base lg:text-[20px] md:text-[18px]  leading-[1.3] text-neutral-400 sm:mt-3 sm:max-w-2xl  sm:leading-relaxed">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>

          <form
            role="search"
            className="mt-3 flex w-full max-w-xl items-center rounded-full border border-white/10 bg-[#101010]/90 p-1 shadow-2xl shadow-black/40 backdrop-blur sm:mt-6 sm:max-w-2xl gap-1 sm:gap-2 sm:p-2"
          >
            <div className="flex min-w-0 flex-1 items-center gap-1 pl-1 sm:gap-2 sm:pl-2">
              <Search
                aria-hidden="true"
                className="size-2.5 shrink-0 text-neutral-500 sm:size-4"
              />
              <Input
                type="search"
                aria-label="Job title, skill or company"
                placeholder="Job title, skill or company"
                className="h-3.5 min-w-0 border-0 bg-transparent px-0 text-[10px] text-white shadow-none placeholder:text-neutral-500 focus-visible:border-0 focus-visible:ring-0 sm:h-9 sm:text-base dark:bg-transparent"
              />
            </div>

            <div
              aria-hidden="true"
              className="h-3 w-px shrink-0 bg-white/10 sm:h-7"
            />

            <div className="flex min-w-0 flex-1 items-center gap-1 pl-1 sm:gap-2 sm:pl-1.5">
              <MapPin
                aria-hidden="true"
                className="size-2.5 shrink-0 text-neutral-500 sm:size-4"
              />
              <Input
                type="text"
                aria-label="Location or remote"
                placeholder="Location or Remote"
                className="h-3.5 min-w-0 border-0 bg-transparent px-0 text-[10px] text-white shadow-none placeholder:text-neutral-500 focus-visible:border-0 focus-visible:ring-0 sm:h-9 sm:text-base dark:bg-transparent"
              />
            </div>

            <Button
              type="submit"
              size="icon"
              aria-label="Search jobs"
              className="size-3.5 rounded-full bg-[#5c53fe] text-white shadow-lg shadow-[#5c53fe]/30 hover:bg-[#5c53fe]/90 sm:size-9"
            >
              <Search className="size-2.5 sm:size-4" />
            </Button>
          </form>

          <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-1 font-manrope sm:mt-4 sm:gap-2">
            <span className="mr-0.5 text-sm text-neutral-500 sm:mr-1 sm:text-base">
              Trending Position
            </span>
            {trendingPositions.map((position) => (
              <Badge
                key={position}
                variant="outline"
                className="h-6 rounded-full border-white/10 bg-white/5 px-1 text-xs font-normal text-neutral-300  sm:text-sm"
              >
                {position}
              </Badge>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto pt-20 sm:pt-30 md:pt-35 lg:pt-50 pb-8 sm:mt-8 sm:pb-12">
          <p className="font-manrope text-center text-[20px] leading-[1.15] font-medium text-neutral-200 sm:text-[25px] sm:leading-snug lg:text-[40px]">
            Assisting over 15,000 job seekers
            <br />
            <span className="font-normal text-neutral-400">
              find their dream positions.
            </span>
          </p>

          <div className="mt-2 grid grid-cols-4 gap-1.5 sm:mt-8 sm:gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <Card
                key={label}
                className="min-w-0 gap-0 rounded-lg border border-white/5 bg-gradient-to-b from-[#19191c] to-[#0b0b0d] py-2 shadow-lg shadow-black/20 ring-0 sm:rounded-2xl sm:py-5"
              >
                <CardContent className="flex min-w-0 flex-col px-1.5 sm:px-5">
                  <Icon
                    aria-hidden="true"
                    className="size-2.5 text-neutral-400 sm:size-5"
                  />
                  <p className="mt-2 font-plus-jakarta text-sm leading-none font-semibold tracking-tight text-white sm:mt-7 sm:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 font-manrope text-[6px] leading-tight text-neutral-400 sm:text-xs">
                    {label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
