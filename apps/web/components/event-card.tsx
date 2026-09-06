import Link from 'next/link';
import type { EventSummary } from '../lib/events';
export function EventCard({ event }: { event: EventSummary }) {
  const ticket = event.ticketTypes[0];
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-amber-400"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
        {event.category.name}
      </p>
      <h2 className="mt-2 text-xl font-semibold group-hover:text-amber-300">{event.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-slate-400">{event.shortDescription}</p>
      <div className="mt-5 flex items-end justify-between text-sm">
        <span>
          {new Date(event.startAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          <br />
          {event.city.name}
        </span>
        <strong>
          {ticket
            ? `${ticket.currency === 'INR' ? '₹' : ticket.currency}${ticket.price}`
            : 'Tickets soon'}
        </strong>
      </div>
    </Link>
  );
}
