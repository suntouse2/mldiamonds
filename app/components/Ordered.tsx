"use client";

import axios from "axios";
import { useState, useEffect, useMemo, useCallback } from "react";
import useInterval from "use-interval";
import { Order, Product } from "@prisma/client";
import { CaseOpening } from "./CaseOpening";
import Image from "next/image";
import { Loader } from "lucide-react";
import useSupport from "../hooks/useSupport";
import ButtonLink from "../ui/ButtonLink";
import { useRouter } from "next/navigation";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

type Props = {
  products: Product[];
  specialProducts: Product[];
};

export type CaseItem = {
  title: string;
  image: string;
};

export default function Ordered({ products, specialProducts }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [delay, setDelay] = useState<number | null>(2000);
  const { support } = useSupport();

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get<{ order?: Order | null }>(
        "/api/orders/status"
      );
      const currentOrder = data?.order ?? null;
      setOrder(currentOrder);

      if (!currentOrder || currentOrder.status !== "CREATED") {
        setDelay(null);
      }
    } catch (e) {
      console.error("Fetch error", e);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useInterval(fetchOrder, delay);

  const productSnapshot = order
    ? (order.productSnapshot as object as Product)
    : null;
  const winTitle = parseInt(
    (productSnapshot?.data as { title: string })?.title ?? "0"
  );

  const receipt = (p: Product) => {
    router.push(`/receipt?productId=${p.id}`);
  };

  const allItems: CaseItem[] = useMemo(
    () =>
      products.map((p) => ({
        title: p.title ?? "",
        image: p.imageSrc || "/products/mobile-legends/1.webp",
      })),
    [products]
  );

  const onAnimationDone = useCallback(async () => {
    await axios.get("/api/orders/done");
    fetchOrder();
  }, []);

  if (!order || !productSnapshot || order.status === "CREATED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader className="animate-spin text-yellow-500" />
        <p className="text-zinc-400 animate-pulse">Ожидание оплаты...</p>
      </div>
    );
  }

  if (order.status === "DONE" || productSnapshot.price <= 58) {
    return (
      <div className="flex flex-col items-center py-10 animate-in fade-in duration-700">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center shadow-2xl">
          <Image
            src="/products/mobile-legends/1.webp"
            alt="Winner"
            width={120}
            height={120}
          />
          <h2 className="text-4xl font-black mt-4">{winTitle} Алмазов</h2>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px] mt-2">
            Заказ выполнен
          </p>
          <p className="mt-2 font-semibold text-white">
            Вы {productSnapshot.price > 58 && " открыли кейс и "} получили{" "}
            {winTitle} Алмазов
          </p>

          <Modal
            className="w-full max-w-5xl"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <h1 className="text-center text-xl font-bold">
              СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ
            </h1>
            <div className="flex flex-col mt-4 gap-2">
              {specialProducts.map((p) => (
                <div
                  className="flex border-b pb-4 gap-4 border-white/10 items-center"
                  key={p.id}
                >
                  <Image
                    src={p.imageSrc ?? ""}
                    alt={p.title}
                    width={120}
                    height={120}
                  />
                  <div>
                    <div className="flex items-center gap-1 mt-2 justify-left">
                      <h2 className="text-xl font-bold">{p.title}</h2>
                      <Image
                        width={40}
                        height={40}
                        alt="UC"
                        src="/coins/diamond.webp"
                      />
                    </div>

                    <Button
                      onClick={() => receipt(p)}
                      className="mt-4 bg-amber-300! text-nowrap text-black! text-center!"
                    >
                      Купить за {p.price} ₽
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-amber-300! text-black! w-full! text-center!"
          >
            ЗАБРАТЬ С 50% СКИДКОЙ
          </Button>

          <ButtonLink
            href={support ?? ""}
            className="mt-2 text-center! w-full!"
          >
            Связаться с нами
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <CaseOpening
        allItems={allItems}
        winTitle={winTitle.toString()}
        onDone={onAnimationDone}
      />
    </div>
  );
}
