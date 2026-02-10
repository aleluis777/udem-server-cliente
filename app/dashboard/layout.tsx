import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
