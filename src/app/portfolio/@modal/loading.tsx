import pulseGif from "@/assets/gifs/Pulse.gif";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <Image src={pulseGif} width={50} height={50} alt="pulse gif" />
    </div>
  );
}
