import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./store/bookingSlice";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
  },
});
