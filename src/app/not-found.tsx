import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center text-center px-4">
      <h2 className="text-6xl font-bold text-coral">404</h2>
      <p className="mt-2 text-lg font-medium text-charcoal">
        Page not found
      </p>
      <p className="mt-1 text-sm text-warm-gray">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white hover:bg-coral/90 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
