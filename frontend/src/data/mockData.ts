import pizzaImg from "@/assets/pizza.jpg";
import burgerImg from "@/assets/burger.jpg";
import snacksImg from "@/assets/snacks.jpg";
import riceDishImg from "@/assets/rice-dish.jpg";
import biryaniImg from "@/assets/biryani.jpg";
import fuchkaImg from "@/assets/fuchka.jpg";
import fastfoodImg from "@/assets/fastfood.jpg";
import promoImg from "@/assets/promo-banner.jpg";

export interface Restaurant {
  restaurant_id: string;
  name: string;
  cuisine_type: string;
  rating: number;
  rating_count: number;
  cover_url: string;
  pricing: string;
  discount: string;
  delivery_time: string;
}

export interface Cuisine {
  name: string;
  image: string;
}

export const cuisines: Cuisine[] = [
  { name: "Pizza", image: pizzaImg },
  { name: "Burger", image: burgerImg },
  { name: "Snacks", image: snacksImg },
  { name: "Rice Dishes", image: riceDishImg },
  { name: "Fast Food", image: fastfoodImg },
  { name: "Biryani", image: biryaniImg },
];

export const restaurants: Restaurant[] = [
  {
    restaurant_id: "1",
    name: "The Panshi Restaurant",
    cuisine_type: "Bangladeshi",
    rating: 4.5,
    rating_count: 4000,
    cover_url: biryaniImg,
    pricing: "2৳",
    discount: "30% off Tk. 299: wemissyou",
    delivery_time: "15 min",
  },
  {
    restaurant_id: "2",
    name: "Prince Fuchka",
    cuisine_type: "Snacks",
    rating: 5.0,
    rating_count: 1,
    cover_url: fuchkaImg,
    pricing: "1৳",
    discount: "30% off Tk. 299: wemissyou",
    delivery_time: "30 min",
  },
  {
    restaurant_id: "3",
    name: "PizzaBurg",
    cuisine_type: "Pizza · Fast Food",
    rating: 4.2,
    rating_count: 850,
    cover_url: pizzaImg,
    pricing: "2৳",
    discount: "20% off Tk. 199",
    delivery_time: "25 min",
  },
  {
    restaurant_id: "4",
    name: "Sultan's Dine",
    cuisine_type: "Bangladeshi · Rice",
    rating: 4.7,
    rating_count: 3200,
    cover_url: riceDishImg,
    pricing: "2৳",
    discount: "15% off Tk. 399",
    delivery_time: "20 min",
  },
  {
    restaurant_id: "5",
    name: "BFC - Best Fried Chicken",
    cuisine_type: "Fast Food · Chicken",
    rating: 4.0,
    rating_count: 1500,
    cover_url: fastfoodImg,
    pricing: "2৳",
    discount: "",
    delivery_time: "20 min",
  },
  {
    restaurant_id: "6",
    name: "Dark House Burger",
    cuisine_type: "Burger · Fast Food",
    rating: 4.3,
    rating_count: 620,
    cover_url: burgerImg,
    pricing: "2৳",
    discount: "Buy 1 Get 1 Free",
    delivery_time: "35 min",
  },
];

export const popularSearches = ["Pizza", "Burger", "Chips", "Frooto", "BFC", "Dark House", "Khichuri"];

export const promoBanner = {
  image: promoImg,
  title: "Tk. 150 off new year feasts",
  code: "DEALNAO",
};
