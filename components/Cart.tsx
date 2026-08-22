import CartContent from "./CartContent";
import OrderSummary from "./OrderSummary";

export default function Cart() {
  return (
    <div className="flex-1 flex flex-col bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          🛒 Pesanan Saat Ini
        </h2>
      </div>
      <CartContent />
      <OrderSummary />
    </div>
  );
}
