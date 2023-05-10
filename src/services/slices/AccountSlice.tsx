import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import backendAPI from "../../apis/backendAPI";
import AccountInformationDto from "../../dtos/AccountInformationDto";
import UpdateUserInfoForm from "../../dtos/UpdateUserInfoForm";
import PaymentCardsDto from "../../dtos/PaymentCardsDto";
import UpdatePaymentCardForm from "../../dtos/UpdatePaymentCardForm";
import ActivityDto from "../../dtos/ActivityDto";
import ResidenceDto from "../../dtos/ResidenceDto";
import PaymentCardDto from "../../dtos/PaymentCardDto";
import ResponseMessage from "../../interfaces/responseMessage";

interface AccountSlice {
    isFetchLoading: boolean,
    isFormLoading: boolean;
    fetchResMsg: ResponseMessage | null;
    formResMsg: ResponseMessage | null;

    userInformation: UpdateUserInfoForm | null;
    residenceInformation: ResidenceDto | null;
    currentPaymentCard: PaymentCardDto | null;
    inactivePaymentCards: PaymentCardDto[] | null;
    activityHistory: ActivityDto[] | null;
}

const initialState: AccountSlice = {
    isFetchLoading: false,
    isFormLoading: false,
    fetchResMsg: null,
    formResMsg: null,

    userInformation: null,
    residenceInformation: null,
    currentPaymentCard: null,
    inactivePaymentCards: null,
    activityHistory: null
}

export const fetchAccountInformation = createAsyncThunk<any>(
    "account/fetchAccountInformation",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getAccountInformation();
            const accountInformation: AccountInformationDto  = res.data.data!;
            thunkAPI.dispatch(setAccountInformation(accountInformation));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const updateUserInfo = createAsyncThunk<any, UpdateUserInfoForm>(
    "account/updateUserInfo",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.updateUserInformation(data);
            const userInfo: UpdateUserInfoForm  = res.data.data!;
            const resMsg = {
                message: res.data.message! as string,
                isError: false
            } as ResponseMessage;
            thunkAPI.dispatch(setFormResMessage(resMsg));
            thunkAPI.dispatch(setUserInfoForm(userInfo));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const fetchPaymentCards = createAsyncThunk<any>(
    "account/fetchPaymentCards",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getPaymentCards();
            const paymentCards: PaymentCardsDto  = res.data.data!;
            thunkAPI.dispatch(setPaymentCards(paymentCards));   // const { currentCard, inactiveCards } = paymentCards;
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const updatePaymentCard = createAsyncThunk<any, UpdatePaymentCardForm>(
    "account/updatePaymentCard",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.updatePaymentCard(data);
            const paymentCards: PaymentCardsDto  = res.data.data!;
            const resMsg = {
                message: res.data.message! as string,
                isError: false
            } as ResponseMessage;
            thunkAPI.dispatch(setFormResMessage(resMsg));
            thunkAPI.dispatch(setPaymentCards(paymentCards));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const fetchActivityHistory = createAsyncThunk<any>(
    "account/fetchActivityHistory",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getActivityHistory();
            const activityHistory: ActivityDto[] = res.data.data!;
            thunkAPI.dispatch(setActivityHistory(activityHistory));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);


export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setFormResMessage: (state, action) => {
            state.formResMsg = action.payload as ResponseMessage;
        },
        setAccountInformation: (state, action) => {
            const { userInfo, residenceInfo } = action.payload as AccountInformationDto;
            state.userInformation = userInfo;
            state.residenceInformation = residenceInfo;
        },
        setUserInfoForm: (state, action) => {
            state.userInformation = action.payload as UpdateUserInfoForm;
        },
        setPaymentCards: (state, action) => {
            const { currentCard, inactiveCards } = action.payload as PaymentCardsDto;
            state.currentPaymentCard = currentCard;
            state.inactivePaymentCards = inactiveCards;
        },
        setActivityHistory: (state, action) => {
            state.activityHistory = action.payload as ActivityDto[];
        },
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(fetchAccountInformation.fulfilled, fetchPaymentCards.fulfilled, fetchActivityHistory.fulfilled), (state, action) => {
            state.fetchResMsg = null;
            state.isFetchLoading = false;
        });
        builder.addMatcher(isAnyOf(updateUserInfo.fulfilled,  updatePaymentCard.fulfilled), (state, action) => {
            state.isFormLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchAccountInformation.rejected, fetchPaymentCards.rejected, fetchActivityHistory.rejected), (state, action) => {
            state.fetchResMsg = {
                message: action.payload as string,
                isError: true
            } as ResponseMessage;
            state.isFetchLoading = false;
        });
        builder.addMatcher(isAnyOf(updateUserInfo.rejected,  updatePaymentCard.rejected), (state, action) => {
            state.formResMsg = {
                message: action.payload as string,
                isError: true
            } as ResponseMessage;
            state.isFormLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchAccountInformation.pending, fetchPaymentCards.pending, fetchActivityHistory.pending), (state, action) => {
                state.fetchResMsg = null;
                state.isFetchLoading = true;
        });
        builder.addMatcher(isAnyOf(updateUserInfo.pending,  updatePaymentCard.pending), (state, action) => {
            state.formResMsg = null;
            state.isFormLoading = true;
        });
    })
});

export const { setAccountInformation, setUserInfoForm, setFormResMessage, setPaymentCards, setActivityHistory } = accountSlice.actions;
