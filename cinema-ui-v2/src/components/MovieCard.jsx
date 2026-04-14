import { useState } from "react";
import styles from "./MovieCard.module.css";

const ratingColor = r =>
    ({ P: "#22c55e", C13: "#f59e0b", C16: "#f97316", C18: "#ef4444" }[r] || "#6b7280");

export default function MovieCard({ movie, onBook, upcoming = false }) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false); // Theo dõi lỗi ảnh

    return (
        <div
            className={`${styles.card} ${hovered ? styles.cardHover : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Poster Container */}
            <div className={styles.poster}>
                <img
                    // ✅ Ưu tiên posterUrl sạch từ Unsplash
                    src={imgError ? "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop" : (movie.posterUrl || movie.poster_url || movie.image)}
                    alt={movie.title}
                    className={`${styles.img} ${hovered ? styles.imgZoom : ""} ${imgError ? styles.imgGray : ""}`}
                    // ✅ Thay đổi state khi ảnh lỗi để hiện ảnh dự phòng xịn
                    onError={() => setImgError(true)}
                />

                <div className={`${styles.overlay} ${hovered ? styles.overlayDark : ""}`} />

                {/* Rating */}
                <span
                    className={styles.ratingBadge}
                    style={{ background: ratingColor(movie.rating) }}
                >
                    {movie.rating || "N/A"}
                </span>

                {/* Hover actions */}
                {!upcoming && hovered && (
                    <div className={styles.hoverActions}>
                        <button className={styles.btnBook} onClick={() => onBook(movie)}>
                            🎟 Đặt vé
                        </button>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <h3 className={styles.title} title={movie.title}>{movie.title}</h3>
                <p className={styles.genre}>{movie.genre || "Phim hay"}</p>
                <div className={styles.meta}>
                    <span className={styles.duration}>
                        ⏱ {movie.durationMin || movie.duration || 120} phút
                    </span>
                </div>
            </div>
        </div>
    );
}