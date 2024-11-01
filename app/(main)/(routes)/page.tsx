import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="text-3xl text-indigo-500 font-bold ">
      <UserButton />
    </div>
  );
}
