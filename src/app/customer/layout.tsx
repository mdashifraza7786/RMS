import BottomNav from "@/components/customer/BottomNav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-16 bg-white">
      {children}
      <BottomNav />
    </div>
  );
}


