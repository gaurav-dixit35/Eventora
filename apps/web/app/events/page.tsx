import { EventCard } from '../../components/event-card';
import { getEvents } from '../../lib/events';
export const dynamic = 'force-dynamic';
export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; category?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => Boolean(value)) as [string, string][],
  ).toString();
  const data = await getEvents(query ? `?${query}` : '');
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14">
      <header className="mx-auto mb-10 max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">Discover</p>
        <h1 className="mt-2 text-4xl font-bold">Events worth leaving home for.</h1>
        <form className="mt-6 flex max-w-xl gap-2">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search music, tech, workshops…"
            className="w-full rounded-lg bg-slate-800 p-3"
          />
          <button className="rounded-lg bg-amber-400 px-5 font-semibold text-slate-950">
            Search
          </button>
        </form>
      </header>
      <section className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </section>
      {data.items.length === 0 && (
        <p className="text-center text-slate-400">No published events match your search.</p>
      )}
    </main>
  );
}
