"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/lib/hooks";
import { addMovie, Movie } from "@/lib/features/movies/moviesSlice";

interface AddMovieModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddMovieModal({ open, onClose }: AddMovieModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    status: "watchlist" as Movie["status"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.genre) {
      return;
    }

    dispatch(
      addMovie({
        name: formData.name,
        genre: formData.genre,
        status: formData.status,
        rating: 0,
        review: "",
      })
    );

    setFormData({
      name: "",
      genre: "",
      status: "watchlist",
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Add New Movie</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter movie name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => handleInputChange("genre", e.target.value)}
              placeholder="Enter genre"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Movie["status"]) =>
                handleInputChange("status", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="watchlist">Watch List</SelectItem>
                <SelectItem value="watching">Watching</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Movie</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
