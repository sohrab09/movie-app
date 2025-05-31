"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import type { Movie } from "@/lib/store";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (movie: Omit<Movie, "id">) => void;
}

const AddMovieModal = ({ isOpen, onClose, onAdd }: AddMovieModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    status: "watchlist" as Movie["status"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onAdd({
      name: formData.name,
      genre: formData.genre,
      status: formData.status,
      rating: 0,
      review: "",
    });

    setFormData({ name: "", genre: "", status: "watchlist" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Movie</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Movie name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />

          <input
            type="text"
            placeholder="Genre"
            value={formData.genre}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, genre: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as Movie["status"],
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="watchlist">Watch List</option>
            <option value="watching">Watching</option>
            <option value="watched">Watched</option>
          </select>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Add Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;
