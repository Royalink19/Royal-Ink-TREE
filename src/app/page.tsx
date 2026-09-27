import ConnectHub from '@/components/ConnectHub';

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  return <ConnectHub searchParams={searchParams} />;
}
