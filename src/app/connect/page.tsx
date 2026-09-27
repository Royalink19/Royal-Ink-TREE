import ConnectHub from '@/components/ConnectHub';

/**
 * /connect route — the canonical URL for QR codes and NFC tags.
 *
 * URLs such as:
 *   /connect?source=stand_qr
 *   /connect?source=stand_nfc
 *   /connect?source=instagram
 *   /connect?source=business_card
 *
 * All serve the same Connect Hub page.
 */
export default function ConnectPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  return <ConnectHub searchParams={searchParams} />;
}
