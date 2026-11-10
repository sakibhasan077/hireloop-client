"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type FieldName = "name" | "email" | "password" | "confirmPassword";
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateName = (value: string) => {
  const name = value.trim();

  if (!name) return "Full name is required.";
  if (name.length < 3) return "Full name must be at least 3 characters.";

  return undefined;
};

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
  if (!/[0-9]/.test(value))
    return "Password must contain at least one number.";
  if (!/[!@#$%^&*]/.test(value))
    return "Password must contain at least one special character.";

  return undefined;
};

const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) return "Please confirm your password.";
  if (confirmPassword !== password) return "Passwords do not match.";

  return undefined;
};

const inputClassName =
  "h-11 rounded-lg border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500 focus-visible:border-[#5C53FE] focus-visible:ring-[#5C53FE]/30 dark:bg-white/5";

const isFieldName = (name: string): name is FieldName =>
  name === "name" ||
  name === "email" ||
  name === "password" ||
  name === "confirmPassword";

const validateField = (name: FieldName, values: FormValues) => {
  switch (name) {
    case "name":
      return validateName(values.name);
    case "email":
      return validateEmail(values.email);
    case "password":
      return validatePassword(values.password);
    case "confirmPassword":
      return validateConfirmPassword(values.password, values.confirmPassword);
  }
};

const SignUpForm = () => {
  const router = useRouter()
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (!isFieldName(name)) return;

    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    // Only revalidate while the user types if the field already has an error.
    setErrors((previous) => {
      const nextErrors = { ...previous };

      if (previous[name]) {
        nextErrors[name] = validateField(name, nextValues);
      }

      // Keep the confirmation in sync when the password changes.
      if (name === "password" && previous.confirmPassword) {
        nextErrors.confirmPassword = validateConfirmPassword(
          value,
          nextValues.confirmPassword,
        );
      }

      return nextErrors;
    });
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (!isFieldName(name)) return;

    setErrors((previous) => ({
      ...previous,
      [name]: validateField(name, { ...values, [name]: value }),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(
        values.password,
        values.confirmPassword,
      ),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    // TODO: integrate authentication here.
    const form = event.currentTarget
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as {name: string; email: string; password: string;}
    const {data:resData, error} = await signUp.email({
      ...data
    },{
      onRequest:()=>{
        toast.loading("Creating your account...", {id: "sign-up"})
      },
      onSuccess:()=>{
        toast.success("Account created successfully!", {id: "sign-up"})
        router.push("/")
      },
      onError:(err)=>{
        toast.error(err.error.message || "An error occurred while creating your account.", {id: "sign-up"})
      }

    })
  };

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-neutral-200">
          Full name
        </label>
        <div className="relative">
          <User
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500"
          />
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            required
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${inputClassName} pl-10`}
          />
        </div>
        {errors.name && (
          <p id="name-error" role="alert" className="text-xs text-destructive">
            {errors.name}
          </p>
        )}
      </div>

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
            autoComplete="new-password"
            placeholder="Create a strong password"
            required
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "password-hint password-error" : "password-hint"
            }
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
        <p id="password-hint" className="text-xs text-neutral-500">
          Must be 8+ characters with an uppercase letter, lowercase letter,
          number, and special character.
        </p>
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

      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-neutral-200"
        >
          Confirm password
        </label>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500"
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            required
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            className={`${inputClassName} pr-10 pl-10`}
          />
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              className="text-neutral-400 hover:bg-white/10 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            role="alert"
            className="text-xs text-destructive"
          >
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full rounded-lg bg-[#5C53FE] text-sm font-semibold text-white shadow-lg shadow-[#5C53FE]/25 hover:bg-[#5C53FE]/90"
      >
        Create Account
      </Button>
    </form>
  );
};

export default SignUpForm;
