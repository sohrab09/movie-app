"use client";

import type React from "react";

import type { Movie } from "@/lib/store";
import MovieCard from "./movie-card";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  status: Movie["status"];
  color: string;
  onDragStart: (e: React.DragEvent, movie: Movie) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrag: (e: React.DragEvent, status: Movie["status"]) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

const MovieSection = ({
  title,
  movies,
  status,
  color,
  onDragStart,
  onDragOver,
  onDrag,
  onEdit,
  onDelete,
}: MovieSectionProps) => {
  return (
    <div className={`${color} p-6 rounded-2xl shadow-xl`}>
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
        <h2 className="text-xl font-bold text-white flex items-center justify-between">
          {title}
          <span className="text-sm font-normal bg-white/30 px-3 py-1 rounded-full">
            {movies.length}
          </span>
        </h2>
      </div>

      <div
        className="space-y-3 min-h-[400px]"
        onDragOver={onDragOver}
        onDrop={(e) => onDrag(e, status)}
      >
        {movies.length === 0 ? (
          <div className="text-center text-white/70 py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-lg">No movies here yet</p>
              <p className="text-sm mt-1">Drag movies here or add new ones!</p>
            </div>
          </div>
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDragStart={onDragStart}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MovieSection;
