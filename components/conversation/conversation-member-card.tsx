"use client";
import { Profile } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { UserAvatar } from "../user-avatar";

const tailwindColors = ["red-500", "blue-500", "emerald-500", "yellow-500", "indigo-500"];

const formatDate = (inputDate: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return inputDate.toLocaleDateString("en-US", options);
};

const getRandomTailwindColor = () => {
  const randomIndex = Math.floor(Math.random() * tailwindColors.length);
  return `bg-${tailwindColors[randomIndex]}`;
};

const ProfileCard = ({ memberTwo }: { memberTwo: Profile }) => {
  const [color, setColor] = useState("bg-blue-500");
  const [createdDate, setCreatedDate] = useState("");

  useEffect(() => {
    setColor(getRandomTailwindColor());

    setCreatedDate(formatDate(memberTwo.createdAt));
  }, [memberTwo]);

  return (
    <div className="w-full h-full  rounded-lg text-white ">
      <div className={`h-36 w-full ${color} relative mb-10`}>
        <UserAvatar src={memberTwo.imageUrl} className="abolute left-6 top-[100%] translate-y-[-50%]  md:h-16 md:w-16 ring-[6px] ring-[#1c1c1c]" />
      </div>

      <div className="flex flex-col  items-start px-3 text-neutral-300">
        <h1 className="text-xl font-semibold leading-6 mb-1">{memberTwo.name}</h1>
        <p className="text-sm mb-5">{memberTwo.email}</p>
        <div className="bg-neutral-700 h-20 w-full rounded-xl p-3">
          <p className="text-sm font-medium leading-6 mb-1">Member Since</p>
          <p className="text-base">{createdDate}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
