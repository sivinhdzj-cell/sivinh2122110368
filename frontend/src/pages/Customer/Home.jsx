import { useEffect, useState } from "react";
import { Button, Col, Row, Typography, Spin, Empty, message, Tag, Space, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  PlayCircleFilled, FireOutlined, ThunderboltFilled, StarFilled,
  RocketOutlined, GiftOutlined, CrownOutlined, ArrowRightOutlined,
  ClockCircleOutlined, VideoCameraOutlined
} from "@ant-design/icons";
import { moviesAPI } from "../../api/movies";
import { getSafePosterUrl } from "../../utils/image";
import "../../styles.css";

const { Title, Text, Paragraph } = Typography;

// ─── MOVIE CARD (MoMo Style) ──────────────────────────────────────────────────
function MovieCard({ movie, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        borderRadius: 20, overflow: "hidden", cursor: "pointer", background: "#fff",
        boxShadow: hov ? "0 20px 50px rgba(174,32,112,0.18)" : "0 4px 20px rgba(0,0,0,0.07)",
        transform: hov ? "translateY(-8px)" : "none",
        transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
        border: hov ? "1px solid #fce8f3" : "1px solid #f0f0f5"
      }}
    >
      {/* Poster */}
      <div style={{ aspectRatio: "2/3", overflow: "hidden", position: "relative" }}>
        <img
          src={getSafePosterUrl(movie.posterUrl)}
          alt={movie.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hov ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.5s ease"
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: hov
            ? "linear-gradient(to top, rgba(174,32,112,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)"
        }} />
        {/* Rating */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(255,255,255,0.92)", borderRadius: 10,
          padding: "3px 10px", display: "flex", alignItems: "center", gap: 4
        }}>
          <StarFilled style={{ color: "#faad14", fontSize: 11 }} />
          <Text style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>8.5</Text>
        </div>
        {/* Genre pill */}
        {movie.genre && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "linear-gradient(135deg, #ae2070, #d82d8b)",
            borderRadius: 8, padding: "2px 10px"
          }}>
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>
              {movie.genre.split(",")[0].trim()}
            </Text>
          </div>
        )}
        {/* CTA on hover */}
        <div style={{
          position: "absolute", bottom: 12, left: 12, right: 12,
          opacity: hov ? 1 : 0, transform: hov ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.25s ease"
        }}>
          <Button
            type="primary" block
            style={{
              background: "#fff", color: "#ae2070",
              border: "none", borderRadius: 12, fontWeight: 800, height: 38
            }}
          >
            <PlayCircleFilled /> ĐẶT VÉ NGAY
          </Button>
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: "14px 14px 16px" }}>
        <Title level={5} ellipsis style={{ margin: "0 0 4px", color: "#1a1a2e", fontWeight: 800, fontSize: 14 }}>
          {movie.title}
        </Title>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ClockCircleOutlined style={{ color: "#ae2070", fontSize: 11 }} />
          <Text style={{ color: "#6b6b8a", fontSize: 12 }}>{movie.durationMin || 120} phút</Text>
        </div>
      </div>
    </div>
  );
}

