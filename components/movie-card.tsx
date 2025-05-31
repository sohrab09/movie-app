"use client";

import type React from "react";
import { Star, Edit, Trash } from "lucide-react";
import type { Movie } from "@/lib/store";

interface MovieCardProps {
  movie: Movie;
  onDragStart: (e: React.DragEvent, movie: Movie) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

const MovieCard = ({
  movie,
  onDragStart,
  onEdit,
  onDelete,
}: MovieCardProps) => {
  const statusColors = {
    watchlist: "bg-gradient-to-br from-purple-500 to-pink-500",
    watching: "bg-gradient-to-br from-blue-500 to-cyan-500",
    watched: "bg-gradient-to-br from-green-500 to-emerald-500",
  };

  return (
    <div
      className={`${
        statusColors[movie.status]
      } p-4 rounded-xl shadow-lg cursor-move hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
      draggable
      onDragStart={(e) => onDragStart(e, movie)}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-sm truncate">
                  {movie.name}
                </h3>
                <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mt-1">
                  {movie.genre}
                </span>
              </div>
              <button
                onClick={() => onEdit(movie)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Edit className="h-3 w-3 text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(movie)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Trash className="h-3 w-3 text-gray-600" />
              </button>
            </div>

            {movie.rating > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < movie.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({movie.rating}/5)
                </span>
              </div>
            )}

            {movie.review && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {movie.review}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
