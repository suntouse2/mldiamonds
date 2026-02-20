"use client";

import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { CaseItem } from "./Ordered";

interface Props {
  allItems: CaseItem[];
  winTitle: string;
  onDone: () => void;
}

const ITEM_WIDTH = 150;
const GAP = 12;
const WIN_INDEX = 30; // Позиция выигрыша в ленте

export function CaseOpening({ allItems, winTitle, onDone }: Props) {
  const controls = useAnimationControls();

  const spinItems = useMemo(() => {
    // Создаем ленту: 30 случайных + Победитель + 10 случайных
    const list = Array.from(
      { length: WIN_INDEX },
      () => allItems[Math.floor(Math.random() * allItems.length)]
    );

    const winner = allItems.find((i) => i.title === winTitle) || allItems[0];
    list.push(winner);

    for (let i = 0; i < 10; i++) {
      list.push(allItems[Math.floor(Math.random() * allItems.length)]);
    }
    return list;
  }, [allItems, winTitle]);

  useEffect(() => {
    const fullWidth = ITEM_WIDTH + GAP;
    const targetX = WIN_INDEX * fullWidth;
    // Рандомное смещение внутри карточки для реализма
    const offset = (Math.random() - 0.5) * (ITEM_WIDTH * 0.8);

    controls
      .start({
        x: -(targetX + offset),
        transition: {
          duration: 7,
          ease: [0.1, 0, 0.05, 1], // Плавное замедление (как в CS:GO)
        },
      })
      .then(() => {
        setTimeout(onDone, 1200);
      });
  }, [controls, onDone]);

  return (
    <div className="relative w-full overflow-hidden bg-zinc-950/50 py-12 rounded-2xl border border-zinc-900 shadow-2xl">
      {/* Прицел */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-yellow-500 z-30 -translate-x-1/2 shadow-[0_0_15px_rgba(234,179,8,0.6)]" />

      {/* Маскировка краев */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

      <motion.div
        animate={controls}
        initial={{ x: 0 }}
        className="flex"
        style={{
          gap: GAP,
          paddingLeft: `calc(50% - ${ITEM_WIDTH / 2}px)`,
        }}
      >
        {spinItems.map((item, i) => (
          <div
            key={i}
            className="relative shrink-0 flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl"
            style={{ width: ITEM_WIDTH, height: 160 }}
          >
            <div className="relative w-20 h-20 mb-2 drop-shadow-2xl">
              <Image src={item.image} alt="" fill className="object-contain" />
            </div>
            <p className="text-white font-black text-xl italic uppercase leading-none">
              {item.title}
            </p>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">
              Mobile Legends
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
