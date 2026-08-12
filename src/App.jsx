import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import OrdersPage from "@/pages/OrdersPage";
import RidersPage from "@/pages/RidersPage";
import RestaurantsPage from "@/pages/RestaurantsPage";
import HomeChefsPage from "@/pages/HomeChefsPage";
import ProductsPage from "@/pages/ProductsPage";
import CustomersPage from "@/pages/CustomersPage";
import ChatPage from "@/pages/ChatPage";
import SettingsPage from "@/pages/SettingsPage";
import FinancePage from "./pages/FinancePage";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import PromotionsPage from "./pages/PromotionsPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import CategoryPage from "./pages/CategoryPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/riders" element={<RidersPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/home-chefs" element={<HomeChefsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/live-tracking" element={<LiveTrackingPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}