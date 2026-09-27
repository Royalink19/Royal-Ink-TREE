import PrintingLoader from '@/components/PrintingLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
      <PrintingLoader />
    </div>
  );
}
