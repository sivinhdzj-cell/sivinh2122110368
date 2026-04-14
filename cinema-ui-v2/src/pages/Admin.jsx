import React from "react";

function Admin() {
    const movies = [
        {
            id: 1,
            name: "Avengers: Endgame",
            duration: 181,
            description: "Siêu anh hùng tập hợp lần cuối",
        },
        {
            id: 2,
            name: "Lật Mặt 7",
            duration: 128,
            description: "Phim hài Việt Nam",
        },
        {
            id: 3,
            name: "Phim Sắp Ra Mắt",
            duration: 110,
            description: "",
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h1>CinemaMS</h1>
            <h2>Trang Quản Trị</h2>

            <h3>Danh Sách Phim Quản Lý</h3>

            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Phim</th>
                        <th>Thời Lượng (Phút)</th>
                        <th>Mô Tả</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.id}</td>
                            <td>{movie.name}</td>
                            <td>{movie.duration}</td>
                            <td>{movie.description || "Chưa có mô tả"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;