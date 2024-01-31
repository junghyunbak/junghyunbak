import HalfPavilion from "@/assets/svgs/half-pavilion.svg";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex w-full bg-primary">
      <HalfPavilion className="h-full [&_path]:fill-secondaryA" />

      <div className="flex items-center justify-between w-full p-2.5 text-white">
        <p>개발자 박정현</p>

        <div className="flex gap-2.5 items-center">
          <Link href={"/"}>소개</Link>
          <div className="h-4 border-l border-white" />
          <Link href={"/blog"}>블로그</Link>
          <div className="h-4 border-l border-white" />
          <Link href={"/portfolio"}>포트폴리오</Link>
        </div>
      </div>
    </header>
  );
}
