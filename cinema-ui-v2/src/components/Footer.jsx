import styles from "./Footer.module.css";

const COLS = [
  { title: "Phim", items: ["Đang chiếu","Sắp chiếu","Phim hay","Bình chọn"] },
  { title: "Rạp chiếu", items: ["CGV","Lotte Cinema","Galaxy Cinema","BHD Star"] },
  { title: "Hỗ trợ", items: ["Hướng dẫn đặt vé","Chính sách hoàn vé","Liên hệ","FAQ"] },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span>🎬</span>
              <span className={styles.logoText}>CINEMA<span className={styles.logoAccent}>MS</span></span>
            </div>
            <p className={styles.brandDesc}>
              Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam. Nhanh chóng, tiện lợi, an toàn 24/7.
            </p>
            <div className={styles.socials}>
              {["📘","📸","▶","🐦"].map((icon, i) => (
                <a key={i} href="#" className={styles.socialBtn}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Cols */}
          {COLS.map(col => (
            <div key={col.title}>
              <h4 className={styles.colTitle}>{col.title}</h4>
              {col.items.map(item => (
                <a key={item} href="#" className={styles.colLink}>{item}</a>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p>© 2025 CinemaMS · BA Team — Môn Phân Tích Yêu Cầu Phần Mềm</p>
          <p>Hotline: <a href="tel:19006017" className={styles.hotline}>1900 6017</a> · support@cinemaMS.vn</p>
        </div>
      </div>
    </footer>
  );
}
