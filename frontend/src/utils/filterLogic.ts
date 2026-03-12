import type { Restaurant } from "@/types/restaurant";

export interface Filters {
  sortBy: string;
  ratingsAbove4: boolean;
  superRestaurant: boolean;
  freeDelivery: boolean;
  acceptsVouchers: boolean;
  deals: boolean;
  cuisines: string[];
  priceRanges: string[];
}

export const defaultFilters: Filters = {
  sortBy: "relevance",
  ratingsAbove4: false,
  superRestaurant: false,
  freeDelivery: false,
  acceptsVouchers: false,
  deals: false,
  cuisines: [],
  priceRanges: [],
};

export function applyFilters(restaurants: Restaurant[], filters: Filters): Restaurant[] {
  let result = [...restaurants];

  // Ratings above 4
  if (filters.ratingsAbove4) {
    result = result.filter((r) => (typeof (r as any).rating === 'number' ? (r as any).rating >= 4 : true));
  }

  // Super restaurant (assuming a boolean field isSuperRestaurant)
  if (filters.superRestaurant) {
    result = result.filter((r) => (r as any).isSuperRestaurant === true);
  }

  // Free delivery (assuming a boolean or numeric field freeDeliveryAmount or free_delivery)
  if (filters.freeDelivery) {
    result = result.filter((r) => (r as any).freeDeliveryAmount === 0 || (r as any).free_delivery === true);
  }

  // Accepts vouchers (assuming a boolean field acceptsVouchers)
  if (filters.acceptsVouchers) {
    result = result.filter((r) => (r as any).acceptsVouchers === true);
  }

  // Deals (assuming a field discount or offer)
  if (filters.deals) {
    result = result.filter((r) => (r as any).discount || (r as any).offer);
  }

  // Cuisine filter (by cuisine_type)
  if (filters.cuisines.length > 0) {
    result = result.filter((r) =>
      filters.cuisines.some((c) =>
        (r.cuisine_type || '').toLowerCase().includes(c.toLowerCase())
      )
    );
  }

  // Price range filter (by pricing)
  if (filters.priceRanges.length > 0) {
    result = result.filter((r) => filters.priceRanges.includes((r.pricing || '').trim()));
  }

  // Sorting
  switch (filters.sortBy) {
    case 'topRated':
      result = result.slice().sort((a, b) => ((b as any).rating || 0) - ((a as any).rating || 0));
      break;
    case 'fastest':
      result = result.slice().sort((a, b) => {
        const aTime = parseInt((a as any).delivery_time || (a as any).deliveryTime || '999', 10);
        const bTime = parseInt((b as any).delivery_time || (b as any).deliveryTime || '999', 10);
        return aTime - bTime;
      });
      break;
    default:
      break;
  }

  return result;
}

export function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.sortBy !== "relevance") count++;
  if (filters.ratingsAbove4) count++;
  if (filters.superRestaurant) count++;
  if (filters.freeDelivery) count++;
  if (filters.acceptsVouchers) count++;
  if (filters.deals) count++;
  count += filters.cuisines.length;
  count += filters.priceRanges.length;
  return count;
}
