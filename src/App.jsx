import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Sales from "./pages/Sales";
import Transactions from "./pages/Transactions";
import StockIn from "./pages/StockIn";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="barang" element={<Products />} />
        <Route path="barang/tambah" element={<ProductForm mode="add" />} />
        <Route path="barang/edit/:id" element={<ProductForm mode="edit" />} />
        <Route path="transaksi" element={<Sales />} />
        <Route path="riwayat" element={<Transactions />} />
        <Route path="stok-masuk" element={<StockIn />} />
        <Route path="laporan" element={<Reports />} />
        <Route path="profil" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
