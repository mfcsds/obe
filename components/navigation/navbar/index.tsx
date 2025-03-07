import React from "react";
import { RxAvatar } from "react-icons/rx";

const NavBar = () => {
  return (
    <nav>
      <div className="flex flex-row-reverse w-full py-1 gap-2 items-center px-5 ">
        <div className="flex flex-col ">
          <p className="text-balance font-extrabold text-lg">
            Muhamad Fathurahman
          </p>
          <p className="text-sm font-light text-gray-700">Sekretaris Prodi</p>
        </div>
        <RxAvatar className="w-10 h-10 text-gray-400"></RxAvatar>
      </div>
    </nav>
  );
};

export default NavBar;
