import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Typography, Button, message, Space, Tag, Empty, Row, Col, Divider, Modal } from "antd";
import { 
  ClockCircleOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined,
  StarFilled,
  PlayCircleOutlined,
  ArrowLeftOutlined,
  PlayCircleFilled,
  VideoCameraOutlined
} from "@ant-design/icons";
import { moviesAPI } from "../../api/movies";
import { showtimesAPI } from "../../api/showtimes";
import { getSafePosterUrl } from "../../utils/image";
import "../../styles.css";

const { Title, Text, Paragraph } = Typography;

// Gợi ý trailer YouTube theo tên phim (search embed)
const getTrailerUrl = (title) => {
  if (!title) return null;
  const q = encodeURIComponent(`${title} official trailer`);
  return `https://www.youtube.com/embed?listType=search&list=${q}&autoplay=1`;
};

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [movieData, showtimeData] = await Promise.all([
          moviesAPI.getById(id),
          showtimesAPI.getByMovieId(id),
        ]);
        setMovie(movieData);
        setShowtimes(Array.isArray(showtimeData) ? showtimeData : []);
      } catch (error) {
        message.error("Không thể tải thông tin phim.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="center-page"><Spin size="large" /></div>;

  const getVal = (obj, keys) => {
    if (!obj) return null;
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    const allKeys = Object.keys(obj);
    const target = keys[0].toLowerCase();
    const found = allKeys.find(k => k.toLowerCase().includes(target));
    return found ? obj[found] : null;
  };

  const title = getVal(movie, ["title", "Title", "Name"]);
  const desc = getVal(movie, ["description", "Description", "Desc"]);
  const duration = getVal(movie, ["durationMin", "DurationMin", "Duration", "Time"]);
  const genre = getVal(movie, ["genre", "Genre", "Category"]);
  const posterUrl = getSafePosterUrl(getVal(movie, ["posterUrl", "PosterUrl", "Image", "Thumbnail"]));
  const trailerUrl = movie?.trailerUrl || getTrailerUrl(title);

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1a0a12 0%, #2d0a1f 60%, #1a0820 100%)",
        position: "relative", overflow: "hidden", paddingBottom: 80
      }}>
        {/* BG poster blur */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${posterUrl})`,
          backgroundSize: "cover", backgroundPosition: "center 20%",
          filter: "blur(4px) brightness(0.15)", transform: "scale(1.06)"
        }} />
        {/* Pink glow */}
        <div style={{
          position: "absolute", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(174,32,112,0.2) 0%, transparent 65%)",
          top: -200, right: -100, pointerEvents: "none"
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
          background: "linear-gradient(to top, #f5f7fb, transparent)"
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 20px", position: "relative", zIndex: 2 }}>
          <Button
            icon={<ArrowLeftOutlined />} type="text"
            onClick={() => navigate("/movies")}
            style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontWeight: 600 }}
          >
            Quay lại danh sách phim
          </Button>

          <Row gutter={[40, 40]} align="middle">
            {/* Poster */}
            <Col xs={24} sm={8} md={7}>
              <div style={{
                borderRadius: 24, overflow: "hidden",
                boxShadow: "0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                position: "relative"
              }}>
                <img src={posterUrl} alt={title} style={{ width: "100%", display: "block" }} />
                {/* Play overlay */}
                <div
                  onClick={() => setTrailerOpen(true)}
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "background 0.3s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}
                >
                  <PlayCircleFilled style={{
                    fontSize: 60, color: "rgba(255,255,255,0)",
                    filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))",
                    transition: "all 0.3s ease"
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0)"}
                  />
                </div>
              </div>
            </Col>

            {/* Info */}
            <Col xs={24} sm={16} md={17}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {/* Tags */}
                <Space size={8}>
                  <Tag style={{ borderRadius: 8, fontWeight: 700, background: "rgba(174,32,112,0.2)", border: "1px solid rgba(216,45,139,0.4)", color: "#f06292" }}>2D</Tag>
                  <Tag style={{ borderRadius: 8, fontWeight: 700, background: "rgba(255,165,0,0.15)", border: "1px solid rgba(255,165,0,0.3)", color: "#ffaa00" }}>
                    {getVal(movie, ["rating", "Rating"]) || "T13"}
                  </Tag>
                  <Space style={{ color: "#faad14", fontWeight: 800, background: "rgba(255,215,0,0.1)", borderRadius: 8, padding: "2px 12px", border: "1px solid rgba(255,215,0,0.2)" }}>
                    <StarFilled style={{ fontSize: 13 }} /> 9.4
                    <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>(10.2k)</Text>
                  </Space>
                </Space>

                <Title style={{ color: "#fff", margin: 0, fontWeight: 900, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-1px" }}>
                  {title || "Đang tải tên phim..."}
                </Title>

                <Space split={<Divider type="vertical" style={{ borderColor: "rgba(255,255,255,0.2)" }} />} style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
                  <Space><ClockCircleOutlined />{duration || "--"} phút</Space>
                  <Text style={{ color: "rgba(255,255,255,0.5)" }}>{genre || "Hành động"}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.5)" }}>{movie?.releaseDate ? new Date(movie.releaseDate).getFullYear() : "2026"}</Text>
                </Space>

                <Divider style={{ borderColor: "rgba(255,255,255,0.1)", margin: "4px 0" }} />

                <Paragraph style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.85, maxWidth: 580, margin: 0 }}>
                  {desc || "Bộ phim hấp dẫn với cốt truyện kịch tính đang chờ đợi bạn khám phá tại CinemaMS."}
                </Paragraph>

                {/* Action buttons */}
                <Space size={12} style={{ marginTop: 8 }}>
                  <Button
                    size="large" icon={<PlayCircleOutlined />}
                    onClick={() => setTrailerOpen(true)}
                    style={{
                      height: 50, padding: "0 28px", borderRadius: 16, fontWeight: 700,
                      background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                      fontSize: 15
                    }}
                  >
                    XEM TRAILER
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* ── SHOWTIMES SECTION ────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 60px" }}>
        <div style={{
          background: "#fff", borderRadius: 24, padding: 32,
          border: "1px solid #f0f0f5",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "linear-gradient(135deg, #fce8f3, #f8d0e8)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <CalendarOutlined style={{ color: "#ae2070", fontSize: 20 }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: "#1a1a2e" }}>Lịch chiếu khả dụng</Title>
              <Text style={{ color: "#6b6b8a", fontSize: 13 }}>Chọn suất chiếu phù hợp để đặt vé</Text>
            </div>
          </div>

          {showtimes.length === 0 ? (
            <Empty
              description="Hiện tại chưa có suất chiếu nào cho phim này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button onClick={() => navigate("/movies")} style={{ borderRadius: 12 }}>Khám phá phim khác</Button>
            </Empty>
          ) : (
            <div style={{ background: "#f8f9fb", borderRadius: 18, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <EnvironmentOutlined style={{ color: "#ae2070" }} />
                <Text strong style={{ fontSize: 15, color: "#1a1a2e" }}>CinemaMS Toàn Quốc</Text>
              </div>
              <Space wrap size={12}>
                {showtimes.map((s) => (
                  <div
                    key={s.showtimeId}
                    onClick={() => navigate(`/seat-selection/${s.showtimeId}`)}
                    style={{
                      background: "#fff", borderRadius: 14, padding: "14px 22px",
                      cursor: "pointer", textAlign: "center",
                      border: "1.5px solid #f0f0f5",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      transition: "all 0.25s ease",
                      minWidth: 100
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#ae2070";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(174,32,112,0.18)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "#f0f0f5";
                      e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: 20, color: "#1a1a2e" }}>
                      {new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 3 }}>
                      {new Date(s.startTime).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}
                    </div>
                    <div style={{
                      display: "inline-block", marginTop: 8,
                      fontSize: 11, color: "#ae2070", fontWeight: 700,
                      background: "#fce8f3", borderRadius: 6, padding: "2px 8px"
                    }}>
                      {s.roomName} · {s.format || "2D"}
                    </div>
                  </div>
                ))}
              </Space>
            </div>
          )}
        </div>
      </div>

      {/* ── TRAILER MODAL ────────────────────────────────────────── */}
      <Modal
        open={trailerOpen}
        onCancel={() => setTrailerOpen(false)}
        footer={null}
        centered
        width={860}
        styles={{
          body: { padding: 0, borderRadius: 24, overflow: "hidden" },
          content: { borderRadius: 24, overflow: "hidden", padding: 0, background: "#000" }
        }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px 0" }}>
            <VideoCameraOutlined style={{ color: "#ae2070" }} />
            <span style={{ fontWeight: 800 }}>TRAILER · {title}</span>
          </div>
        }
      >
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
          {trailerOpen && (
            <iframe
              src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent((title || "") + " official trailer 2024 2025")}&autoplay=1&rel=0`}
              title={`Trailer ${title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "100%", border: "none"
              }}
            />
          )}
        </div>
        <div style={{ padding: "16px 24px", background: "#fff" }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            ⚠️ Nếu trailer không hiển thị, vui lòng tìm kiếm "{title} trailer" trên YouTube.
          </Text>
        </div>
      </Modal>
    </div>
  );
}
