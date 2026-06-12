export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function getStockStatus(stock) {
  const numericStock = Number(stock);
  if (numericStock === 0) {
    return { label: "Habis", className: "danger" };
  }
  if (numericStock <= 5) {
    return { label: "Stok Menipis", className: "warning" };
  }
  return { label: "Aman", className: "success" };
}

export function generateTransactionNumber(totalTransactions) {
  return `TRX${String(totalTransactions + 1).padStart(3, "0")}`;
}

export function calculateSoldProducts(transactions) {
  const result = {};

  transactions.forEach((transaction) => {
    transaction.items.forEach((item) => {
      if (!result[item.productId]) {
        result[item.productId] = {
          productId: item.productId,
          name: item.name,
          quantity: 0,
          total: 0,
        };
      }
      result[item.productId].quantity += Number(item.quantity);
      result[item.productId].total += Number(item.subtotal);
    });
  });

  return Object.values(result).sort((a, b) => b.quantity - a.quantity);
}
