import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Spin, Typography, Button, message, Space, Tag, Empty } from "antd";
import { moviesAPI } from "../../api/movies";
import { showtimesAPI } from "../../api/showtimes";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [movieData, showtimeData] = await Promise.all([
          moviesAPI.getById(id),
          showtimesAPI.getByMovieId(id),
        ]);
        setMovie(movieData);
        const movieShowtimes = Array.isArray(showtimeData) ? showtimeData : [];
        setShowtimes(movieShowtimes);
      } catch (error) {
        message.error(error?.response?.data?.message || "Không tải được chi tiết phim");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Spin fullscreen />;

  return (
    <Card>
      <Typography.Title>{movie?.title || "Chi tiết phim"}</Typography.Title>
      <Typography.Paragraph>{movie?.description || "Đang cập nhật nội dung phim."}</Typography.Paragraph>
      <Typography.Title level={5}>Suất chiếu khả dụng</Typography.Title>
      {showtimes.length === 0 ? (
        <>
          <Empty description="Phim này hiện chưa có suất chiếu" />
          <Button onClick={() => navigate("/movies")} style={{ marginTop: 12 }}>
            Chọn phim khác đang mở bán
          </Button>
        </>
      ) : (
        <Space wrap>
          {showtimes.map((s) => (
            <Button key={s.showtimeId} type="primary" onClick={() => navigate(`/seat-selection/${s.showtimeId}`)}>
              {new Date(s.startTime).toLocaleString("vi-VN")} - {s.roomName}
            </Button>
          ))}
        </Space>
      )}
      <div style={{ marginTop: 16 }}>
        <Tag color="blue">Thời lượng: {movie?.durationMin || 0} phút</Tag>
        <Tag color="purple">{movie?.genre || "Đa thể loại"}</Tag>
      </div>
      <Button style={{ marginTop: 16 }}>
        <Link to="/movies">Quay lại danh sách phim</Link>
      </Button>
    </Card>
  );
}
