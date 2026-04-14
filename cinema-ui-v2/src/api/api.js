import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5269/api",
});

// Interceptor này sẽ lấy token MỚI NHẤT từ localStorage mỗi khi bạn nhấn nút
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const showtimeService = {
    getShowtimes: () => api.get("/Showtime"),
};

export const bookingService = {
    // Lưu ý: Kiểm tra Swagger xem là "/Booking" hay "/Bookings"
    createBooking: (data) => api.post("/Booking", data),
};

export default api; 