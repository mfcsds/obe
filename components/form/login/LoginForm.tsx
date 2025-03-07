"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import ROUTES from "@/constant/routes";
// import { useRouter } from "next/navigation";

const LoginForm = () => {
  // const router = useRouter();

  const handleSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl: ROUTES.HOME, redirect: true });
    } catch (error) {
      console.error(error);
      toast("Error sign in with google");
    }
  };

  return (
    <div className="flex flex-col p-10">
      <Card className="bg-gray-50 shadow-2xl border border-gray-200 p-5 m-5">
        <CardHeader className="mt-10">
          <CardTitle>
            <p className="text-4xl font-extrabold text-amber-600 mb-5">
              Outcome Based Application
            </p>
          </CardTitle>
          <CardDescription>
            <p className="text-gray-500">
              This Application will help you to design sophisticated Outcome
              Based Education Curriculum for colloge
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 min-w-full">
            <div className="flex flex-col gap-1">
              <Label className="text-xl">Email</Label>
              <Input
                type="email"
                className="h-12 ring-0 border-1 border-gray-400 focus-visible:ring-0 "
                placeholder="youremail@company.com"
              ></Input>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xl text-gray-600">Password</Label>
              <Input
                type="password"
                className="h-12 ring-0 border-1 border-gray-400 focus-visible:ring-0"
              ></Input>
            </div>
            <div className="flex flex-row w-full items-end mt-10">
              <Button
                variant={"outline"}
                className="w-full bg-amber-900 border-0 shadow-sm rounded-2xl h-15"
              >
                <p className="text text-2xl font-bold text-white">Login</p>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-row-reverse w-full mb-10">
            <Button
              variant={"ghost"}
              className="w-full border border-gray-400 rounded-2xl h-15"
              onClick={() => handleSignIn("google")}
            >
              <FaGoogle className="w-5 h-5"></FaGoogle>
              Login with Google Account
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
export default LoginForm;
