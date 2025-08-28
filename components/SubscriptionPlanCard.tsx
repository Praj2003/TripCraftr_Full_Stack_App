"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import { motion } from "motion/react";

import { useState, useEffect } from "react";

type Details = {
  name: string;
  price: number;
  benefits?: string[];
  onRequestRevoke?: () => void;
};

declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

import { useUser } from "@clerk/nextjs";

import { toast } from "sonner";

const SubscriptionPlanCard = ({
  name,
  price,
  benefits,
  onRequestRevoke,
}: Details) => {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const { user } = useUser();
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector("#razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    const fetchSubscriptionStatus = async () => {
      try {
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) {
          toast.error("User email not found. Please log in again.", {
            duration: 5000,
          });
          return;
        }
        const response = await fetch(
          `/api/createPayment?email=${encodeURIComponent(
            email
          )}&plan=${encodeURIComponent(name)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.subStatus !== undefined) {
          setIsActive(data.subStatus);
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        toast.error(
          "Failed to fetch subscription status. Please try again later.",
          {
            duration: 5000,
          }
        );
      }
    };

    fetchSubscriptionStatus();
  }, [user?.primaryEmailAddress?.emailAddress, name]);

  const handlePayment = async () => {
    try {
      const isScriptLoaded = await loadRazorpayScript();
      console.log("✅ Razorpay script loaded:");
      if (!isScriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please try again later.", {
          duration: 5000,
        });
        return;
      }

      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        toast.error("User email not found. Please log in again.", {
          duration: 5000,
        });
        return;
      }

      const orderResponse = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: price }),
      });

      const orderData = await orderResponse.json();

      // ✅ Change 2: Guard against failed order creation
      if (!orderResponse.ok || !orderData?.data?.id) {
        toast.error("Failed to create Razorpay order. Please try again.", {
          duration: 5000,
        });
        return;
      }

      console.log("🔑 Razorpay key:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "TripCraftr Subscription",
        description: "Cart Checkout Payment",
        order_id: orderData.data.id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) {
          try {
            const result = await fetch("/api/createPayment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: response.razorpay_payment_id,
                plan: name,
                email: email,
                amount: price,
              }),
            });

            const paymentData = await result.json();

            // ✅ Change 3: Add fallback toast
            if (result.ok) {
              setIsActive(paymentData?.data?.isActive ?? false);

              if (paymentData?.data?.isActive) {
                toast.success("Payment successful! Subscription activated.", {
                  duration: 5000,
                });
              } else {
                toast.success("Payment recorded successfully.", {
                  duration: 5000,
                });
              }
            }
          } catch (err) {
            console.error("Payment processing failed:", err);
            toast.error("Payment processing failed. Please try again later.", {
              duration: 5000,
            });
          }
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again later.", {
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Card className="relative bg-gray-100 w-[370px] h-[450px] shadow-lg shadow-black hover:shadow-2xl transition-shadow duration-300 ease-in-out">
        <CardHeader className="mb-6">
          <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r text-2xl font-bold from-pink-300 via-orange-300 to-yellow-300">
            {name}
          </CardTitle>
          <CardDescription className=" text-xl text-transparent font-bold bg-clip-text bg-gradient-to-r  from-pink-300 via-orange-300 to-yellow-300">
            ₹{price} / month
          </CardDescription>
        </CardHeader>

        <CardContent className="w-full flex flex-col items-center">
          <ul className="list-none text-md font-bold text-gray-700 flex flex-col items-start gap-4">
            {benefits?.map((benefit, index) => (
              <li
                key={index}
                className="mb-2 flex items-center justify-between gap-2 w-full"
              >
                {benefit}
                <IoMdCheckmarkCircleOutline className="text-green-500 text-xl font-bold" />
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="absolute flex justify-start items-center bottom-7 left-4 gap-5">
          <motion.button
            onClick={() => handlePayment()}
            disabled={isActive ? true : false}
            whileHover={{
              scale: isActive ? 1 : 1.1,
              backgroundColor: isActive ? "gray" : "purple",
              color: isActive ? "black" : "white",
            }}
            className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
          >
            {isActive ? "Current Plan" : "Subscribe"}
          </motion.button>

          {isActive && (
            <motion.button
              onClick={onRequestRevoke}
              whileHover={{
                scale: 1.1,
                backgroundColor: "purple",
                color: "white",
              }}
              className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
            >
              Revoke Plan
            </motion.button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default SubscriptionPlanCard;
