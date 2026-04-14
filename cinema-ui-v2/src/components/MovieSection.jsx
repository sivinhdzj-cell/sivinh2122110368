import MovieCard from "./MovieCard";
import styles from "./MovieSection.module.css";

export default function MovieSection({
    title,
    subtitle,
    movies = [],
    onBook,
    upcoming = false
}) {
    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                {/* Header hiện đại với vạch màu accent */}
                <div className={styles.header}>
                    <div className={styles.titleContainer}>
                        <h2 className={styles.title}>{title}</h2>
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                    <a href="#" className={styles.viewAll}>
                        Xem tất cả <span>→</span>
                    </a>
                </div>

                {/* Grid 6 cột đối xứng, áp dụng hiệu ứng fade-up từ global.css */}
                <div className={`${styles.grid} fade-up`}>
                    {movies.length > 0 ? (
                        movies.map((m) => (
                            <MovieCard
                                // Dùng title làm fallback key nếu id lỗi để tránh trùng lặp component
                                key={m.movie_id || m.movieId || m.title}
                                movie={m}
                                onBook={onBook}
                                upcoming={upcoming}
                            />
                        ))
                    ) : (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Đang tải danh sách phim...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}