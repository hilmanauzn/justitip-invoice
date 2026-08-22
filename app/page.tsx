import Header from "@/components/Header";
import MenuSection from "@/components/MenuSection";
import Cart from "@/components/Cart";
import CartDrawer from "@/components/CartDrawer";
import MobileCartBar from "@/components/MobileCartBar";
import CartSummarySheet from "@/components/CartSummarySheet";
import ReceiptModal from "@/components/ReceiptModal";
import CustomerModal from "@/components/CustomerModal";
import FloatingSearchButton from "@/components/FloatingSearchButton";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <MenuSection />
        </main>
        <aside className="hidden md:flex flex-col w-96 border-l border-gray-200">
          <Cart />
        </aside>
      </div>
      <MobileCartBar />
      <CartDrawer />
      <CartSummarySheet />
      <ReceiptModal />
      <CustomerModal />
      <FloatingSearchButton />
    </div>
  );
}
