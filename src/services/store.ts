import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authSlice } from "./slices/AuthSlice";
import { availabilitySlice } from './slices/AvailabilitySlice';
import { bookingsSlice } from "./slices/BookingSlice";
import { accountSlice } from "./slices/AccountSlice";
import { residenceAdminSlice } from "./slices/ResidenceAdminSlice";
import { adminSlice } from "./slices/AdminSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        availability: availabilitySlice.reducer,
        booking: bookingsSlice.reducer,
        account: accountSlice.reducer,
        residenceAdmin: residenceAdminSlice.reducer,
        admin: adminSlice.reducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;  // helper type
export type AppDispatch = typeof store.dispatch;            // helper type

export const useAppDispatch = () => useDispatch<AppDispatch>();                 // overriding default useDispatch function
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;     // overriding default useAppSelector function
