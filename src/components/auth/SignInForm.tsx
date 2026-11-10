"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type FieldName = "email" | "password"; // type script ke bole dicchi ei form e ki ki input field ase
type FormErrors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value: string) => {
  const email = value.trim();

  if (!email) return "Email is required.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";

  return undefined;
};

const validatePassword = (value: string) => {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(value))
    return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
  if (!/[!@#$%^&*]/.test(value))
    return "Password must contain at least one special character.";

  return undefined;
};

const inputClassName =
  "h-11 rounded-lg border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500 focus-visible:border-[#5C53FE] focus-visible:ring-[#5C53FE]/30 dark:bg-white/5";

const SignInForm = () => {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== "email" && name !== "password") return;
    setValues((previous) => ({ ...previous, [name]: value }));

    // Only revalidate while the user types if the field already has an error.
    if (!errors[name]) return;

    setErrors((previous) => ({
      ...previous,
      [name]: name === "email" ? validateEmail(value) : validatePassword(value),
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== "email" && name !== "password") return;

    setErrors((previous) => ({
      ...previous,
      [name]: name === "email" ? validateEmail(value) : validatePassword(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) return;

    // TODO: integrate authentication here.
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };
    const { data: resData, error } = await signIn.email(
      {
        ...data,
      },
      {
        onRequest: () => {
          toast.loading("Signing in...", { id: "sign-in" });
        },
        onSuccess: () => {
          toast.success("Signed in successfully!", { id: "sign-in" });
          router.push("/");
        },
        onError: (err) => {
          toast.error(
            err.error.message ||
              "An error occurred while signing in.",
            { id: "sign-in" },
          );
        },
      },
    );
  };

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-neutral-200">
          Email
        </label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500"
          />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${inputClassName} pl-10`}
          />
        </div>
        {errors.email && (
          <p id="email-error" role="alert" className="text-xs text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-neutral-200"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500"
          />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`${inputClassName} pr-10 pl-10`}
          />
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((previous) => !previous)}
              className="text-neutral-400 hover:bg-white/10 hover:text-white"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-xs text-destructive"
          >
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="remember"
          className="flex cursor-pointer items-center gap-2 text-sm text-neutral-400"
        >
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="size-4 rounded border-white/20 bg-white/5 accent-[#5C53FE]"
          />
          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-[#5C53FE] underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full rounded-lg bg-[#5C53FE] text-sm font-semibold text-white shadow-lg shadow-[#5C53FE]/25 hover:bg-[#5C53FE]/90"
      >
        Sign In
      </Button>
    </form>
  );
};

export default SignInForm;
