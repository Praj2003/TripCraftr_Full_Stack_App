"use client";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";

export default function Home() {
  const words = ["Perfect", "Beautiful", "Seamless"];
  return (
    <div className="min-w-full min-h-screen grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 lg:pt-20 pt-40 gap-5 lg:gap-0 md:gap-0">
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="font-bold text-white text-6xl text-center">
            Craft Your <FlipWords words={words}  className="text-blue-500 font-bold"/> Journey with AI
          </h1>

          <div className="flex items-center justify-center gap-7 mt-9">
            <Link href={"/ai"}>
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Start Planning
                </span>
              </button>
            </Link>

            <Link href={"/sign-up"}>
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Sign Up
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="min-h-full min-w-full flex items-center justify-center mb-10 md:mb-0 lg:mb-0">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1 }}>
          <Image
            src={"/images/TripLogoHover.png"}
            width={400}
            height={400}
            alt="TripCrafter Logo"
            className="rounded-full shadow-2xl shadow-white "
          />
        </motion.div>
      </div>
    </div>
  );
}
