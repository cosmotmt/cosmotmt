export const runtime = "edge";

export default function AdminPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
