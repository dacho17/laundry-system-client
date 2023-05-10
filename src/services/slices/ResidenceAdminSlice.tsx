import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import backendAPI from "../../apis/backendAPI";
import ResidenceAdminAuthForm from "../../dtos/ResidenceAdminRegFormDto";
import LaundryAssetRegForm from "../../dtos/LaundryAssetRegFormDto";
import LaundryAssetDto from "../../dtos/LaundryAssetDto";
import Tenant from "../../dtos/Tenant";
import ResidenceAdmin from "../../dtos/ResidenceAdmin";

import ResponseMessage from "../../interfaces/responseMessage";
import TenantRegistrationForm from "../../dtos/TenantRegFormDto";
import CONSTANTS from "../../assets/constants";

interface ResidenceAdminState {
    activeSection: number;
    updatedTenant: Tenant | null;
    updatedResidenceAdmin: ResidenceAdmin | null;
    updatedLaundryAsset: LaundryAssetDto | null;
    residenceTenants: Tenant[] | null;
    residenceAdmins: ResidenceAdmin[] | null;
    residenceLaundryAssets: LaundryAssetDto[] | null;
    fetchResMessage: ResponseMessage | null;
    formResMessage: ResponseMessage | null;
    isFormLoading: boolean;
    isDataLoading: boolean;
}

const initialState: ResidenceAdminState = {
    activeSection: CONSTANTS.registerResidenceAdminSectionIndex,
    updatedTenant: null,
    updatedResidenceAdmin: null,
    updatedLaundryAsset: null,
    residenceTenants: null,
    residenceAdmins: null,
    residenceLaundryAssets: null,
    fetchResMessage: null,
    formResMessage: null,
    isFormLoading: false,
    isDataLoading: true,
}

