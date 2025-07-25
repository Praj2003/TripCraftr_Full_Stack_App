"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { motion } from "motion/react";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";

import { Button } from "@/components/ui/button";

import ReactMarkdown from "react-markdown";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FaChevronDown } from "react-icons/fa";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AIPage = () => {
  const { user } = useUser();
  const [destination, setDestination] = useState<string | undefined>("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [tripType, setTripType] = useState<string | undefined>("");
  const [budgetLevel, setBudgetLevel] = useState<string | undefined>("");
  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(1);
  const [response, setResponse] = useState<string | undefined>("");
  const [trials, setTrials] = useState<number | undefined>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);

  async function handleSubmit() {
    try {
      if (
        !destination ||
        !tripType ||
        !budgetLevel ||
        !startDate ||
        !endDate ||
        numberOfTravelers <= 0
      ) {
        console.error("Please fill in all required fields.");
        return;
      }

      if (!user) {
        console.log("No user has signed in!");
      }

      const email = user?.primaryEmailAddress?.emailAddress;

      const tripData = {
        destination,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        tripType,
        budgetLevel,
        numberOfTravelers,
        email,
      };

      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (response.status == 402) {
        setDialogOpen(true);
      }

      if (!response.ok) {
        throw new Error("Failed to generate trip");
      }

      const result = await response.json();

      if (result?.data) {
        setResponse(result.data);
      }

      if (result?.trials) {
        setTrials(result?.trials);
      }

      console.log("Trip generated successfully:", result);
    } catch (err) {
      console.error("Error generating trip:", err);
    }
  }
  function handleClear() {
    setDestination("");
    setStartDate(new Date());
    setEndDate(new Date());
    setTripType("");
    setBudgetLevel("");
    setNumberOfTravelers(1);
    setResponse("");
  }

  return (
    <div className="flex flex-col min-w-full min-h-screen">
      <div className="min-w-full grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1">
        <div className=" hidden order-2 lg:order-1 md:order-1 w-full h-full lg:flex md:flex items-center justify-center">
          <Card className="bg-white shadow-lg rounded-lg p-6 w-96 mt-9 lg:mt-28 mb-9">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-pink-800">
                TripCraftr AI
              </CardTitle>
              <CardDescription className="text-sm text-black font-semibold">
                Let AI craft your perfect travel plan—just tell us where and
                when!
              </CardDescription>
            </CardHeader>

            <CardContent className="w-full flex flex-col  gap-5">
              <div className="flex flex-col gap-3">
                <Label htmlFor="destination" className="text-sm font-semibold">
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="Enter your destination"
                  className="w-full"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="w-full flex flex-col gap-5">
                <Label className="text-sm font-semibold">
                  When are you planning to travel?
                </Label>

                <div className="flex items-center justify-between">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-1/2">
                        {startDate
                          ? startDate.toLocaleDateString()
                          : "Start Date"}
                        <FaChevronDown className="ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>

                  <span className="mx-2">to</span>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-1/2">
                        {endDate ? endDate.toLocaleDateString() : "End Date"}
                        <FaChevronDown className="ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <Label>How many people are traveling?</Label>
                <Input
                  type="number"
                  placeholder="Number of travelers"
                  className="w-full mt-2"
                  min={1}
                  defaultValue={1}
                  value={numberOfTravelers}
                  onChange={(e) => setNumberOfTravelers(Number(e.target.value))}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="tripType" className="text-sm font-semibold">
                  Trip Type
                </Label>
                <Input
                  id="tripType"
                  placeholder="Enter your trip type (e.g., business, leisure)"
                  className="w-full"
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="bugetLevel" className="text-sm font-semibold">
                  Budget Level
                </Label>
                <Select value={budgetLevel} onValueChange={setBudgetLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select budget level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex w-full items-center justify-center gap-8">
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "purple",
                    color: "white",
                  }}
                  className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
                >
                  Submit
                </motion.button>

                <motion.button
                  onClick={handleClear}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "purple",
                    color: "white",
                  }}
                  className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
                >
                  Clear
                </motion.button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="order-1 lg:order-2 md:order-2 w-full h-full flex items-center justify-center mb-9 mt-16 lg:mt-0">
          <div className="w-[400px] h-[450px]  overflow-auto border border-black relative p-5 rounded-lg bg-gray-800 shadow-lg shadow-gray-600">
            {response ? (
              <>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-orange-200 text-xl font-semibold mb-4 text-center">
                  Your Personalized Travel Itinerary
                </h2>
                <div className="text-white font-bold text-md space-y-4">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white font-bold text-xl">
                Your custom trip plan will appear here.
              </div>
            )}
          </div>
        </div>

        {dialogOpen && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Note</DialogTitle>
                <DialogDescription className="text-md font-bold text-red-700">
                   You&apos;ve  used all your free trials. Subscribe now to continue
                  generating personalized travel plans.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex items-center justify-start">
                <motion.button
                  onClick={() => setDialogOpen(false)}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "purple",
                    color: "white",
                  }}
                  className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
                >
                  Close
                </motion.button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {formDialogOpen && (
        <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
          <DialogContent>
            <Card className="bg-white shadow-lg rounded-lg p-6 w-96 mt-9 lg:mt-28 mb-9 max-h-[550px]">
              <CardContent className="w-full flex flex-col  gap-5">
                <div className="flex flex-col gap-3">
                  <Label
                    htmlFor="destination"
                    className="text-sm font-semibold"
                  >
                    Destination
                  </Label>
                  <Input
                    id="destination"
                    placeholder="Enter your destination"
                    className="w-full"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div className="w-full flex flex-col gap-5">
                  <Label className="text-sm font-semibold">
                    When are you planning to travel?
                  </Label>

                  <div className="flex items-center justify-between">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-1/2">
                          {startDate
                            ? startDate.toLocaleDateString()
                            : "Start Date"}
                          <FaChevronDown className="ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                        />
                      </PopoverContent>
                    </Popover>

                    <span className="mx-2">to</span>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-1/2">
                          {endDate ? endDate.toLocaleDateString() : "End Date"}
                          <FaChevronDown className="ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-3">
                  <Label>How many people are traveling?</Label>
                  <Input
                    type="number"
                    placeholder="Number of travelers"
                    className="w-full mt-2"
                    min={1}
                    defaultValue={1}
                    value={numberOfTravelers}
                    onChange={(e) =>
                      setNumberOfTravelers(Number(e.target.value))
                    }
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="tripType" className="text-sm font-semibold">
                    Trip Type
                  </Label>
                  <Input
                    id="tripType"
                    placeholder="Enter your trip type (e.g., business, leisure)"
                    className="w-full"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="bugetLevel" className="text-sm font-semibold">
                    Budget Level
                  </Label>
                  <Select value={budgetLevel} onValueChange={setBudgetLevel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select budget level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>

              <CardFooter>
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "purple",
                    color: "white",
                  }}
                  className="px-3 py-2 bg-black text-white font-bold rounded-lg cursor-pointer"
                >
                  Submit
                </motion.button>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      )}

      <div className="fixed flex items-center justify-center flex-col gap-4 bottom-10 right-6">
        <button
          onClick={() => setFormDialogOpen(true)}
          className="w-[80px] h-[80px] rounded-full lg:hidden md:hidden  bg-white font-bold text-md text-purple-700 shadow-2xl cursor-pointer"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default AIPage;
