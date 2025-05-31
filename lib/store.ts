import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface Movie {
  id: string;
  name: string;
  genre: string;
  status: "watchlist" | "watching" | "watched";
  rating: number;
  review: string;
}

interface AppState {
  movies: Movie[];
  searchQuery: string;
  loading: boolean;
  initialized: boolean;
}

const initialState: AppState = {
  movies: [],
  searchQuery: "",
  loading: false,
  initialized: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
      state.initialized = true;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addMovie: (state, action: PayloadAction<Omit<Movie, "id">>) => {
      const newMovie: Movie = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.movies.push(newMovie);
      saveToStorage(state);
    },
    updateMovieStatus: (
      state,
      action: PayloadAction<{ id: string; status: Movie["status"] }>
    ) => {
      const movie = state.movies.find((m) => m.id === action.payload.id);
      if (movie) {
        movie.status = action.payload.status;
        saveToStorage(state);
      }
    },
    updateMovieReview: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        genre: string;
        rating: number;
        review: string;
      }>
    ) => {
      const movie = state.movies.find((m) => m.id === action.payload.id);
      if (movie) {
        movie.name = action.payload.name;
        movie.genre = action.payload.genre;
        movie.rating = action.payload.rating;
        movie.review = action.payload.review;
        saveToStorage(state);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    loadFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("movieApp");
        if (saved) {
          const data = JSON.parse(saved);
          state.movies = data.movies || [];
          state.initialized = data.initialized || false;
        }
      }
    },
  },
});

const saveToStorage = (state: AppState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "movieApp",
      JSON.stringify({
        movies: state.movies,
        initialized: state.initialized,
      })
    );
  }
};

export const {
  setMovies,
  setLoading,
  addMovie,
  updateMovieStatus,
  updateMovieReview,
  setSearchQuery,
  loadFromStorage,
} = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
