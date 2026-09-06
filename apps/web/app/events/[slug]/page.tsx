import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
export const dynamic = 'force-dynamic';
type EventDetailData = {
  title: string;
  description: string;
  startAt: string;
  category: { name: string };
  venue: { name: string };
  city: { name: string };
  organizer: { organizationName: string };
  ticketTypes: { id: string; name: string; description: string | null; price: string | number }[];
};
export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await apiFetch<EventDetailData>(`/events/${slug}`);
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14">
      <article className="mx-auto max-w-4xl">
        <Link className="text-amber-400" href="/events">
          ← All events
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-amber-400">
          {event.category.name}
        </p>
        <h1 className="mt-3 text-4xl font-bold">{event.title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">{event.description}</p>
        <div className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:grid-cols-2">
          <p>
            <b>When</b>
            <br />
            {new Date(event.startAt).toLocaleString('en-IN')}
          </p>
          <p>
            <b>Where</b>
            <br />
            {event.venue.name}, {event.city.name}
          </p>
          <p>
            <b>Hosted by</b>
            <br />
            {event.organizer.organizationName}
          </p>
          <p>
            <b>Tickets from</b>
            <br />
            {event.ticketTypes[0] ? `₹${event.ticketTypes[0].price}` : 'Coming soon'}
          </p>
        </div>
        <h2 className="mt-10 text-2xl font-semibold">Ticket types</h2>
        <div className="mt-4 grid gap-3">
          {event.ticketTypes.map((ticket) => (
            <div
              key={ticket.id}
              className="flex justify-between rounded-xl border border-slate-800 p-4"
            >
              <span>
                <b>{ticket.name}</b>
                <br />
                {ticket.description}
              </span>
              <strong>₹{ticket.price}</strong>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}
