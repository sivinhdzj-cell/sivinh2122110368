const API_URL = "http://localhost:5269/api/Movie";

export async function getMovies() {
    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error("API error");
    }
    return res.json();
}

// Dữ liệu phim đang chiếu
export const NOW_SHOWING = [
    {
        movie_id: 1,
        title: "Avengers: Doomsday",
        genre: "Hành động",
        rating: "C13",
        duration_min: 148,
        poster_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
        backdrop_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1400&h=700&fit=crop",
        formats: ["2D", "3D", "IMAX"],
        score: 9.1,
        description: "Các siêu anh hùng Avengers tập hợp trước mối đe dọa lớn nhất từ trước đến nay.",
    },
    {
        movie_id: 2,
        title: "Lật Mặt 8",
        genre: "Hài, Gia đình",
        rating: "P",
        duration_min: 135,
        poster_url: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
        backdrop_url: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1400&h=700&fit=crop",
        formats: ["2D"],
        score: 8.4,
        description: "Thương hiệu điện ảnh đình đám nhất Việt Nam tiếp tục trở lại.",
    },
    {
        movie_id: 3,
        title: "Sinners",
        genre: "Kinh dị, Hành động",
        rating: "C18",
        duration_min: 137,
        poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
        backdrop_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&h=700&fit=crop",
        formats: ["2D", "IMAX"],
        score: 8.9,
        description: "Bộ phim kinh dị – hành động đầy bí ẩn khai thác chủ đề bóng tối.",
    },
    {
        movie_id: 4,
        title: "Minecraft: The Movie",
        genre: "Hoạt hình, Phiêu lưu",
        rating: "P",
        duration_min: 101,
        poster_url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=600&fit=crop",
        backdrop_url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1400&h=700&fit=crop",
        formats: ["2D", "3D"],
        score: 7.6,
        description: "Thế giới Minecraft lần đầu tiên lên màn ảnh rộng.",
    },
    {
        movie_id: 5,
        title: "Mission: Impossible 8",
        genre: "Hành động, Gián điệp",
        rating: "C13",
        duration_min: 169,
        poster_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
        backdrop_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1400&h=700&fit=crop",
        formats: ["2D", "IMAX", "4DX"],
        score: 9.3,
        description: "Ethan Hunt trở lại với nhiệm vụ nguy hiểm nhất trong sự nghiệp.",
    }
];

// Dữ liệu phim sắp tới
export const COMING_SOON = [
    {
        movie_id: 7,
        title: "Superman (2025)",
        genre: "Siêu anh hùng",
        rating: "C13",
        duration_min: 132,
        poster_url: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
        release_date: "2025-07-11",
    }
];

// Banner slider lấy từ danh sách trên
export const HERO_SLIDES = [NOW_SHOWING[4], NOW_SHOWING[0], NOW_SHOWING[2]];