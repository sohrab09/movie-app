"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Search, Plus, Loader2, Film } from "lucide-react";
import {
  store,
  type RootState,
  type Movie,
  setMovies,
  setLoading,
  addMovie,
  updateMovieStatus,
  updateMovieReview,
  setSearchQuery,
  loadFromStorage,
} from "@/lib/store";
import AddMovieModal from "@/components/add-modal";
import ReviewModal from "@/components/review-modal";
import MovieSection from "@/components/movie-section";

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, searchQuery, loading } = useSelector(
    (state: RootState) => state.app
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [draggedMovie, setDraggedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    dispatch(loadFromStorage());

    const loadMovies = async () => {
      const state = store.getState();
      if (!state.app.initialized) {
        dispatch(setLoading(true));
        try {
          const response = await fetch("/api/movies");
          const data = await response.json();
          dispatch(setMovies(data.movies));
        } catch (error) {
          console.error("Failed to load movies:", error);
          dispatch(setLoading(false));
        }
      }
    };

    loadMovies();
  }, [dispatch]);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const watchlistMovies = filteredMovies.filter(
    (m) => m.status === "watchlist"
  );
  const watchingMovies = filteredMovies.filter((m) => m.status === "watching");
  const watchedMovies = filteredMovies.filter((m) => m.status === "watched");

  const handleDragStart = (e: React.DragEvent, movie: Movie) => {
    setDraggedMovie(movie);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrag = (e: React.DragEvent, newStatus: Movie["status"]) => {
    e.preventDefault();
    if (draggedMovie && draggedMovie.status !== newStatus) {
      dispatch(updateMovieStatus({ id: draggedMovie.id, status: newStatus }));
    }
    setDraggedMovie(null);
  };

  const handleEditMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowReviewModal(true);
  };

  const handleDeleteMovie = (movie: Movie) => {
    const updatedMovies = movies.filter((m) => m.id !== movie.id);
    localStorage.removeItem(movie.id);
    dispatch(setMovies(updatedMovies));
    localStorage.setItem("movieApp", JSON.stringify(updatedMovies));
  };

  const handleSaveReview = (
    id: string,
    name: string,
    genre: string,
    rating: number,
    review: string
  ) => {
    dispatch(updateMovieReview({ id, name, genre, rating, review }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">
            Loading your movies...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="h-10 w-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Movie App</h1>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search movies, genres."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm rounded-xl border-0 focus:ring-4 focus:ring-white/30 focus:bg-white text-gray-800 placeholder-gray-500 text-lg"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Add Movie
          </button>
        </div>

        {/* Movie Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MovieSection
            title="📋 Watch List"
            movies={watchlistMovies}
            status="watchlist"
            color="bg-gradient-to-br from-purple-600 to-purple-800"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrag={handleDrag}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
          />

          <MovieSection
            title="👀 Watching"
            movies={watchingMovies}
            status="watching"
            color="bg-gradient-to-br from-blue-600 to-blue-800"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrag={handleDrag}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
          />

          <MovieSection
            title="✅ Watched"
            movies={watchedMovies}
            status="watched"
            color="bg-gradient-to-br from-green-600 to-green-800"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrag={handleDrag}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
          />
        </div>
      </div>

      {/* Modals */}
      <AddMovieModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(movie) => dispatch(addMovie(movie))}
      />

      <ReviewModal
        movie={selectedMovie}
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedMovie(null);
        }}
        onSave={handleSaveReview}
      />
    </div>
  );
};

export default Movies;
