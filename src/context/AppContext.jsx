import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialProducts } from "../data/initialProducts";
import { generateTransactionNumber } from "../utils/helpers";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  auth: "sembako_auth",
  products: "sembako_products",
  transactions: "sembako_transactions",
  stockIns: "sembako_stock_ins",
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Gagal membaca ${key} dari LocalStorage`, error);
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeProduct(product) {
  return {
    ...product,
    code: String(product.code).trim().toUpperCase(),
    name: String(product.name).trim(),
    category: String(product.category).trim(),
    purchasePrice: Number(product.purchasePrice),
    sellingPrice: Number(product.sellingPrice),
    stock: Number(product.stock),
    unit: String(product.unit).trim(),
    supplier: String(product.supplier).trim(),
  };
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    loadFromStorage(STORAGE_KEYS.auth, false)
  );
  const [products, setProducts] = useState(() =>
    loadFromStorage(STORAGE_KEYS.products, initialProducts)
  );
  const [transactions, setTransactions] = useState(() =>
    loadFromStorage(STORAGE_KEYS.transactions, [])
  );
  const [stockIns, setStockIns] = useState(() =>
    loadFromStorage(STORAGE_KEYS.stockIns, [])
  );

  useEffect(() => saveToStorage(STORAGE_KEYS.auth, isAuthenticated), [isAuthenticated]);
  useEffect(() => saveToStorage(STORAGE_KEYS.products, products), [products]);
  useEffect(() => saveToStorage(STORAGE_KEYS.transactions, transactions), [transactions]);
  useEffect(() => saveToStorage(STORAGE_KEYS.stockIns, stockIns), [stockIns]);

  function login(username, password) {
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: "Username atau password salah." };
  }

  function logout() {
    setIsAuthenticated(false);
  }

  function addProduct(product) {
    const normalized = normalizeProduct(product);
    const isDuplicate = products.some(
      (item) => item.code.toLowerCase() === normalized.code.toLowerCase()
    );

    if (isDuplicate) {
      return { success: false, message: "Kode barang sudah digunakan." };
    }

    const newProduct = {
      ...normalized,
      id: normalized.code,
      inputDate: new Date().toISOString().slice(0, 10),
    };
    setProducts((prev) => [...prev, newProduct]);
    return { success: true, message: "Barang berhasil ditambahkan." };
  }

  function updateProduct(id, updatedProduct) {
    const normalized = normalizeProduct(updatedProduct);
    const isDuplicate = products.some(
      (item) => item.id !== id && item.code.toLowerCase() === normalized.code.toLowerCase()
    );

    if (isDuplicate) {
      return { success: false, message: "Kode barang sudah digunakan oleh barang lain." };
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...normalized,
              id: normalized.code,
            }
          : item
      )
    );

    return { success: true, message: "Data barang berhasil diperbarui." };
  }

  function deleteProduct(id) {
    const isUsedInTransaction = transactions.some((transaction) =>
      transaction.items.some((item) => item.productId === id)
    );

    if (isUsedInTransaction) {
      return {
        success: false,
        message: "Barang tidak dapat dihapus karena sudah digunakan dalam transaksi.",
      };
    }

    setProducts((prev) => prev.filter((item) => item.id !== id));
    return { success: true, message: "Barang berhasil dihapus." };
  }

  function addTransaction(cartItems, paymentMethod) {
    if (!cartItems.length) {
      return { success: false, message: "Keranjang transaksi masih kosong." };
    }

    if (!paymentMethod) {
      return { success: false, message: "Metode pembayaran wajib dipilih." };
    }

    const transactionItems = [];

    for (const cartItem of cartItems) {
      const product = products.find((item) => item.id === cartItem.productId);
      const quantity = Number(cartItem.quantity);

      if (!product) {
        return { success: false, message: "Barang tidak ditemukan." };
      }

      if (product.stock === 0) {
        return { success: false, message: `${product.name} sedang habis.` };
      }

      if (quantity <= 0) {
        return { success: false, message: "Jumlah barang harus lebih dari 0." };
      }

      if (quantity > product.stock) {
        return {
          success: false,
          message: `Stok ${product.name} tidak cukup. Stok tersedia: ${product.stock}.`,
        };
      }

      transactionItems.push({
        productId: product.id,
        code: product.code,
        name: product.name,
        quantity,
        unit: product.unit,
        price: Number(product.sellingPrice),
        subtotal: quantity * Number(product.sellingPrice),
      });
    }

    const totalPayment = transactionItems.reduce((sum, item) => sum + item.subtotal, 0);
    const transaction = {
      id: generateTransactionNumber(transactions.length),
      number: generateTransactionNumber(transactions.length),
      date: new Date().toISOString(),
      items: transactionItems,
      totalPayment,
      paymentMethod,
    };

    setProducts((prev) =>
      prev.map((product) => {
        const soldItem = transactionItems.find((item) => item.productId === product.id);
        return soldItem
          ? { ...product, stock: Number(product.stock) - Number(soldItem.quantity) }
          : product;
      })
    );

    setTransactions((prev) => [...prev, transaction]);
    return { success: true, message: "Transaksi berhasil disimpan." };
  }

  function addStockIn(stockInData) {
    const product = products.find((item) => item.id === stockInData.productId);
    const quantity = Number(stockInData.quantity);

    if (!product) {
      return { success: false, message: "Barang tidak ditemukan." };
    }

    if (quantity <= 0) {
      return { success: false, message: "Jumlah stok masuk harus lebih dari 0." };
    }

    const newStockIn = {
      id: `SM${Date.now()}`,
      date: new Date().toISOString(),
      productId: product.id,
      productName: product.name,
      quantity,
      supplier: stockInData.supplier.trim(),
      note: stockInData.note.trim(),
    };

    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, stock: Number(item.stock) + quantity } : item
      )
    );
    setStockIns((prev) => [newStockIn, ...prev]);
    return { success: true, message: "Stok masuk berhasil disimpan." };
  }

  function resetApplicationData() {
    setProducts(initialProducts);
    setTransactions([]);
    setStockIns([]);
  }

  const value = useMemo(
    () => ({
      isAuthenticated,
      products,
      transactions,
      stockIns,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      addTransaction,
      addStockIn,
      resetApplicationData,
    }),
    [isAuthenticated, products, transactions, stockIns]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp harus digunakan di dalam AppProvider");
  }
  return context;
}
