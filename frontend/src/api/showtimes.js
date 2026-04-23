import client, { getWithFallback } from "./client";

export const showtimesAPI = {
  async getAll() {
    return (await getWithFallback("/showtime")) || [];
  },
  async getByMovieId(movieId) {
    const allShowtimes = (await getWithFallback("/showtime")) || [];
    return allShowtimes.filter((s) => Number(s.movieId) === Number(movieId));
  },
  async holdSeats(showtimeId, seatIds) {
    const response = await client.post("/showtime/lock-seats", { showtimeId, seatIds });
    return response.data?.data ?? response.data;
  },
  async cancelHold(showtimeId, seatIds) {
    const response = await client.post("/showtime/cancel-hold", { showtimeId, seatIds });
    return response.data?.data ?? response.data;
  },
};