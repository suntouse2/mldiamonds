import { ApiError } from "@/app/error/ApiError";
import { buildOrderKey } from "@/lib/buildOrderKey";
import { withErrorHandling } from "@/lib/mapError";
import { gameService } from "@/services/gameService";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { NextResponse } from "next/server";
import z from "zod";

const PostPaymentSchema = z.object({
  productId: z.string(),
  paymentMethod: z.string(),
  userCredentials: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      value: z.union([z.string(), z.number()]),
    })
  ),
  email: z.string().email(),
});
export const POST = withErrorHandling(async (req) => {
  const body = await req.json();
  const { productId, userCredentials, email } =
    await PostPaymentSchema.parseAsync(body);

  const product = await gameService.getProduct(productId);
  if (!product) throw ApiError.badRequest("Нет продукта с таким ID");

  const order = await orderService.createOrder({
    productSnapshot: product,
    userCredentials: userCredentials,
    email,
  });

  const { paymentUrl } = await paymentService.fetchPayUrl({
    orderId: order.id.toString(),
    amount: product.price,
  });

  const orderSecret = buildOrderKey(order.id);

  const response = NextResponse.json({
    orderSecret,
    redirect: paymentUrl,
  });
  response.cookies.set("order_secret", orderSecret, {
    httpOnly: true,
    secure: true,
    maxAge: 14 * 24 * 60 * 60,
  });

  return response;
});
