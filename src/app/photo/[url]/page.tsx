export default function PhotoPage({
  params: { url },
}: {
  params: { url: string };
}) {
  return <img src={decodeURIComponent(url)} />;
}