export const createNewTenant = createAsyncThunk<any, TenantRegistrationForm>(
    "resAdmin/createNewTenant",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.createResidenceTenant(data);
            const resMessage: string = res.data.message!;   // tenant is also received in res.data.data
            thunkAPI.dispatch(setFormResMessage(resMessage));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const updateTenant = createAsyncThunk<any, TenantRegistrationForm>(
    "resAdmin/updateTenant",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.updateResidenceTenant(data);
            const resMessage: string = res.data.message!;
            // const updatedTenant: Tenant = res.data.data!;
            // find the tenant with the same username, and update it
            thunkAPI.dispatch(setFormResMessage(resMessage));
            thunkAPI.dispatch(fetchResidenceTenants());
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const fetchResidenceTenants = createAsyncThunk<any>(
    "resAdmin/fetchResidenceTenants",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getResidenceTenants();
            const tenants: Tenant[] = res.data.data!;
            thunkAPI.dispatch(setResidenceTenants(tenants));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const createNewResidenceAdmin = createAsyncThunk<any, ResidenceAdminAuthForm>(
    "resAdmin/createNewResidenceAdmin",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.createResidenceAdmin(data);
            const resMessage: string = res.data.message!;
            thunkAPI.dispatch(setFormResMessage(resMessage));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const updateResidenceAdmin = createAsyncThunk<any, ResidenceAdminAuthForm>(
    "resAdmin/updateResidenceAdmin",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.updateResidenceAdmin(data);
            const resMessage: string = res.data.message!;
            thunkAPI.dispatch(setFormResMessage(resMessage));
            thunkAPI.dispatch(fetchResidenceAdmins());
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const fetchResidenceAdmins = createAsyncThunk<any>(
    "resAdmin/fetchResidenceAdmins",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getResidenceAdmins();
            const residenceAdmins: ResidenceAdmin[] = res.data.data!;
            thunkAPI.dispatch(setResidenceAdmins(residenceAdmins));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const createNewLaundryAsset = createAsyncThunk<any, LaundryAssetRegForm>(
    "resAdmin/createNewLaundryAsset",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.createLaundryAsset(data);
            const resMessage: string = res.data.message!;
            thunkAPI.dispatch(setFormResMessage(resMessage));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const updateLaundryAsset = createAsyncThunk<any, LaundryAssetRegForm>(
    "resAdmin/updateLaundryAsset",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.updateLaundryAsset(data);
            const resMessage: string = res.data.message!;
            thunkAPI.dispatch(setFormResMessage(resMessage));
            thunkAPI.dispatch(fetchLaundryAssets());
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const fetchLaundryAssets = createAsyncThunk<any>(
    "resAdmin/fetchLaundryAssets",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getLaundryAssets();
            const residenceLaundryAssets: LaundryAssetDto[] = res.data.data!;
            thunkAPI.dispatch(setResidenceLaundryAssets(residenceLaundryAssets));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const residenceAdminSlice = createSlice({
    name: "resAdmin",
    initialState,
    reducers: {
        resetResMessages: (state, action) => {
            state.formResMessage = null;
            state.fetchResMessage = null;
            // state.updatedTenant = null;
            // state.updatedResidenceAdmin = null;
            // state.updatedLaundryAsset = null;

            state.activeSection = action.payload as number;
        },
        setUpdatedTenant: (state, action) => {
            state.updatedTenant = action.payload as Tenant | null;
        },
        setUpadatedLaundryAsset: (state, action) => {
            state.updatedLaundryAsset = action.payload as LaundryAssetDto | null;
        },
        setUpdatedResidenceAdmin: (state, action) => {
            state.updatedResidenceAdmin = action.payload as ResidenceAdmin | null;
        },
        setFormResMessage: (state, action) => {
            state.formResMessage = {
                message: action.payload as string,
                isError: false
            } as ResponseMessage;
        },
        setResidenceTenants: (state, action) => {
            state.residenceTenants = action.payload as Tenant[];
        },
        setResidenceAdmins: (state, action) => {
            state.residenceAdmins = action.payload as ResidenceAdmin[];
        },
        setResidenceLaundryAssets: (state, action) => {
            state.residenceLaundryAssets = action.payload as LaundryAssetDto[];
        },
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(createNewLaundryAsset.fulfilled, updateLaundryAsset.fulfilled,
            createNewResidenceAdmin.fulfilled, updateResidenceAdmin.fulfilled,
            createNewTenant.fulfilled, updateTenant.fulfilled), (state, action) => {
                state.isFormLoading = false;
        });
        builder.addMatcher(isAnyOf(createNewLaundryAsset.rejected, updateLaundryAsset.rejected,
            createNewResidenceAdmin.rejected, updateResidenceAdmin.rejected,
            createNewTenant.rejected, updateTenant.rejected), (state, action) => {
                state.formResMessage = {
                    message: action.payload as string,
                    isError: true
                } as ResponseMessage;
                state.isFormLoading = false;
        });
        builder.addMatcher(isAnyOf(createNewLaundryAsset.pending, updateLaundryAsset.pending,
            createNewResidenceAdmin.pending, updateResidenceAdmin.pending,
            createNewTenant.pending, updateTenant.pending), (state, action) => {
                state.formResMessage = null;
                state.isFormLoading = true;
        });
        builder.addMatcher(isAnyOf(fetchLaundryAssets.fulfilled, fetchResidenceAdmins.fulfilled,
            fetchResidenceTenants.fulfilled), (state, action) => {
                state.isDataLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchLaundryAssets.rejected, fetchResidenceAdmins.rejected,
            fetchResidenceTenants.rejected), (state, action) => {
                state.fetchResMessage = {
                    message: action.payload as string,
                    isError: true
                } as ResponseMessage;
                state.isDataLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchLaundryAssets.pending, fetchResidenceAdmins.pending,
            fetchResidenceTenants.pending), (state, action) => {
                state.fetchResMessage = null;
                state.isDataLoading = true;
        });
    })
});

export const { resetResMessages, setUpdatedTenant, setUpdatedResidenceAdmin, setUpadatedLaundryAsset,
    setFormResMessage, setResidenceTenants, setResidenceAdmins, setResidenceLaundryAssets } = residenceAdminSlice.actions;
