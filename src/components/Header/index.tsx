import HalfPavilion from "@/assets/svgs/half-pavilion.svg";
import Link from "next/link";

type Page = "소개" | "블로그" | "포트폴리오";
type PageHref = "/" | "/blog" | "/portfolio";

interface HeaderProps {
  currentPage: Page;
}

export function Header({ currentPage }: HeaderProps) {
  const pages: Page[] = ["소개", "블로그", "포트폴리오"];
  const pageHrefs: PageHref[] = ["/", "/blog", "/portfolio"];

  return (
    <header className="flex w-full h-11 bg-primary">
      <HalfPavilion className="h-full [&_path]:fill-secondaryA" />

      <div className="flex items-center justify-between w-full pl-2.5 pr-2.5 text-white">
        <Link href={"/"}>개발자 박정현</Link>

        <ul className="flex gap-2.5 items-center">
          {pages.map((page, i) => {
            return (
              <>
                {i !== 0 && <div className="h-4 border-l border-white" />}

                <Link
                  href={pageHrefs[i]}
                  key={i}
                  className={
                    page === currentPage ? "text-secondaryB" : "text-white"
                  }
                >
                  {page}
                </Link>
              </>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
