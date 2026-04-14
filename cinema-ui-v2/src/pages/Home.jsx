import { useEffect, useState } from "react";
// Sửa lại đường dẫn: lùi 1 cấp ra khỏi pages, vào thư mục api
import { movieService } from "../api/api";

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        movieService.getAllMovies()
            .then(res => {
                setMovies(res.data);
            })
            .catch(err => console.error("Lỗi tải phim:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-[#0f111a]">
            {movies.map((m) => (
                <div key={m.movieId}>
                    {/* Render Movie Card của bạn ở đây */}
                    <img src={m.posterUrl?.split('|')[0]} alt={m.movieTitle} />
                    <h3 className="text-white">{m.movieTitle}</h3>
                </div>
            ))}
        </div>
    );
}