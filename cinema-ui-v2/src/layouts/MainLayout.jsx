import Home from "./pages/Home";

export default function App() {
    return (
        <div className="min-h-screen bg-[#0f111a] text-white">

            {/* HEADER */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h1 className="text-red-500 text-2xl font-bold">
                    🎬 CinemaMS
                </h1>

                <nav className="flex gap-6 text-sm text-gray-300">
                    <a className="hover:text-white" href="#">Trang chủ</a>
                    <a className="hover:text-white" href="#">Quản trị</a>
                </nav>
            </header>

            {/* CONTENT */}
            <main className="p-6">
                <h2 className="text-yellow-400 text-xl font-bold mb-6">
                    🎬 Phim Đang Chiếu
                </h2>

                <Home />
            </main>

            {/* FOOTER */}
            <footer className="text-center text-gray-500 py-6 border-t border-white/10">
                © 2026 CinemaMS
            </footer>

        </div>
    );
}