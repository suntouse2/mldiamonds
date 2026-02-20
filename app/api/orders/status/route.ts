import { ApiError } from "@/app/error/ApiError";
import { verifyOrderKey } from "@/lib/buildOrderKey";
import { withErrorHandling } from "@/lib/mapError";
import { orderService } from "@/services/orderService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

export const GET = withErrorHandling(async () => {
  const orderSecret = (await cookies()).get("order_secret");
  if (!orderSecret) throw ApiError.badRequest("No order secret found");

  const orderPayload = verifyOrderKey(orderSecret.value);
  const { orderId } = z
    .object({ orderId: z.coerce.number() })
    .parse(orderPayload);

  const order = await orderService.getOrder(orderId);
  if (!order) throw ApiError.badRequest("No order found with this id");

  return NextResponse.json({ order });
});
