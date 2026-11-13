import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  Headphones,
  Landmark,
  Layers,
  Lock,
  Megaphone,
  Palette,
  PenLine,
  Server,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Each job category gets its own icon and colour so cards are easy to scan.
 * Add a new entry here when a new category is introduced.
 */
const categoryStyles: Record<
  string,
  { icon: LucideIcon; className: string }
> = {
  "Engineering & Tech": {
    icon: Code2,
    className: "bg-[#5C53FE]/15 text-[#8B85FF]",
  },
  Design: { icon: Palette, className: "bg-orange-500/15 text-orange-400" },
  Product: { icon: Layers, className: "bg-sky-500/15 text-sky-400" },
  Infrastructure: { icon: Server, className: "bg-sky-500/15 text-sky-400" },
  Marketing: { icon: Megaphone, className: "bg-pink-500/15 text-pink-400" },
  Sales: { icon: TrendingUp, className: "bg-emerald-500/15 text-emerald-400" },
  Finance: { icon: Landmark, className: "bg-amber-500/15 text-amber-400" },
  "Human Resources": {
    icon: Users,
    className: "bg-rose-500/15 text-rose-400",
  },
  Operations: { icon: Settings2, className: "bg-cyan-500/15 text-cyan-400" },
  Quality: { icon: ShieldCheck, className: "bg-emerald-500/15 text-emerald-400" },
  "Quality Assurance": {
    icon: ShieldCheck,
    className: "bg-emerald-500/15 text-emerald-400",
  },
  "Data & Analytics": {
    icon: BarChart3,
    className: "bg-indigo-500/15 text-indigo-400",
  },
  Management: {
    icon: UsersRound,
    className: "bg-violet-500/15 text-violet-400",
  },
  "Content & Writing": {
    icon: PenLine,
    className: "bg-amber-500/15 text-amber-400",
  },
  Security: { icon: Lock, className: "bg-red-500/15 text-red-400" },
  "Customer Support": {
    icon: Headphones,
    className: "bg-teal-500/15 text-teal-400",
  },
};

const fallbackStyle = {
  icon: BriefcaseBusiness,
  className: "bg-white/5 text-muted-foreground",
};

export function JobLogo({ category }: { category: string }) {
  const { icon: Icon, className } = categoryStyles[category] ?? fallbackStyle;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg",
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}
