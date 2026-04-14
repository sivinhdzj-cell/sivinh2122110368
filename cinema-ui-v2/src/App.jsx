import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import SearchBar from "./components/SearchBar";
import MovieSection from "./components/MovieSection";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import "./styles/global.css";

export default function App() {
    const [bookingMovie, setBookingMovie] = useState(null);
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5269/api/Movie');
                const data = await response.json();

                // ✅ LỌC SIÊU CẤP: Chỉ lấy phim có ảnh Unsplash và xóa trùng lặp
                const cleanData = data.filter((movie, index, self) =>
                    movie.posterUrl &&
                    movie.posterUrl.includes("unsplash.com") && // Chỉ lấy ảnh xịn
                    movie.title &&
                    !movie.title.includes("Phim Sắp") &&
                    index === self.findIndex((m) => m.title === movie.title)
                );

                // ✅ CHIA ĐỐI XỨNG: 12 phim mỗi mục (6 cột x 2 hàng)
                setNowShowing(cleanData.slice(0, 12));
                setComingSoon(cleanData.slice(12, 24));

            } catch (error) {
                console.error("Lỗi API:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="app-root" style={{ backgroundColor: '#0f0f0f', color: '#fff', minHeight: '100vh' }}>
            <Navbar />

            {/* Chỉ hiện Slider khi đã có dữ liệu */}
            {!isLoading && nowShowing.length > 0 && (
                <HeroSlider movies={nowShowing.slice(0, 3)} />
            )}

            <div className="main-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
                <SearchBar />

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
                        <p>Đang tải danh sách phim...</p>
                    </div>
                ) : (
                    <>
                        {/* 🎬 PHIM ĐANG CHIẾU */}
                        {nowShowing.length > 0 && (
                            <section className="movie-folder" style={{ marginBottom: '60px' }}>
                                <MovieSection
                                    title="🎬 PHIM ĐANG CHIẾU"
                                    movies={nowShowing}
                                    onBook={setBookingMovie}
                                />
                            </section>
                        )}

                        {/* 📅 PHIM SẮP RA MẮT */}
                        {comingSoon.length > 0 && (
                            <section className="movie-folder">
                                <MovieSection
                                    title="📅 PHIM SẮP RA MẮT"
                                    movies={comingSoon}
                                    upcoming={true}
                                />
                            </section>
                        )}
                    </>
                )}
            </div>

            <Footer />

            {bookingMovie && (
                <BookingModal movie={bookingMovie} onClose={() => setBookingMovie(null)} />
            )}
        </div>
    );
}