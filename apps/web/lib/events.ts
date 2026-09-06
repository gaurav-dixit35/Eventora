import { apiFetch } from './api';
export type EventSummary = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  startAt: string;
  coverImageUrl: string | null;
  city: { name: string };
  venue: { name: string };
  category: { name: string };
  ticketTypes: {
    price: string | number;
    currency: string;
    quantity: number;
    soldQuantity: number;
  }[];
};
export async function getEvents(
  query = '',
): Promise<{ items: EventSummary[]; pagination: { total: number; page: number; pages: number } }> {
  return apiFetch(`/events${query}`);
}
