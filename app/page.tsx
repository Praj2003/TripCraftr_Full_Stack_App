"use client";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Typewriter } from 'react-simple-typewriter'

export default function Home() {
  return (
    <div className="min-w-full min-h-screen grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 lg:pt-20 pt-40 gap-5 lg:gap-0 md:gap-0">
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="font-bold text-white text-6xl text-center">
            Craft Your Perfect Journey with AI
          </h1>

          <p className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-300 text-lg text-center">
              <Typewriter
                words={["Plan Your Trip", "Discover New Destinations", "Experience the World"]}
                loop={0}
                cursor
                cursorStyle="_"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
          </p>

          <div className="flex items-center justify-center gap-7 mt-9">
            <Link href={"/ai"}>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "white",
                  color: "black",
                }}
                className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
              >
                Get Started
              </motion.button>
            </Link>

            <Link href={"/sign-up"}>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "white",
                  color: "black",
                }}
                className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
              >
                Sign Up
              </motion.button>
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
