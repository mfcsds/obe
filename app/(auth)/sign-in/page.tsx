import LoginForm from "@/components/form/login/LoginForm";
import React from "react";
import { MdFiberSmartRecord } from "react-icons/md";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-lvh md:flex-row ">
      <div className="flex flex-col w-full md:w-8/12 items-center p-4 justify-center md:p-0 h-screen">
        <MdFiberSmartRecord className="w-[200px] h-[200px] text-amber-500" />
        <p className="text-gray-400 ">AI Based Curriculum Design</p>
      </div>
      <div className="flex flex-col w-full bg-white p-4 md:bg-gray-100 md:p-0 md:w-4/12 items-center h-full justify-center">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default SignInPage;
