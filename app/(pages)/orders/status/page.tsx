"use server";

import Ordered from "@/app/components/Ordered";
import { gameService } from "@/services/gameService";

export default async function SuccessPage() {
  const categories = await gameService.getCategories();
  const products = categories
    .flatMap((c) => c.products)
    .filter((p) => !p.isSpecial);

  const specialProducts = categories
    .flatMap((c) => c.products)
    .filter((p) => p.isSpecial);

  return <Ordered products={products} specialProducts={specialProducts} />;
}
