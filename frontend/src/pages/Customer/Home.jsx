import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Row, Typography, Spin, Empty, message } from "antd";
import { Link } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";
import { moviesAPI } from "../../api/movies";
import { getSafePosterUrl } from "../../utils/image";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await moviesAPI.getAll();
        setMovies(Array.isArray(data) ? data : []);
      } catch (error) {
        message.error(error?.response?.data?.message || "Không thể tải danh sách phim");
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const featuredMovie = useMemo(() => movies[0], [movies]);

  return (
    <div>
      <Card className="hero-card" variant="borderless">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={14}>
            <Typography.Text className="hero-kicker">CinemaMS Experience</Typography.Text>
            <Typography.Title className="hero-title">
              Trải nghiệm đặt vé điện ảnh chuyên nghiệp
            </Typography.Title>
            <Typography.Paragraph className="hero-desc">
              Theo dõi lịch chiếu theo thời gian thực, chọn ghế trực quan và đặt vé trong vài thao tác.
            </Typography.Paragraph>
            <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
              <Link to="/movies">Đặt vé ngay</Link>
            </Button>
          </Col>
          <Col xs={24} md={10}>
            <img
              src={getSafePosterUrl(featuredMovie?.posterUrl, "https://placehold.co/500x300?text=CinemaMS+Featured")}
              alt={featuredMovie?.title || "Featured Movie"}
              className="hero-image"
            />
          </Col>
        </Row>
      </Card>

      <Typography.Title level={3} style={{ marginTop: 24 }}>
        Phim đang chiếu
      </Typography.Title>

      {loading ? (
        <Spin />
      ) : movies.length === 0 ? (
        <Empty description="Chưa có phim để hiển thị" />
      ) : (
        <Row gutter={[16, 16]}>
          {movies.slice(0, 8).map((movie) => (
            <Col key={movie.movieId} xs={24} sm={12} md={8} lg={6}>
              <Card
                className="movie-card movie-card-hover"
                cover={
                  <img
                    alt={movie.title}
                    src={getSafePosterUrl(movie.posterUrl)}
                    style={{ height: 320, objectFit: "cover" }}
                  />
                }
                actions={[
                  <Link to={`/movies/${movie.movieId}`} key="book-now">
                    Đặt vé
                  </Link>,
                ]}
              >
                <Typography.Text strong>{movie.title}</Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
