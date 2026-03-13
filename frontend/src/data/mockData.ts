import snacksImg from "@/assets/snacks.jpg";
import biryaniImg from "@/assets/biryani.jpg";
import fastfoodImg from "@/assets/fastfood.jpg";
import promoImg from "@/assets/promo-banner.jpg";


export interface Cuisine {
  name: string;
  image: string;
}

export const cuisines: Cuisine[] = [
  { name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Burger", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Snacks", image: snacksImg },
  { name: "Rice Dishes", image: "https://images.unsplash.com/photo-1743674453123-93356ade2891?q=80&w=734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Fast Food", image: fastfoodImg },
  { name: "Cake", image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Cafe", image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Biryani", image: biryaniImg },
  { name: "Kebab", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Chicken", image: "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Soup", image: "https://images.unsplash.com/photo-1620791144170-8a443bf37a33?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Pasta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

export const popularSearches = ["Pizza", "Burger", "Chips", "Frooto", "BFC", "Dark House", "Khichuri"];

export const promoBanner = {
  image: promoImg,
  title: "Tk. 150 off new year feasts",
  code: "DEALNAO",
};
