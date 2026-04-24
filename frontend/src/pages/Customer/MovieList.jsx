import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Spin, Tag, Typography, Button, Input, Empty, message, Badge } from "antd";
import { SearchOutlined, RobotOutlined, ClockCircleOutlined, FireOutlined } from "@ant-design/icons";
import { moviesAPI } from "../../api/movies";
import { showtimesAPI } from "../../api/showtimes";
import { getSafePosterUrl } from "../../utils/image";
import "../../styles.css";

const { Title, Text, Paragraph } = Typography;

const AI_TAGS = [
  { label: "Bom tấn 2026", query: "2026", icon: "🔥" },
  { label: "Hành động", query: "Hành động", icon: "⚔️" },
  { label: "Khoa học viễn tưởng", query: "Khoa học", icon: "🚀" },
  { label: "Tâm lý", query: "Tâm lý", icon: "🎭" },
  { label: "Hoạt hình", query: "Hoạt hình", icon: "🦄" },
];

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [showtimeMap, setShowtimeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [data, showtimes] = await Promise.all([moviesAPI.getAll(), showtimesAPI.getAll()]);
        setMovies(Array.isArray(data) ? data : []);
        const map = {};
        (Array.isArray(showtimes) ? showtimes : []).forEach((s) => {
          if (!map[s.movieId]) map[s.movieId] = [];
          map[s.movieId].push(s);
        });
        setShowtimeMap(map);
      } catch (error) {
        message.error("Không thể tải danh sách phim. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Giả lập AI Suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = movies
        .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3);
      setAiSuggestions(filtered);
    } else {
      setAiSuggestions([]);
    }
  }, [searchQuery, movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.genre?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = !activeTag || m.genre?.toLowerCase().includes(activeTag.toLowerCase()) || 
                                     m.title.toLowerCase().includes(activeTag.toLowerCase());
      return matchSearch && matchTag;
    });
  }, [searchQuery, activeTag, movies]);

  if (loading) return <div className="center-page"><Spin size="large" /></div>;

  return (
    <div className="animate-momo" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>
      {/* AI SEARCH HEADER */}
      <div style={{ textAlign: "center", marginBottom: 60, marginTop: 40 }}>
        <Title level={1} style={{ fontWeight: 900, marginBottom: 8, fontSize: 48, letterSpacing: -1 }}>
          Khám phá <span style={{ background: "var(--momo-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Điện ảnh</span>
        </Title>
        <Paragraph style={{ fontSize: 18, color: "var(--text-grey)", marginBottom: 32 }}>Trải nghiệm tìm kiếm thông minh cùng trợ lý AI 2026</Paragraph>
        
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div className="ai-search-glow">
            <div className="search-container-modern">
              <SearchOutlined style={{ color: "var(--momo-pink)", fontSize: 22, marginLeft: 16 }} />
              <Input 
                placeholder="Tìm phim, thể loại hoặc diễn viên (AI gợi ý...)" 
                variant="borderless"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setActiveTag(null); }}
                style={{ fontSize: 17, padding: "14px 16px", fontWeight: 500 }}
              />
              <div className="ai-status-pulse">
                <RobotOutlined style={{ color: "var(--momo-pink)", fontSize: 22 }} />
                <span className="pulse-dot" />
              </div>
            </div>
          </div>

          {/* AI SMART TAGS */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            {AI_TAGS.map(tag => (
              <Tag 
                key={tag.label}
                className={`ai-smart-tag ${activeTag === tag.query ? 'active' : ''}`}
                onClick={() => {
                  const newTag = activeTag === tag.query ? null : tag.query;
                  setActiveTag(newTag);
                  if (newTag) setSearchQuery("");
                }}
              >
                {tag.icon} {tag.label}
              </Tag>
            ))}
          </div>

          {aiSuggestions.length > 0 && (
            <div style={{ 
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
              background: "#fff", borderRadius: "0 0 18px 18px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: "1px solid #f0f0f5", borderTop: "none", textAlign: "left", overflow: "hidden"
            }}>
              {aiSuggestions.map(m => (
                <div 
                  key={m.movieId} 
                  className="ai-suggestion-item"
                  onClick={() => navigate(`/movies/${m.movieId}`)}
                  style={{ padding: "12px 20px", cursor: "pointer", borderBottom: "1px solid #f9f9f9" }}
                >
                  <Text strong style={{ color: "var(--momo-pink)" }}>✨ {m.title}</Text>
                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>({m.genre})</Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <Empty description="Rất tiếc, không tìm thấy phim bạn yêu cầu" />
      ) : (
        <Row gutter={[24, 32]}>
          {filteredMovies.map((movie) => {
            const showtimes = showtimeMap[movie.movieId] || [];
            const hasShowtime = showtimes.length > 0;
            return (
              <Col key={movie.movieId} xs={24} sm={12} md={8} lg={6}>
                <div className="movie-card-2026">
                  <div className="movie-poster-container">
                    <img
                      alt={movie.title}
                      className="movie-poster-img"
                      src={getSafePosterUrl(movie.posterUrl)}
                    />
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <Tag color="volcano" style={{ borderRadius: 8, fontWeight: 700, border: "none" }}>
                        <FireOutlined /> HOT
                      </Tag>
                    </div>
                  </div>
                  
                  <div style={{ padding: "0 20px 20px" }}>
                    <Title level={5} style={{ marginBottom: 8, height: 44, overflow: "hidden" }}>
                      {movie.title || movie.Title}
                    </Title>
                    
                    <div style={{ marginBottom: 16 }}>
                      <Tag color="magenta" style={{ borderRadius: 6 }}>{movie.genre || movie.Genre || "Action"}</Tag>
                      <Tag icon={<ClockCircleOutlined />} style={{ borderRadius: 6 }}>{movie.durationMin || movie.DurationMin}m</Tag>
                    </div>

                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 13, marginBottom: 20 }}>
                      {movie.description || movie.Description || "Tóm tắt phim đang được cập nhật..."}
                    </Paragraph>

                    <Button 
                      className="btn-momo" 
                      block 
                      onClick={() => navigate(`/movies/${movie.movieId}`)}
                    >
                      {hasShowtime ? "MUA VÉ NGAY" : "XEM CHI TIẾT"}
                    </Button>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
