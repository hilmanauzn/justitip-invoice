"use client";
import { useCartStore } from "@/store/useCartStore";
import { useCartTotals } from "@/hooks/useCartTotals";
import { formatPrice } from "@/utils/format";
import { restaurantData } from "@/data";

export default function ReceiptContent() {
  const { items } = useCartStore();
  const totals = useCartTotals();

  const customerName = "Pelanggan";
  // eslint-disable-next-line react-hooks/purity
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
  const ongkir = 0;
  const alamatTujuan = "-";
  const paymentStatus = "Belum Dibayar";

  const bankAccounts = ["BCA - 5151120173"];

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      style={{
        width: "490px",
        backgroundColor: "#ffffff",
        padding: "30px 0px",
        fontFamily: "Helvetica, Arial, sans-serif",
        textAlign: "center",
        fontSize: "12px",
        color: "#000",
      }}
    >
      <style>{`
        .receipt-logo {
          width: 200px;
        }
        .receipt-header {
          width: 100%;
          margin: 20px 0px;
          margin-top: 10px;
          text-align: center;
          display: flex;
          justify-content: center;
        }
        .receipt-top-info {
          display: flex;
          justify-content: space-between;
        }
        .receipt-datetime {
          display: flex;
          font-size: 20px;
        }
        .receipt-datetime > div {
          margin-left: 20px;
        }
        .receipt-order-number {
          margin-right: 20px;
          font-size: 20px;
        }
        .receipt-customer-name {
          text-align: left;
          margin-top: 10px;
          margin-left: 20px;
          font-size: 26px;
        }
        .receipt-line {
          border-top: 2px dashed #036aa8;
          margin: 10px 20px;
        }
        .receipt-line-spaced {
          margin-top: 20px;
        }
        .receipt-restaurant-group {
          margin: 0 10px 15px;
          text-align: left;
          padding-bottom: 10px;
          border-bottom: 1px dashed #aaa;
        }
        .receipt-restaurant-group.last {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }
        .receipt-restaurant-header {
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #000000;
        margin-bottom: 8px;
        }
        .receipt-item {
          margin: 0 0 8px;
        }
        .receipt-item-name {
          font-size: 18px;
          font-weight: 500;
          margin-left: 10px;
        }
        .receipt-item-detail {
          font-size: 18px;
          display: flex;
          justify-content: space-between;
          margin-left: 30px;
          margin-right: 10px;
        }
        .receipt-subtotal-info {
          display: flex;
          justify-content: space-between;
          margin: 10px 20px;
          font-size: 20px;
          font-weight: bold;
        }
        .receipt-ongkir {
          display: flex;
          justify-content: space-between;
          margin: 10px 20px;
          font-size: 20px;
        }
        .receipt-alamat {
          margin: 0px 20px;
          text-align: left;
          font-size: 15px;
        }
        .receipt-total {
          display: flex;
          justify-content: space-between;
          margin: 10px 20px;
          font-size: 26px;
          font-weight: bold;
        }
        .receipt-secondary-text {
          color: #99a1af;
        }
        .receipt-payment-status {
          text-align: right;
          margin: -5px 20px;
        }
        .receipt-footer {
          margin: 20px;
          font-size: 20px;
        }
        .receipt-qris {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px auto 0;
        text-align: center;
        row-gap: 12px;
        }
        .receipt-qris img {
        width: 160px;
        height: auto;
        }
        .receipt-qris p {
        margin: 5px 0 0;
        font-size: 14px;
        color: #333;
        }
      `}</style>

      {/* Header dengan logo */}
      <div className="receipt-header">
        <img className="receipt-logo" src="/logo.jpg" alt="Logo" />
      </div>

      {/* Waktu & nomor urut */}
      <div className="receipt-top-info">
        <div className="receipt-datetime">
          <div>{dateStr}</div>
          <div>{timeStr}</div>
        </div>
        <div className="receipt-order-number">{orderNumber}</div>
      </div>

      {/* Nama customer */}
      <div className="receipt-customer-name">{customerName}</div>

      <div className="receipt-line"></div>

      {/* Daftar item dikelompokkan per restoran */}
      {totals.restaurants.map((r, idx) => {
        const restItems = items.filter(
          (item) => item.idRestaurant === r.restaurantId,
        );
        const restaurant = restaurantData.find(
          (res) => res.id === r.restaurantId,
        );

        // Hitung fee jastip umum (per batch)
        const normalIncludeItems = restItems.filter(
          (item) => item.includeJastip && !item.jastipFeeSpecial,
        );
        const qtyNormal = normalIncludeItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const multiple = restaurant?.multiple ?? 1;
        const batch = qtyNormal > 0 ? Math.ceil(qtyNormal / multiple) : 0;

        return (
          <div
            key={r.restaurantId}
            className={`receipt-restaurant-group ${
              idx === totals.restaurants.length - 1 ? "last" : ""
            }`}
          >
            <div className="receipt-restaurant-header">{r.restaurantName}</div>

            {/* Item order */}
            {restItems.map((item, i) => (
              <div key={item.cartItemId}>
                <div className="receipt-item">
                  <div className="flex justify-between items-baseline">
                    <div className="receipt-item-name">{item.name}</div>
                    {item.selectedAddon && (
                      <div className="text-sm receipt-secondary-text ml-10">
                        Addon: {item.selectedAddon}
                      </div>
                    )}
                  </div>

                  <div className="receipt-item-detail">
                    <div>
                      <span className="receipt-secondary-text">
                        {item.quantity}x
                      </span>{" "}
                      {formatPrice(item.price)}
                    </div>
                    <div>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>

                {/* Fee jastip khusus per item */}
                {item.jastipFeeSpecial && (
                  <div className="receipt-item">
                    <div className="receipt-item-name">Fee Jastip</div>
                    <div className="receipt-item-detail">
                      <div>
                        <span className="receipt-secondary-text">
                          {item.quantity}x
                        </span>{" "}
                        {formatPrice(item.jastipFeeSpecial)}
                      </div>
                      <div>
                        {formatPrice(item.quantity * item.jastipFeeSpecial)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Fee jastip umum untuk restoran ini */}
            {batch > 0 && restaurant && (
              <div className="receipt-item">
                <div className="receipt-item-name">Fee Jastip</div>
                <div className="receipt-item-detail">
                  <div>
                    <span className="receipt-secondary-text">{batch}x</span>{" "}
                    {formatPrice(restaurant.jastipFee)}
                  </div>
                  <div>{formatPrice(batch * restaurant.jastipFee)}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Garis pemisah terakhir dengan jarak ekstra */}
      <div className="receipt-line receipt-line-spaced"></div>

      {/* Subtotal item keseluruhan */}
      <div className="receipt-subtotal-info">
        <div>
          Total -{" "}
          {totals.restaurants.reduce((sum, r) => sum + r.totalQuantity, 0)} Item
        </div>
        <div>{formatPrice(totals.subtotalAll)}</div>
      </div>

      <div className="receipt-line"></div>

      {/* Ongkir */}
      <div className="receipt-ongkir">
        <div>Ongkir</div>
        <div>{formatPrice(ongkir)}</div>
      </div>

      {/* Alamat tujuan */}
      <div className="receipt-alamat">
        <strong>Alamat Tujuan :</strong> {alamatTujuan}
      </div>

      <div className="receipt-line"></div>

      {/* Total keseluruhan */}
      <div className="receipt-total">
        <div>
          Total -{" "}
          {totals.restaurants.reduce((sum, r) => sum + r.totalQuantity, 0)} Item
        </div>
        <div>{formatPrice(totals.totalAll)}</div>
      </div>

      {/* Status pembayaran */}
      <div className="receipt-payment-status">{paymentStatus}</div>

      {/* QRIS */}
      <div className="receipt-qris">
        <p>Scan QRIS untuk pembayaran</p>
        <img src="/qris.jpeg" alt="QRIS" />
      </div>
      {/* Footer bank */}
      <div className="receipt-footer">
        {bankAccounts.map((acc, idx) => (
          <div key={idx} className="nophonenumber">
            {acc}
          </div>
        ))}
        <div>
          <span>
            A.N. <strong>Maria Ulpa</strong>
          </span>
        </div>
        <br />
        <div>Terima Kasih</div>
      </div>
    </div>
  );
}
