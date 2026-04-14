import { useState } from "react";
import styles from "./SearchBar.module.css";

const GENRES = ["Hành động", "Hài", "Kinh dị", "Tình cảm", "Hoạt hình", "Khoa học viễn tưởng", "Gia đình"];

export default function SearchBar({ onSearch }) {
    const [q, setQ] = useState("");
    const [genre, setGenre] = useState("");
    const [date, setDate] = useState("");
    const [cinema, setCinema] = useState("");

    return (
        <section className={styles.wrap}>
            <div className={styles.card}>

                <div className={styles.header}>
                    <span className={styles.icon}>🔍</span>
                    <span className={styles.label}>TÌM KIẾM PHIM</span>
                </div>

                <div className={styles.row}>

                    <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}>🎬</span>
                        <input
                            className={styles.input}
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="Tên phim, diễn viên..."
                        />
                    </div>

                    <select className={styles.select} value={genre} onChange={e => setGenre(e.target.value)}>
                        <option value="">Thể loại</option>
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>

                    <input
                        type="date"
                        className={styles.select}
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />

                    <select className={styles.select} value={cinema} onChange={e => setCinema(e.target.value)}>
                        <option value="">Chọn rạp</option>
                        {["CGV", "Lotte Cinema", "Galaxy Cinema", "BHD Star"].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <button
                        className={styles.btn}
                        onClick={() =>
                            onSearch({ q, genre, date, cinema })
                        }
                    >
                        Tìm kiếm
                    </button>

                </div>

                <div className={styles.quick}>
                    <span className={styles.quickLabel}>Nhanh:</span>
                    {["Hôm nay", "Cuối tuần", "IMAX", "4DX", "Phim Việt"].map(t => (
                        <button key={t} className={styles.quickBtn}>{t}</button>
                    ))}
                </div>

            </div>
        </section>
    );
}