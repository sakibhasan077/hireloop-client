
import Link from "next/link";
import {
  ShieldAlert,
  LockKeyhole,
  ArrowLeft,
  Home,
} from "lucide-react";
import BackButton from "./_conponents/BackButton";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-lg text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-950/50">
            <ShieldAlert
              size={48}
              className="text-red-600 dark:text-red-400"
            />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white">
          403
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Unauthorized Access
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          Sorry! You don &lsquot; t have permission to access this page.
          Please log in with an authorized account or contact
          the administrator for assistance.
        </p>

        {/* Notice */}
        <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-left">
          <LockKeyhole className="shrink-0 text-red-600 dark:text-red-400" size={22} />
          <p className="text-sm text-red-700 dark:text-red-300">
            Access to this resource is restricted.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <BackButton></BackButton>

        </div>
      </div>
    </main>
  );
}
