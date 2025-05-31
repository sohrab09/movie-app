"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setSearchQuery,
  selectSearchQuery,
} from "@/lib/features/movies/moviesSlice";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search movies by title, director, or genre..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;
