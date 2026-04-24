import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Customer/Home";
import MovieList from "./pages/Customer/MovieList";
import MovieDetail from "./pages/Customer/MovieDetail";
import SeatSelection from "./pages/Customer/SeatSelection";
import MyBookings from "./pages/Customer/MyBookings";
import MomoMock from "./pages/Customer/MomoMock";
import VnpayMock from "./pages/Customer/VnpayMock";
import CustomerLayout from "./layouts/CustomerLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ComboSelection from "./pages/Customer/ComboSelection";
import Payment from "./pages/Customer/Payment";
import PaymentResult from "./pages/Customer/PaymentResult";
import Dashboard from "./pages/Admin/Dashboard";
import MoviesManagement from "./pages/Admin/MoviesManagement";
import ShowtimesManagement from "./pages/Admin/ShowtimesManagement";
import UsersManagement from "./pages/Admin/UsersManagement";
import CouponsManagement from "./pages/Admin/CouponsManagement";
import Reports from "./pages/Admin/Reports";
import AdminLogin from "./pages/Admin/AdminLogin";
import CinemasManagement from "./pages/Admin/CinemasManagement";
import RoomsManagement from "./pages/Admin/RoomsManagement";
import BookingsManagement from "./pages/Admin/BookingsManagement";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/seat-selection/:showtimeId" element={<SeatSelection />} />
        <Route path="/combo" element={<ComboSelection />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/momo" element={<MomoMock />} />
        <Route path="/payment/vnpay" element={<VnpayMock />} />
        <Route path="/payment/result" element={<PaymentResult />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["Admin", "Manager"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="movies" element={<MoviesManagement />} />
        <Route path="showtimes" element={<ShowtimesManagement />} />
        <Route path="cinemas"      element={<CinemasManagement />} />
        <Route path="rooms"        element={<RoomsManagement />} />
        <Route path="users"        element={<UsersManagement />} />
        <Route path="bookings"     element={<BookingsManagement />} />
        <Route path="coupons"      element={<CouponsManagement />} />
        <Route
          path="reports"
          element={
            <Reports />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
