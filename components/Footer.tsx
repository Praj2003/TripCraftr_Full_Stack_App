"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="min-w-full bg-black p-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 text-white gap-4">
      <div className="flex w-full items-center justify-center">
        <Image
          width={200}
          height={200}
          src={"/images/TripCrafter.png"}
          alt="Main Logo of Website"
        ></Image>
      </div>

      <div className="w-full flex flex-col items-center gap-8 p-2">
        <div className="w-full flex justify-center items-center">
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "white",
              color: "black",
            }}
            className="px-3 py-1 text-white font-bold text-md cursor-pointer rounded-lg"
          >
            Home
          </motion.button>
        </div>

        <div>
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "white",
              color: "black",
            }}
            className="px-3 py-1 text-white font-bold text-md cursor-pointer rounded-lg"
          >
            Subscribe
          </motion.button>
        </div>

        <div>
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "white",
              color: "black",
            }}
            className="px-3 py-1 text-white font-bold text-md cursor-pointer rounded-lg"
          >
            Contact Us
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col items-center p-4 gap-8 w-full">
        <div className="w-full flex justify-between items-center text-md font-bold">
          <p>Contact Us:</p>
          <p>+91 1234567890</p>
        </div>

        <div className="w-full flex justify-between items-center text-md font-bold">
          <p>office Address:</p>
          <p>T-29 Green Park,New Delhi,IND</p>
        </div>

        <div className="w-full flex justify-between items-center text-md font-bold">
          <p>Email:</p>
          <p>TripCraftr@gmail.com</p>
        </div>
      </div>

      <div className="w-full p-6 text-md font-bold flex flex-col items-center gap-4">
        <p className="text-md font-bold text-center mb-4">
          Connect with us on social media:
        </p>

        <div className="w-full flex items-center justify-center gap-9 ">
          <motion.div whileHover={{ scale: 1.1, color: "pink" }}>
            <Link
              href={"https://www.linkedin.com/in/prajval-kanda-831759237/"}
              className="text-4xl font-bold"
            >
              <FaLinkedin />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, color: "pink" }}>
            <Link
              href={"https://www.linkedin.com/in/prajval-kanda-831759237/"}
              className="text-4xl font-bold"
            >
              <FaGithub />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
