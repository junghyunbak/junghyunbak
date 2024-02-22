import pulseGif from "@/assets/gifs/Pulse.gif";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      <Image src={pulseGif} width={50} height={50} alt="pulse gif" />
    </div>
  );
}
