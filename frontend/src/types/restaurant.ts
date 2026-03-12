export interface Restaurant {
  restaurant_id: string;
  name: string;
  description?: string;
  cuisine_type: string;
  pricing?: string;
  cover_url?: string;
  logo_url?: string;
}

export interface Rating {
  rating_id: string;
  restaurant_id: string;
  rating: number;
}

export interface Discount {
  discount_id: string;
  restaurant_id: string;
  name: string;
  discount: number;
  start_date: string;
  end_date: string;
}
