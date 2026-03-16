import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#0a0a0a]">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
