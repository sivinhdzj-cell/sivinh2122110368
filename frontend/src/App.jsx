import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Customer/Home";
import MovieList from "./pages/Customer/MovieList";
import MovieDetail from "./pages/Customer/MovieDetail";
import SeatSelection from "./pages/Customer/SeatSelection";
import MyBookings from "./pages/Customer/MyBookings";
import CustomerLayout from "./layouts/CustomerLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import MoviesManagement from "./pages/Admin/MoviesManagement";
import ShowtimesManagement from "./pages/Admin/ShowtimesManagement";
import Reports from "./pages/Admin/Reports";

export default function App() {
  return (
    <Routes>
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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="movies" element={<MoviesManagement />} />
        <Route path="showtimes" element={<ShowtimesManagement />} />
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
