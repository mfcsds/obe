"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { MdFiberSmartRecord } from "react-icons/md";

const RegistrationForm = () => {
  return (
    <div className="flex flex-col p-10">
      <Card className="bg-gray-50 shadow-2xl border border-gray-200 p-5 m-5">
        <CardHeader className="mt-10">
          <div className="flex flex-row justify-between items-center gap-5">
            <div>
              <CardTitle>
                <p className="text-4xl font-extrabold text-amber-600 mb-5">
                  Create Your Account
                </p>
              </CardTitle>
              <CardDescription>
                <p className="text-gray-500">
                  This Application will help you to design sophisticated Outcome
                  Based Education Curriculum for colloge
                </p>
              </CardDescription>
            </div>
            <MdFiberSmartRecord className="w-[120px] h-[120px] text-gray-200" />
          </div>
          <div></div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 min-w-full mb-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xl font-extrabold text-gray-600">
                  Email
                </Label>
                <Input
                  type="email"
                  className="h-12 ring-0 border-1 text-lg border-gray-400 focus-visible:ring-0 focus-visible:shadow-lg "
                  placeholder="youremail@company.com"
                ></Input>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xl font-extrabold text-gray-600">
                  Password
                </Label>
                <Input
                  type="password"
                  className="h-12 ring-0 border-1 border-gray-400 focus-visible:ring-0 focus-visible:shadow-lg"
                ></Input>
              </div>
            </div>

            <div className="flex flex-row w-full items-end mt-10">
              <Button
                variant={"outline"}
                className="w-full bg-amber-50 border-2 border-amber-600 shadow-lg rounded-xl h-15"
              >
                <p className="text text-2xl font-bold text-amber-700">
                  Register
                </p>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default RegistrationForm;
