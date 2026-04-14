import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

const LINKS = ["Trang chủ", "Lịch chiếu", "Rạp chiếu", "Khuyến mãi", "Quản trị"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🎬</span>
          <span className={styles.logoText}>
            CINEMA<span className={styles.logoAccent}>MS</span>
          </span>
        </div>

        {/* Links */}
        <div className={styles.links}>
          {LINKS.map((l, i) => (
            <a
              key={l}
              href="#"
              className={`${styles.link} ${active === i ? styles.linkActive : ""}`}
              onClick={e => { e.preventDefault(); setActive(i); }}
            >
              {l}
              {active === i && <span className={styles.linkDot} />}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.btnSearch}>🔍</button>
          <button className={styles.btnLogin}>Đăng nhập</button>
          <button className={styles.btnRegister}>Đăng ký</button>
        </div>
      </div>
    </nav>
  );
}
