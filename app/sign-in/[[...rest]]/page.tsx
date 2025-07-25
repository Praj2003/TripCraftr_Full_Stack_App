"use client";
import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <SignIn
        path="/sign-in"
        routing="path"
        signInUrl="/sign-up"
      ></SignIn>
    </div>
  );
};

export default SignInPage;
