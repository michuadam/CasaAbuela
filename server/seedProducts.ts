import { db } from "../db/index";
import { products, type InsertProduct } from "@shared/schema";

const defaultProducts: InsertProduct[] = [
  {
    title: "Całe Ziarna - Ciemne Palenie 250g",
    weight: "250g",
    type: "beans",
    roast: "dark",
    price: "49.00",
    description: "Idealne do espresso. Intensywny, głęboki smak z nutami czekolady i orzechów. Ręcznie zbierane na naszej rodzinnej plantacji w regionie Huila.",
    imageUrl: "/images/coffee-dark-250.jpg",
    inStock: 1
  },
  {
    title: "Całe Ziarna - Ciemne Palenie 1kg",
    weight: "1kg",
    type: "beans",
    roast: "dark",
    price: "169.00",
    description: "Idealne do espresso. Intensywny, głęboki smak z nutami czekolady i orzechów. Ręcznie zbierane na naszej rodzinnej plantacji w regionie Huila.",
    imageUrl: "/images/coffee-dark-1kg.jpg",
    inStock: 1
  },
  {
    title: "Całe Ziarna - Jasne Palenie 250g",
    weight: "250g",
    type: "beans",
    roast: "light",
    price: "49.00",
    description: "Idealne do kawy przelewowej i dripa. Delikatny, owocowy smak z nutami cytrusów i kwiatów. Ręcznie zbierane na naszej rodzinnej plantacji w regionie Huila.",
    imageUrl: "/images/coffee-light-250.jpg",
    inStock: 1
  },
  {
    title: "Całe Ziarna - Jasne Palenie 1kg",
    weight: "1kg",
    type: "beans",
    roast: "light",
    price: "169.00",
    description: "Idealne do kawy przelewowej i dripa. Delikatny, owocowy smak z nutami cytrusów i kwiatów. Ręcznie zbierane na naszej rodzinnej plantacji w regionie Huila.",
    imageUrl: "/images/coffee-light-1kg.jpg",
    inStock: 1
  },
  {
    title: "Kawa Mielona - Ciemne Palenie 250g",
    weight: "250g",
    type: "ground",
    roast: "dark",
    price: "52.00",
    description: "Świeżo mielona, idealna do espresso. Intensywny, głęboki smak z nutami czekolady i orzechów. Ręcznie zbierane na naszej rodzinnej plantacji w regionie Huila.",
    imageUrl: "/images/coffee-ground-dark-250.jpg",
    inStock: 1
  },
  {
    title: "Kawa Mielona - Ciemne Palenie 1kg",
    weight: "1kg",
    type: "ground",
    roast: "dark",
    price: "179.00",
    description: "Świeżo mielona, idealna do espresso. Intensywny, głęboki smak z nutami czekolady i orzechów. Ręcznie zbierane na naszej rodzinnej plantacji w regionie Huila.",
    imageUrl: "/images/coffee-ground-dark-1kg.jpg",
    inStock: 1
  },
  {
    title: "Kawa Mielona - Jasne Palenie 250g",
    weight: "250g",
    type: "ground",
    roast: "light",
    price: "52.00",
    description: "Świeżo mielona, idealna do dripa i przelewu. Delikatny, owocowy smak z nutami cytrusów i kwiatów. Ręcznie zbierane na naszej rodzinnej plantacji w regionie Huila.",
    imageUrl: "/images/coffee-ground-light-250.jpg",
    inStock: 1
  },
  {
    title: "Kawa Mielona - Jasne Palenie 1kg",
    weight: "1kg",
    type: "ground",
    roast: "light",
    price: "179.00",
    description: "Świeżo mielona, idealna do dripa i przelewu. Delikatny, owocowy smak z nutami cytrusów i kwiatów. Ręcznie zbierane na naszej rodzinnej plantacji w regionie Huila.",
    imageUrl: "/images/coffee-ground-light-1kg.jpg",
    inStock: 1
  }
];

export async function seedProducts(): Promise<void> {
  try {
    const existingProducts = await db.select().from(products);
    
    if (existingProducts.length === 0) {
      console.log("No products found, seeding default products...");
      await db.insert(products).values(defaultProducts);
      console.log(`Seeded ${defaultProducts.length} products successfully`);
    } else {
      console.log(`Found ${existingProducts.length} existing products, skipping seed`);
    }
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}
