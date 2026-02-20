"use server";

import Ordered from "@/app/components/Ordered";
import { gameService } from "@/services/gameService";

export default async function SuccessPage() {
  const categories = await gameService.getCategories();
  const products = categories.flatMap((c) => c.products);

  return <Ordered products={products} />;
}
