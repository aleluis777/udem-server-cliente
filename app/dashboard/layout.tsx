import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