// ─── PROMO CARD ──────────────────────────────────────────────────────────────
function PromoCard({ gradient, icon, title, desc, badge, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: gradient, borderRadius: 22, padding: "24px 20px 20px",
        position: "relative", overflow: "hidden", cursor: "pointer",
        height: 130,
        boxShadow: hov ? "0 16px 40px rgba(0,0,0,0.18)" : "0 4px 20px rgba(0,0,0,0.1)",
        transform: hov ? "translateY(-5px) scale(1.015)" : "none",
        transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)"
      }}
    >
      <div style={{
        position: "absolute", width: 120, height: 120,
        background: "rgba(255,255,255,0.1)", borderRadius: "50%",
        right: -30, bottom: -30
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {badge && (
          <span style={{
            background: "rgba(255,255,255,0.25)", borderRadius: 100,
            padding: "2px 10px", fontSize: 11, color: "#fff", fontWeight: 700,
            display: "inline-block", marginBottom: 8
          }}>{badge}</span>
        )}
        <Title level={4} style={{ color: "#fff", margin: "0 0 2px", fontWeight: 900, fontSize: 17 }}>{title}</Title>
        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{desc}</Text>
      </div>
      <div style={{
        position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
        fontSize: 42, color: "rgba(255,255,255,0.22)"
      }}>{icon}</div>
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────
export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("now");
  const navigate = useNavigate();

  useEffect(() => {
    moviesAPI.getAll()
      .then(data => setMovies(Array.isArray(data) ? data : []))
      .catch(() => message.error("Không thể tải danh sách phim."))
      .finally(() => setLoading(false));
  }, []);

  const featured = movies[0];

  return (
    <div style={{ background: "#f5f7fb" }}>
      {/* ── HERO (MoMo Style) ────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1a0a12 0%, #2d0a1f 40%, #1a0a20 100%)",
        position: "relative", overflow: "hidden", minHeight: 520,
        display: "flex", alignItems: "center"
      }}>
        {/* BG pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: featured ? `url(${getSafePosterUrl(featured.posterUrl)})` : "none",
          backgroundSize: "cover", backgroundPosition: "center 25%",
          filter: "blur(3px) brightness(0.18)", transform: "scale(1.05)"
        }} />
        {/* Pink glow */}
        <div style={{
          position: "absolute", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(174,32,112,0.25) 0%, transparent 65%)",
          top: -200, right: -200, pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 180,
          background: "linear-gradient(to top, #f5f7fb, transparent)"
        }} />

        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "80px 24px 100px",
          width: "100%", position: "relative", zIndex: 2
        }}>
          <Row gutter={[48, 40]} align="middle">
            <Col xs={24} lg={13}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(174,32,112,0.25)", border: "1px solid rgba(216,45,139,0.4)",
                borderRadius: 100, padding: "6px 18px", marginBottom: 24
              }}>
                <FireOutlined style={{ color: "#d82d8b" }} />
                <Text style={{ color: "#f06292", fontWeight: 700, fontSize: 13 }}>
                  PHIM BOM TẤN THÁNG 4 · 2026
                </Text>
              </div>

              <Title style={{
                color: "#fff", fontWeight: 900, lineHeight: 1.1,
                letterSpacing: "-2px", margin: "0 0 20px",
                fontSize: "clamp(36px, 5.5vw, 68px)"
              }}>
                {featured?.title || "Hành Trình"}<br />
                <span style={{
                  background: "linear-gradient(135deg, #d82d8b, #f06292, #ff8870)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>
                  Điện Ảnh 2026
                </span>
              </Title>

              <Paragraph style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.8, maxWidth: 500, marginBottom: 36 }}>
                Trải nghiệm đặt vé thế hệ mới với MoMo và VNPay. Nhanh hơn, mượt hơn và đầy ưu đãi.
              </Paragraph>

              <Space size={12}>
                <Button
                  type="primary" size="large"
                  onClick={() => navigate("/movies")}
                  style={{
                    background: "linear-gradient(135deg, #ae2070, #d82d8b)",
                    border: "none", height: 54, padding: "0 40px",
                    fontSize: 17, fontWeight: 800, borderRadius: 16,
                    boxShadow: "0 12px 32px rgba(174,32,112,0.45)"
                  }}
                >
                  <PlayCircleFilled /> ĐẶT VÉ NGAY
                </Button>
                <Button
                  size="large" ghost
                  style={{
                    height: 54, padding: "0 32px", fontSize: 16, fontWeight: 700,
                    borderRadius: 16, borderColor: "rgba(255,255,255,0.25)", color: "#fff"
                  }}
                >
                  XEM TRAILER
                </Button>
              </Space>
            </Col>

            {/* Featured poster */}
            <Col xs={0} lg={11}>
              <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <div style={{
                  position: "absolute", width: "70%", height: 300,
                  background: "radial-gradient(ellipse, rgba(174,32,112,0.5) 0%, transparent 70%)",
                  bottom: -60, left: "50%", transform: "translateX(-50%)", filter: "blur(35px)"
                }} />
                <img
                  src={getSafePosterUrl(featured?.posterUrl)}
                  alt="Featured"
                  style={{
                    width: "60%", borderRadius: 24,
                    boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
                    position: "relative", zIndex: 2,
                    animation: "momoFloat 6s ease-in-out infinite"
                  }}
                />
                {/* Rating float */}
                <div style={{
                  position: "absolute", top: 20, right: "10%", zIndex: 3,
                  background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)",
                  borderRadius: 16, padding: "12px 16px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                  animation: "momoFloat 4s ease-in-out infinite reverse"
                }}>
                  <StarFilled style={{ color: "#faad14", fontSize: 20, display: "block", margin: "0 auto 4px" }} />
                  <Text style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>9.2</Text>
                  <br /><Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>IMDb</Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Promo cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 64 }}>
          <Col xs={24} md={8}>
            <PromoCard
              gradient="linear-gradient(135deg, #6c3ce2, #a855f7)"
              icon={<RocketOutlined />} title="Voucher 20k"
              desc="Cho vé đầu tiên qua MoMo" badge="🎁 ĐỘC QUYỀN"
            />
          </Col>
          <Col xs={24} md={8}>
            <PromoCard
              gradient="linear-gradient(135deg, #ae2070, #e91e8c)"
              icon={<GiftOutlined />} title="Combo 99k"
              desc="Bắp nước thả ga, xem đã đời" badge="🍿 SIÊU HOT"
            />
          </Col>
          <Col xs={24} md={8}>
            <PromoCard
              gradient="linear-gradient(135deg, #0288d1, #0057b8)"
              icon={<CrownOutlined />} title="Thành viên VIP"
              desc="Nhận vé miễn phí mỗi tháng" badge="👑 VIP CLUB"
            />
          </Col>
        </Row>

        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 4, height: 28, background: "linear-gradient(135deg, #ae2070, #d82d8b)",
              borderRadius: 4
            }} />
            <div>
              <Title level={2} style={{ margin: 0, fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px" }}>
                Phim nổi bật
              </Title>
              <Text style={{ color: "#6b6b8a", fontSize: 13 }}>Cập nhật suất chiếu mới nhất mỗi ngày</Text>
            </div>
          </div>
          <Button
            type="text"
            onClick={() => navigate("/movies")}
            style={{ color: "#ae2070", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}
          >
            Xem tất cả <ArrowRightOutlined />
          </Button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[
            { key: "now", label: "🎬 Đang chiếu" },
            { key: "soon", label: "🚀 Sắp chiếu" }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "9px 22px", borderRadius: 100, border: "none",
                cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit",
                background: activeTab === t.key
                  ? "linear-gradient(135deg, #ae2070, #d82d8b)"
                  : "#fff",
                color: activeTab === t.key ? "#fff" : "#6b6b8a",
                boxShadow: activeTab === t.key
                  ? "0 6px 20px rgba(174,32,112,0.35)"
                  : "0 2px 8px rgba(0,0,0,0.06)",
                border: activeTab === t.key ? "none" : "1px solid #f0f0f5",
                transition: "all 0.2s ease"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Movie grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}><Spin size="large" /></div>
        ) : activeTab === "now" ? (
          movies.length === 0 ? (
            <Empty description="Chưa có phim mới" />
          ) : (
            <Row gutter={[20, 28]}>
              {movies.slice(0, 8).map(movie => (
                <Col key={movie.movieId} xs={12} sm={8} md={6}>
                  <MovieCard movie={movie} onClick={() => navigate(`/movies/${movie.movieId}`)} />
                </Col>
              ))}
            </Row>
          )
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
            <Text style={{ color: "#6b6b8a", fontSize: 16 }}>Đang cập nhật lịch phim sắp chiếu...</Text>
          </div>
        )}

        {/* CTA Banner */}
        <div style={{
          marginTop: 80,
          background: "linear-gradient(135deg, #ae2070 0%, #d82d8b 60%, #f06292 100%)",
          borderRadius: 28, padding: "52px 48px", textAlign: "center",
          position: "relative", overflow: "hidden",
          boxShadow: "0 20px 60px rgba(174,32,112,0.3)"
        }}>
          <div style={{
            position: "absolute", width: 300, height: 300,
            background: "rgba(255,255,255,0.06)", borderRadius: "50%",
            top: -100, right: -80
          }} />
          <div style={{
            position: "absolute", width: 200, height: 200,
            background: "rgba(255,255,255,0.06)", borderRadius: "50%",
            bottom: -60, left: -40
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Title level={2} style={{ color: "#fff", margin: "0 0 12px", fontWeight: 900 }}>
              Sẵn sàng cho trải nghiệm điện ảnh?
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, display: "block", marginBottom: 32 }}>
              Đặt vé ngay và nhận ưu đãi Voucher 20k cho lần đầu tiên qua MoMo!
            </Text>
            <Button
              size="large"
              onClick={() => navigate("/movies")}
              style={{
                background: "#fff", color: "#ae2070", border: "none",
                borderRadius: 16, height: 52, padding: "0 44px",
                fontSize: 17, fontWeight: 900,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
              }}
            >
              KHÁM PHÁ NGAY <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes momoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  );
}
