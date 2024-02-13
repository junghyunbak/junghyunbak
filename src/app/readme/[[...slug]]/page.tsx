export default function ReadmePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return <div>{slug}</div>;
}
