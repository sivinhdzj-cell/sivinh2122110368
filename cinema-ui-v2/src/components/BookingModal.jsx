import { useState, useEffect } from "react";
import styles from "./BookingModal.module.css";
import { showtimeService, bookingService } from "../api/api";

export default function BookingModal({ movie, onClose }) {
    const [step, setStep] = useState(0);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
    const [loading, setLoading] = useState(true);

    const movieId = movie?.movieId || movie?.id;

    useEffect(() => {
        const fetchShowtimes = async () => {
            if (!movieId) return;
            try {
                setLoading(true);
                const res = await showtimeService.getShowtimes();
                const allData = Array.isArray(res.data) ? res.data : [];

                // Lọc lịch chiếu theo phim đang chọn
                const filtered = allData.filter(s => (s.movieId || s.MovieId) == movieId);
                setShowtimes(filtered);
            } catch (err) {
                console.error("Lỗi tải lịch chiếu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchShowtimes();
    }, [movieId]);

    const uniqueDates = [...new Set(showtimes.map(s => {
        const fullDate = s.startTime || s.StartTime;
        return fullDate ? fullDate.split('T')[0] : null;
    }))].filter(Boolean).sort();

    const availableTimes = showtimes
        .filter(s => (s.startTime || s.StartTime)?.startsWith(date))
        .map(s => ({
            id: s.showtimeId || s.ShowtimeId || s.id,
            time: (s.startTime || s.StartTime)?.split('T')[1].substring(0, 5),
            format: s.format || s.Format || "2D"
        }));

    const handleNext = async () => {
        // Nếu đang ở bước chọn Ngày (0) hoặc chọn Giờ (1), chỉ chuyển bước
        if (step < 2) {
            setStep(s => s + 1);
            return;
        }

        // Bước 2: Thực hiện gọi API đặt vé thật
        try {
            if (!selectedShowtimeId) {
                alert("Lỗi: Chưa xác định được ID lịch chiếu!");
                return;
            }

            const bookingData = {
                showtimeId: selectedShowtimeId,
                // Thêm các trường khác nếu Backend yêu cầu (VD: seatNumber: "A1")
            };

            await bookingService.createBooking(bookingData);
            alert("✅ Đặt vé thành công!");
            onClose();
        } catch (err) {
            console.error("Chi tiết lỗi đặt vé:", err.response?.data);
            if (err.response?.status === 401) {
                alert("❌ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
            } else {
                alert("❌ Lỗi: " + (err.response?.data?.message || "Không thể kết nối đến máy chủ"));
            }
        }
    };

    if (!movie) return null;

    return (
        <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.movieTitle}>{movie.movieTitle || movie.title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.body}>
                    {loading ? (
                        <p className={styles.loading}>Đang tải lịch chiếu...</p>
                    ) : (
                        <>
                            {step === 0 && (
                                <div className={styles.grid}>
                                    {uniqueDates.length > 0 ? uniqueDates.map(d => (
                                        <button
                                            key={d}
                                            className={`${styles.btn} ${date === d ? styles.active : ""}`}
                                            onClick={() => { setDate(d); setTime(null); }}
                                        >
                                            {d.split('-')[2]}/{d.split('-')[1]}
                                        </button>
                                    )) : <p>Phim hiện chưa có lịch chiếu.</p>}
                                </div>
                            )}

                            {step === 1 && (
                                <div className={styles.grid}>
                                    {availableTimes.map(t => (
                                        <button
                                            key={t.id}
                                            className={`${styles.btn} ${time === t.time ? styles.active : ""}`}
                                            onClick={() => { setTime(t.time); setSelectedShowtimeId(t.id); }}
                                        >
                                            {t.time} ({t.format})
                                        </button>
                                    ))}
                                </div>
                            )}

                            {step === 2 && (
                                <div className={styles.confirmBox}>
                                    <p className={styles.confirmText}>Bạn xác nhận đặt vé:</p>
                                    <p>🎬 Phim: <b>{movie.movieTitle || movie.title}</b></p>
                                    <p>⏰ Suất: <b>{time}</b> ngày <b>{date}</b></p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className={styles.footer}>
                    {step > 0 && <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>Quay lại</button>}
                    <button
                        disabled={(step === 0 && !date) || (step === 1 && !time) || loading}
                        onClick={handleNext}
                        className={styles.primaryBtn}
                    >
                        {step < 2 ? "Tiếp tục" : "Xác nhận đặt vé"}
                    </button>
                </div>
            </div>
        </div>
    );
}