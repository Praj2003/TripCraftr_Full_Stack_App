"use client";
import React from "react";
import SubscriptionPlanCard from "@/components/SubscriptionPlanCard";
import Plans from "@/subscriptionPlans";
import { toast } from "sonner";

import { motion } from "motion/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useState } from "react";

import { useUser } from "@clerk/nextjs";

const SubscriptionPage = () => {
  const { user } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [planName, setPlanName] = useState<string | undefined>("");

  const handleRevokePlan = async () => {
    if (!planName) return;

    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        toast.error("User email not found, Please log in", {
          duration: 5000,
        });
        return;
      }

      const response = await fetch("/api/createPayment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, plan: planName }),
      });

      if (response.ok) {
        toast.success("Plan revoked successfully!", {
          duration: 5000,
        });
      }

      window.location.reload();
    } catch (error) {
      toast.error("Failed to revoke plan. Please try again later.", {
        duration: 5000,
      });
      console.error("Error revoking plan:", error);
    }
  };

  return (
    <div className="min-w-full min-h-screen">
      <div className="min-w-full pt-36 pb-12">
        <p className="text-4xl font-bold  bg-clip-text text-transparent  bg-gradient-to-r from-pink-200 via-rose-300 to-orange-200 text-center mb-11">
          Unlock Your Perfect Plan
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 place-items-center">
          {Plans.map((plan) => {
            return (
              <SubscriptionPlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                benefits={plan.benefits}
                onRequestRevoke={() => {
                  setPlanName(plan.name);
                  setOpenDialog(true);
                }}
              />
            );
          })}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke the <strong>{planName}</strong>{" "}
              plan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <motion.button
              onClick={() => {
                handleRevokePlan();
                setOpenDialog(false);
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "purple",
                color: "white",
              }}
              className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
            >
              Confirm
            </motion.button>
            <motion.button
              onClick={() => setOpenDialog(false)}
              whileHover={{
                scale: 1.1,
                backgroundColor: "purple",
                color: "white",
              }}
              className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
            >
              cancel
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
