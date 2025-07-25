"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="min-w-full fixed top-0 flex justify-between items-center z-20 bg-black">
      <div className="logo flex items-center justify-center">
        <Image
          src={"/images/TripCrafter.png"}
          width={100}
          height={100}
          alt="Website logo"
          className="cursor-pointer"
        ></Image>
      </div>

      <div className="items-center justify-center gap-10 hidden md:flex lg:flex">
        <Link href="/">
          <motion.div
            whileHover={{
              scale: 1.1,
              backgroundColor: "white",
              color: "black",
            }}
            className="px-3 py-2  text-white rounded-lg font-bold"
          >
            <p>Home</p>
          </motion.div>
        </Link>
        <Link href="/subscribe">
          <motion.div
            whileHover={{
              scale: 1.1,
              backgroundColor: "white",
              color: "black",
            }}
            className="px-3 py-2  text-white rounded-lg font-bold"
          >
            <p>Subscribe</p>
          </motion.div>
        </Link>
        <Link href="/subscribe">
          <motion.div
            whileHover={{
              scale: 1.1,
              backgroundColor: "white",
              color: "black",
            }}
            className="px-3 py-2  text-white rounded-lg font-bold"
          >
            <p>Contact Us</p>
          </motion.div>
        </Link>
      </div>

      <div className="flex items-center justify-between mr-5">
        <div className="md:hidden lg:hidden">
          <Link href="/menu">
            <motion.div
              whileHover={{
                scale: 1.1,
                backgroundColor: "white",
                color: "black",
              }}
              className="px-3 py-2 text-white rounded-lg font-bold"
            >
              <GiHamburgerMenu size={30} />
            </motion.div>
          </Link>
        </div>
        <SignedOut>
          <div className="flex items-center justify-center">
            <SignInButton>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "purple",
                  color: "white",
                }}
                className="px-3 py-2 bg-white text-black font-bold rounded-lg cursor-pointer"
              >
                Sign In
              </motion.button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center justify-center gap-5">
            <div>
              <UserButton />
            </div>

            <div>
              <SignOutButton>
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "purple",
                    color: "white",
                  }}
                  className="px-3 py-2 bg-white text-black font-bold rounded-lg cursor-pointer"
                >
                  Sign Out
                </motion.button>
              </SignOutButton>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
