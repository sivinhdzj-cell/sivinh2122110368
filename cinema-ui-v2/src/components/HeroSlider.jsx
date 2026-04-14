import { useState, useEffect, useRef } from "react";
import styles from "./HeroSlider.module.css";

const ratingColor = r =>
    ({ P: "#22c55e", C13: "#f59e0b", C16: "#f97316", C18: "#ef4444" }[r] || "#6b7280");

export default function HeroSlider() {
    const [movies, setMovies] = useState([]);
    const [cur, setCur] = useState(0);
    const [anim, setAnim] = useState(false);
    const timerRef = useRef(null);

    // 👉 FETCH API
    useEffect(() => {
        fetch("http://localhost:5269/api/Movie")
            .then(res => res.json())
            .then(data => setMovies(data || []))
            .catch(err => console.error("API error:", err));
    }, []);

    // 👉 chỉ lấy 5 phim đầu
    const heroSlides = movies.slice(0, 5);

    const film = heroSlides[cur] || {};

    // 👉 reset index khi data thay đổi
    useEffect(() => {
        setCur(0);
    }, [movies]);

    // 👉 autoplay slider (FIX quan trọng)
    useEffect(() => {
        if (!heroSlides.length) return;

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setCur(prev => (prev + 1) % heroSlides.length);
        }, 6500);

        return () => clearInterval(timerRef.current);
    }, [heroSlides.length]);

    const goTo = (idx) => {
        if (anim || idx === cur) return;

        setAnim(true);
        setTimeout(() => {
            setCur(idx);
            setAnim(false);
        }, 400);
    };

    if (!heroSlides.length) return null;

    return (
        <section className={styles.hero}>

            {/* BACKGROUND */}
            {heroSlides.map((f, i) => (
                <div
                    key={f.movieId}
                    className={styles.bg}
                    style={{
                        backgroundImage: `url(${f.posterUrl})`,
                        opacity: i === cur ? 1 : 0,
                    }}
                />
            ))}

            <div className={styles.overlayLeft} />
            <div className={styles.overlayBottom} />
            <div className={styles.overlayVignette} />

            {/* CONTENT */}
            <div className={`${styles.content} ${anim ? styles.contentFade : ""}`}>
                <div className={styles.badges}>
                    <span className={styles.badgeLive}>● ĐANG CHIẾU</span>

                    <span
                        className={styles.badgeRating}
                        style={{ background: ratingColor(film.rating) }}
                    >
                        {film.rating || "N/A"}
                    </span>
                </div>

                <h1 className={styles.title}>
                    {film.title || "Loading..."}
                </h1>

                <div className={styles.meta}>
                    <span className={styles.score}>⭐ 8.5/10</span>
                    <span className={styles.sep}>•</span>
                    <span>{film.genre || "Đang cập nhật"}</span>
                    <span className={styles.sep}>•</span>
                    <span>⏱ {film.durationMin || "--"} phút</span>
                </div>

                <p className={styles.desc}>
                    {film.description || "Đang cập nhật..."}
                </p>
            </div>

            {/* DOTS */}
            <div className={styles.dots}>
                {heroSlides.map((_, i) => (
                    <button
                        key={i}
                        className={`${styles.dot} ${i === cur ? styles.dotActive : ""}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>

        </section>
    );
}