import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import backendAPI from "../../apis/backendAPI";
import ResponseMessage from "../../interfaces/responseMessage";
import TimeslotAvailabilityDto from "../../dtos/TimeslotAvailabilityDto";
import PurchaseRequestDto from "../../dtos/PurchaseRequestDto";


interface AvailabilitiesState {
    earliestAvailabilities: TimeslotAvailabilityDto[] | null;
    shownPopupAssetId: number;
    errorMsg: string | null;
    isLoading: boolean;
    popupResMsg: ResponseMessage | null,
    isPopupLoading: boolean,
}

const initialState: AvailabilitiesState = {
    earliestAvailabilities: null,
    shownPopupAssetId: 0,
    errorMsg: null,
    isLoading: true,
    popupResMsg: null,
    isPopupLoading: false,
}

export const fetchEarliestAvailabilities = createAsyncThunk<any>(
    "availability/getEarliestAvailabilities",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getLaundryAssetsEarliestAvailabilities();
            const earliestAvailabilities: TimeslotAvailabilityDto[] = res.data.data!;
            thunkAPI.dispatch(setEarliestAvailabilities(earliestAvailabilities));
        } catch (err: any) {
            const errorMsg = err.data.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const purchaseLaundryAssetService = createAsyncThunk<any, PurchaseRequestDto>(
    "availability/purchaseLaundryAssetService",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.purchaseLaundryService(data);
            // const purchase: ActivityDto = res.data.data!;
            const resMessage = {
                message: res.data.message!,
                isError: false
            } as ResponseMessage;
            thunkAPI.dispatch(setPopupResMessage(resMessage));
            thunkAPI.dispatch(fetchEarliestAvailabilities());
        } catch (err: any) {
            const errorMsg = err.data.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const availabilitySlice = createSlice({
    name: "availability",
    initialState,
    reducers: {
        setShownPopupAssetId: (state, action) => {
            state.shownPopupAssetId = action.payload as number;
        },
        setPopupResMessage: (state, action) => {
            state.popupResMsg = action.payload as ResponseMessage;
            state.isPopupLoading = false;
        },
        setEarliestAvailabilities: (state, action) => {
            state.earliestAvailabilities = action.payload as TimeslotAvailabilityDto[];
        },
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(fetchEarliestAvailabilities.fulfilled), (state, action) => {
            state.isLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchEarliestAvailabilities.rejected), (state, action) => {
            state.errorMsg = action.payload as string;
            state.isLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchEarliestAvailabilities.pending), (state, action) => {
            state.errorMsg = null;
            state.isLoading = true;
        });
        builder.addMatcher(isAnyOf(purchaseLaundryAssetService.fulfilled), (state, action) => {
            state.isPopupLoading = false;
        });
        builder.addMatcher(isAnyOf(purchaseLaundryAssetService.rejected), (state, action) => {
            state.popupResMsg = {
                message: action.payload,
                isError: true
             } as ResponseMessage;
            state.isPopupLoading = false;
        });
        builder.addMatcher(isAnyOf(purchaseLaundryAssetService.pending), (state, action) => {
            state.popupResMsg = null;
            state.isPopupLoading = true;
        });
    })
});

export const { setShownPopupAssetId, setEarliestAvailabilities, setPopupResMessage } = availabilitySlice.actions;
