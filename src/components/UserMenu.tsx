"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { User } from "lucide-react";
import Link from "next/link";

const UserMenu = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center space-x-4">
          <User className="w-6 h-6 hover:cursor-pointer" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="min-w-40">
        <Link
          href="/api/auth/signout"
          className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:cursor-pointer hover:text-white"
        >
          Logout
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
