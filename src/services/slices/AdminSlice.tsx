import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import ResidenceDto from "../../dtos/ResidenceDto";
import { AxiosResponse } from "axios";
import backendAPI from "../../apis/backendAPI";

interface AdminState {
    residences: ResidenceDto[] | null;
    fetchResMessage: string | null;
    formResMessage: string | null;
    isFormLoading: boolean;
    isDataLoading: boolean;
}

const initialState: AdminState = {
    residences: null,
    fetchResMessage: null,
    formResMessage: null,
    isFormLoading: false,
    isDataLoading: true,
}

export const createNewResidence = createAsyncThunk<any, ResidenceDto>(
    "admin/createNewResidence",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.createResidence(data);
            const resMessage: string = res.data.data!;
            thunkAPI.dispatch(setFormResMessage(resMessage));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const fetchResidences = createAsyncThunk<any>(
    "admin/fetchResidences",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getResidences();
            const residences: ResidenceDto[] = res.data.data!;
            thunkAPI.dispatch(setResidences(residences));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setFormResMessage: (state, action) => {
            state.formResMessage = action.payload as string;
        },
        setResidences: (state, action) => {
            state.residences = action.payload as ResidenceDto[];
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(isAnyOf(createNewResidence.fulfilled), (state, action) => {
            state.isFormLoading = false;
        });
        builder.addMatcher(isAnyOf(createNewResidence.rejected), (state, action) => {
            state.formResMessage = action.payload as string;
            state.isFormLoading = false;
        });
        builder.addMatcher(isAnyOf(createNewResidence.pending), (state, action) => {
            state.formResMessage = null;
            state.isFormLoading = true;
        });
    }
});

export const { setFormResMessage, setResidences} = adminSlice.actions;
