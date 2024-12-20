"use client";
import { cn } from "@/lib/utils";
import { Profile } from "@prisma/client";
import { useEffect, useState } from "react";
import { UserAvatar } from "../user-avatar";

const formatDate = (inputDate: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return inputDate.toLocaleDateString("en-US", options);
};

const ProfileCard = ({ memberTwo }: { memberTwo: Profile }) => {
  const [createdDate, setCreatedDate] = useState("");

  useEffect(() => {
    setCreatedDate(formatDate(memberTwo.createdAt));
  }, [memberTwo]);

  return (
    <div className="w-full h-full  rounded-lg text-white ">
      <div className={cn(`h-36 w-full  relative mb-10`, memberTwo && memberTwo.wallpaper)}>
        <UserAvatar src={memberTwo.imageUrl} className="abolute left-6 top-[100%] translate-y-[-50%]  md:h-16 md:w-16 ring-[6px] ring-[#1c1c1c]" />
      </div>

      <div className="flex flex-col  items-start px-3 text-neutral-300">
        <h1 className="text-xl font-semibold leading-6 mb-1">{memberTwo.name}</h1>
        <p className="text-sm mb-5">{memberTwo.email}</p>
        <div className="bg-neutral-700 h-16 w-full rounded-xl p-2">
          <p className="text-sm font-medium leading-6 mb-1">Member Since</p>
          <p className="text-base">{createdDate}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
