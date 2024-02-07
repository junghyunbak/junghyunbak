interface HitsProps {
  path: string;
  title?: string;
  countBgColor?: string;
  titleBgColor?: string;
  edgeFlat?: boolean;
}

export function Hits({
  path,
  title = "조회수",
  countBgColor = "#5A22E0",
  titleBgColor = "#555555",
  edgeFlat = true,
}: HitsProps) {
  const queryString = new URLSearchParams([
    ["url", `https://lightpavilion.site${path}`],
    ["count_bg", countBgColor],
    ["title_bg", titleBgColor],
    ["title", title],
    ["edge_flat", edgeFlat.toString()],
  ]);

  return (
    <div className={"flex justify-end min-h-[20px] w-full mb-3.5"}>
      <img
        src={`https://hits.seeyoufarm.com/api/count/incr/badge.svg?${queryString}`}
        alt="Hits"
      />
    </div>
  );
}
