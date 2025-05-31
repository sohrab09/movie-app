import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface Movie {
  id: string;
  name: string;
  genre: string;
  status: "watchlist" | "watching" | "watched";
  rating: number;
  review: string;
}

interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  hasInitiallyLoaded: boolean;
}

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
  searchQuery: "",
  hasInitiallyLoaded: false,
};

// Async thunk for fetching movies
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (_, { getState }) => {
    const state = getState() as RootState;

    // Only fetch if not already loaded
    if (state.movies.hasInitiallyLoaded) {
      return state.movies.movies;
    }

    const response = await fetch("/api/movies");
    const data = await response.json();
    return data.data;
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Omit<Movie, "id">>) => {
      const newMovie: Movie = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.movies.push(newMovie);
    },
    updateMovieStatus: (
      state,
      action: PayloadAction<{ id: string; status: Movie["status"] }>
    ) => {
      const movie = state.movies.find((m) => m.id === action.payload.id);
      if (movie) {
        movie.status = action.payload.status;
      }
    },
    updateMovieReview: (
      state,
      action: PayloadAction<{ id: string; rating: number; review: string }>
    ) => {
      const movie = state.movies.find((m) => m.id === action.payload.id);
      if (movie) {
        movie.rating = action.payload.rating;
        movie.review = action.payload.review;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    rehydrate: (state, action) => {
      if (action.payload?.movies) {
        return { ...state, ...action.payload.movies };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
        state.hasInitiallyLoaded = true;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch movies";
      })
      .addMatcher(
        (action) => action.type === "REHYDRATE",
        (state, action: any) => {
          if (action.payload?.movies) {
            return { ...state, ...action.payload.movies };
          }
        }
      );
  },
});

// Selectors
export const selectAllMovies = (state: RootState) => state.movies.movies;
export const selectMoviesLoading = (state: RootState) => state.movies.loading;
export const selectMoviesError = (state: RootState) => state.movies.error;
export const selectSearchQuery = (state: RootState) => state.movies.searchQuery;

export const selectFilteredMovies = (state: RootState) => {
  const movies = selectAllMovies(state);
  const searchQuery = selectSearchQuery(state).toLowerCase();

  if (!searchQuery) return movies;

  return movies.filter(
    (movie: Movie) =>
      movie.name.toLowerCase().includes(searchQuery) ||
      movie.genre.toLowerCase().includes(searchQuery)
  );
};

export const selectMoviesByStatus =
  (status: Movie["status"]) => (state: RootState) => {
    const filteredMovies = selectFilteredMovies(state);
    return filteredMovies.filter((movie) => movie.status === status);
  };

export const {
  addMovie,
  updateMovieStatus,
  updateMovieReview,
  setSearchQuery,
} = moviesSlice.actions;
export default moviesSlice.reducer;
