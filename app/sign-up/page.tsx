"use client";
import React from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <div className="mt-38 mb-11">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          forceRedirectUrl="/"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
