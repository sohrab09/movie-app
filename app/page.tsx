"use client";

import { store } from "@/lib/store";
import { Provider } from "react-redux";
import Movies from "./movies";

const HomePage = () => {
  return (
    <Provider store={store}>
      <Movies />
    </Provider>
  );
};

export default HomePage;
