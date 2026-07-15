import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-forest px-4 pt-28 text-center text-white">
      <div>
        <PawPrint className="mx-auto h-14 w-14 text-peach" />
        <p className="mt-6 text-sm uppercase tracking-[0.4em] text-white/60">404</p>
        <h1 className="mt-4 font-serif text-6xl md:text-8xl">This trail wandered off.</h1>
        <p className="mx-auto mt-6 max-w-xl leading-8 text-white/75">
          The page you requested is not available. Head back home or start a booking request for your pet.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-coral px-6 py-3 font-bold text-ink">
            Home
          </Link>
          <Link href="/booking" className="rounded-full border border-white/25 px-6 py-3 font-bold">
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}
