import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Col, Row, Spin, Tag, Typography, Button, Empty, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { moviesAPI } from "../../api/movies";
import { showtimesAPI } from "../../api/showtimes";
import { getSafePosterUrl } from "../../utils/image";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [showtimeMap, setShowtimeMap] = useState({});
  const [loading, setLoading] = useState(true);
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
        message.error(error?.response?.data?.message || "Không thể tải danh sách phim");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spin fullscreen />;
  if (movies.length === 0) return <Empty description="Chưa có phim nào" />;

  return (
    <>
      <Typography.Title level={2}>Phim đang chiếu</Typography.Title>
      <Row gutter={[20, 20]}>
        {movies.map((movie) => (
          <Col key={movie.movieId} xs={24} sm={12} md={8} lg={6}>
            {(() => {
              const showtimes = showtimeMap[movie.movieId] || [];
              const hasShowtime = showtimes.length > 0;
              return (
            <Card
              hoverable
              className="movie-card movie-card-hover"
              cover={
                <img
                  alt={movie.title}
                  className="movie-cover"
                  src={getSafePosterUrl(movie.posterUrl)}
                  style={{ height: 360, objectFit: "cover" }}
                />
              }
              actions={[
                <Button
                  type="primary"
                  disabled={!hasShowtime}
                  onClick={() =>
                    hasShowtime ? navigate(`/seat-selection/${showtimes[0].showtimeId}`) : navigate(`/movies/${movie.movieId}`)
                  }
                >
                  {hasShowtime ? "Đặt vé ngay" : "Chưa mở bán"}
                </Button>,
              ]}
            >
              <Typography.Title level={5} style={{ marginBottom: 8 }}>
                <Link to={`/movies/${movie.movieId}`}>{movie.title}</Link>
              </Typography.Title>
              <Tag color="purple">{movie.genre || "Đa thể loại"}</Tag>
              <Tag icon={<ClockCircleOutlined />} color="blue">
                {movie.durationMin || 0} phút
              </Tag>
              <Tag color={hasShowtime ? "green" : "default"}>
                {hasShowtime ? `${showtimes.length} suất chiếu` : "Chưa có suất"}
              </Tag>
              <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                {movie.description || "Bộ phim hấp dẫn đang chờ bạn tại CinemaMS."}
              </Typography.Paragraph>
            </Card>
              );
            })()}
          </Col>
        ))}
      </Row>
    </>
  );
}
