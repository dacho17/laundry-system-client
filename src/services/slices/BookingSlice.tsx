import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import backendAPI from "../../apis/backendAPI";
import BookingRequestDto from "../../dtos/BookingRequestDto";
import ActivityDto from "../../dtos/ActivityDto";
import LaundryAssetDto from "../../dtos/LaundryAssetDto";
import ActiveBookingsDto from "../../dtos/ActiveBookingsDto";
import ResponseMessage from "../../interfaces/responseMessage";


interface LaundryAssetDailyBookingsState {
    laundryAssestDailyBookings: ActivityDto[] | null;
    accessibleLaundryAssets: LaundryAssetDto[] | null;
    myFutureBookings: ActivityDto[] | null; // reusing isTableLoading and tableErrorMsg properties for MyBookings tab
    myActiveBookings: ActiveBookingsDto | null; // reusing isTableLoading and tableErrorMsg properties for MyBookings tab
    dropdownErrorMsg: string | null;
    tableErrorMsg: string | null;
    isDropdownLoading: boolean;
    isTableLoading: boolean;

    popupMsg: ResponseMessage | null;
    isPopupLoading: boolean;
}

const initialState: LaundryAssetDailyBookingsState = {
    laundryAssestDailyBookings: null,
    accessibleLaundryAssets: null,
    myFutureBookings: null,
    myActiveBookings: null,

    dropdownErrorMsg: null,
    isDropdownLoading: true,

    tableErrorMsg: null,
    isTableLoading: true,

    popupMsg: null,
    isPopupLoading: false,
}

export const fetchAccessibleLaundryAssets = createAsyncThunk<any>(
    "bookings/fetchAccessibleLaundryAssets",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getAccessibleLaundryAssets();
            const accessibleLaundryAssets: LaundryAssetDto[] = res.data.data!;
            thunkAPI.dispatch(setAccessibleLaundryAssets(accessibleLaundryAssets));
        } catch (err: any) {
            const errorMsg = err.data.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const fetchLaundryAssetDailyBookings = createAsyncThunk<any, BookingRequestDto>(
    "bookings/fetchLaundryAssetDailyBookings",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getLaundryAssetDailyBookings(data);
            const laundryAssetDailyBookings: ActivityDto[] = res.data.data!;
            thunkAPI.dispatch(setLaundryAssetDailyBookings(laundryAssetDailyBookings));
        } catch (err: any) {
            const errorMsg = err.data.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const fetchMyFutureBookings = createAsyncThunk<any>(
    "bookings/fetchMyFutureBookings",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getMyFutureBookings();
            const myFutureBookings: ActivityDto[] = res.data.data!;
            thunkAPI.dispatch(setMyFutureBookings(myFutureBookings));
        } catch (err: any) {
            const errorMsg = err.data.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const fetchMyActiveBookings = createAsyncThunk<any>(
    "bookings/fetchMyActiveBookings",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getMyActiveBookings();
            const myActiveBookings: ActiveBookingsDto = res.data.data!;
            thunkAPI.dispatch(setMyActiveBookings(myActiveBookings));
        } catch (err: any) {
            const errorMsg = err.data.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const bookAsset = createAsyncThunk<any, BookingRequestDto>(
    "bookings/bookAsset",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.bookLaundryAsset(data);
            const createdBookings: ActivityDto[] = res.data.data!;
            const successMessage: string = res.data.message!;
            thunkAPI.dispatch(setPopupResMessage({
                message: successMessage,
                isError: false
            } as ResponseMessage));
            thunkAPI.dispatch(addDailyLaundryAssetBooking(createdBookings));
        } catch (err: any) {
            const errorMsg = err.data.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const bookingsSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        setAccessibleLaundryAssets: (state, action) => {
            state.accessibleLaundryAssets = action.payload as LaundryAssetDto[];
        },
        addDailyLaundryAssetBooking: (state, action) => {
            const createdBookings = action.payload as ActivityDto[];
            createdBookings.forEach(booking => {
                state.laundryAssestDailyBookings?.push(booking);                
            });
        },
        setLaundryAssetDailyBookings: (state, action) => {
            state.laundryAssestDailyBookings = action.payload as ActivityDto[];
        },
        setMyFutureBookings: (state, action) => {
            state.myFutureBookings = action.payload as ActivityDto[];
        },
        setMyActiveBookings: (state, action) => {
            state.myActiveBookings = action.payload as ActiveBookingsDto;
        },
        setPopupResMessage: (state, action) => {
            state.popupMsg = action.payload as ResponseMessage;
        }
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(fetchAccessibleLaundryAssets.fulfilled), (state, action) => {
            state.isDropdownLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchLaundryAssetDailyBookings.fulfilled, fetchMyFutureBookings.fulfilled,
            fetchMyActiveBookings.fulfilled), (state, action) => {
            state.isTableLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchAccessibleLaundryAssets.rejected), (state, action) => {
            state.dropdownErrorMsg = action.payload as string;
            state.isDropdownLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchLaundryAssetDailyBookings.rejected, fetchMyFutureBookings.rejected,
            fetchMyActiveBookings.rejected), (state, action) => {
            state.tableErrorMsg = action.payload as string;
            state.isTableLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchAccessibleLaundryAssets.pending,), (state, action) => {
            state.dropdownErrorMsg = null;
            state.isDropdownLoading = true;
        });
        builder.addMatcher(isAnyOf(fetchLaundryAssetDailyBookings.pending, fetchMyFutureBookings.pending,
            fetchMyActiveBookings.pending), (state, action) => {
            state.tableErrorMsg = null;
            state.isTableLoading = true;
        });
        builder.addMatcher(isAnyOf(bookAsset.fulfilled), (state, action) => {
            state.isPopupLoading = false;
        });
        builder.addMatcher(isAnyOf(bookAsset.rejected), (state, action) => {
            state.popupMsg = {
                message: action.payload as string,
                isError: true
            } as ResponseMessage;
            state.isPopupLoading = false;
        });
        builder.addMatcher(isAnyOf(bookAsset.pending), (state, action) => {
            state.popupMsg = null;
            state.isPopupLoading = true;
        });
    })
});

export const { setAccessibleLaundryAssets, addDailyLaundryAssetBooking, setLaundryAssetDailyBookings,
    setMyFutureBookings, setMyActiveBookings, setPopupResMessage } = bookingsSlice.actions;
