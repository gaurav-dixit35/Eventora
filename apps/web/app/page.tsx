import Link from 'next/link';
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-slate-100">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
          Eventora
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Find your next moment.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Event discovery and ticketing, built for attendees, organizers, and communities.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950"
            href="/events"
          >
            Explore events
          </Link>
          <Link className="rounded-full border border-slate-600 px-5 py-3" href="/signup">
            Join Eventora
          </Link>
        </div>
      </section>
    </main>
  );
}
