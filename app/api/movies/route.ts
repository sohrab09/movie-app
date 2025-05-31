import { NextResponse } from "next/server";

const movies = [
  {
    id: "1",
    name: "The Shawshank Redemption",
    genre: "Drama",
    status: "watchlist",
    rating: 0,
    review: "",
  },
  {
    id: "2",
    name: "The Godfather",
    genre: "Crime",
    status: "watching",
    rating: 0,
    review: "",
  },
  {
    id: "3",
    name: "The Dark Knight",
    genre: "Action",
    status: "watched",
    rating: 5,
    review: "Amazing superhero movie!",
  },
  {
    id: "4",
    name: "Pulp Fiction",
    genre: "Crime",
    status: "watched",
    rating: 4,
    review: "Iconic Tarantino film.",
  },
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return NextResponse.json({ movies });
}
