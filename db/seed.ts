import { db } from "./index";
import { products } from "@shared/schema";

const seedProducts = [
  {
    title: "Ziarnista",
    weight: "250g",
    type: "beans",
    roast: "Średnie",
    price: "59.00",
    description: "Idealna do codziennego parzenia. Pełnia aromatu świeżo palonych ziaren.",
    imageUrl: "/Gemini_Generated_Image_49qvov49qvov49qv_1765237897906.png",
    inStock: 1
  },
  {
    title: "Ziarnista",
    weight: "1kg",
    type: "beans",
    roast: "Średnie",
    price: "189.00",
    description: "Ekonomiczne opakowanie dla prawdziwych miłośników kawy.",
    imageUrl: "/Gemini_Generated_Image_49qvov49qvov49qv_1765237897906.png",
    inStock: 1
  },
  {
    title: "Mielona",
    weight: "250g",
    type: "ground",
    roast: "Średnie",
    price: "59.00",
    description: "Wygoda i smak. Zmielona idealnie pod kawiarkę lub ekspres przelewowy.",
    imageUrl: "/Gemini_Generated_Image_49qvov49qvov49qv_1765237897906.png",
    inStock: 1
  },
  {
    title: "Mielona",
    weight: "1kg",
    type: "ground",
    roast: "Średnie",
    price: "189.00",
    description: "Duże opakowanie Twojej ulubionej kawy mielonej. Świeżość na dłużej.",
    imageUrl: "/Gemini_Generated_Image_49qvov49qvov49qv_1765237897906.png",
    inStock: 1
  }
];

async function seed() {
  console.log("Seeding database...");
  
  // Check if products already exist
  const existing = await db.select().from(products);
  if (existing.length > 0) {
    console.log("Products already seeded. Skipping...");
    return;
  }
  
  // Insert products
  await db.insert(products).values(seedProducts);
  
  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
