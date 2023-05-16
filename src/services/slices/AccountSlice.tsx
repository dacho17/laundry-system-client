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
import LoyaltyOfferDto from "../../dtos/LoyaltyOfferDto";
import PurchaseLoyaltyOfferDto from "../../dtos/PurchaseLoyaltyOfferDto";
import ActivityHistoryEntryDto from "../../dtos/ActivityHistoryEntryDto";

interface AccountSlice {
    isFetchLoading: boolean,
    isFormLoading: boolean;
    isPopupLoading: boolean;
    fetchResMsg: ResponseMessage | null;
    formResMsg: ResponseMessage | null;
    popupResMsg: ResponseMessage | null;

    userInformation: UpdateUserInfoForm | null;
    residenceInformation: ResidenceDto | null;
    currentPaymentCard: PaymentCardDto | null;
    inactivePaymentCards: PaymentCardDto[] | null;
    activityHistory: ActivityHistoryEntryDto[] | null;
    loyaltyOffers: LoyaltyOfferDto[] | null;
}

const initialState: AccountSlice = {
    isFetchLoading: false,
    isFormLoading: false,
    isPopupLoading: false,
    fetchResMsg: null,
    formResMsg: null,
    popupResMsg: null,

    userInformation: null,
    residenceInformation: null,
    currentPaymentCard: null,
    inactivePaymentCards: null,
    activityHistory: null,
    loyaltyOffers: null
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
            const activityHistory: ActivityHistoryEntryDto[] = res.data.data!;
            thunkAPI.dispatch(setActivityHistory(activityHistory));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const fetchLoyaltyOffers = createAsyncThunk<any>(
    "account/fetchLoyaltyOffers",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.getLoyaltyOffers();
            const loyaltyOffers: LoyaltyOfferDto[] = res.data.data!;
            thunkAPI.dispatch(setLoyaltyOffers(loyaltyOffers));
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const purchaseLoyaltyOffer = createAsyncThunk<any, PurchaseLoyaltyOfferDto>(
    "account/purchaseLoyaltyOffer",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.purchaseLoyaltyOffer(data);
            const resMessage: ResponseMessage = {
                message: res.data.message! as string,
                isError: false
            } as ResponseMessage;
            thunkAPI.dispatch(setPopupResMessage(resMessage));
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
        setPopupResMessage: (state, action) => {
            state.popupResMsg = action.payload as ResponseMessage;
        },
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
            state.activityHistory = action.payload as ActivityHistoryEntryDto[];
        },
        setLoyaltyOffers: (state, action) => {
            state.loyaltyOffers = action.payload as LoyaltyOfferDto[];
        }
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(fetchAccountInformation.fulfilled, fetchPaymentCards.fulfilled, fetchActivityHistory.fulfilled, fetchLoyaltyOffers.fulfilled), (state, action) => {
            state.fetchResMsg = null;
            state.isFetchLoading = false;
        });
        builder.addMatcher(isAnyOf(purchaseLoyaltyOffer.fulfilled), (state, action) => {
            state.isPopupLoading = false;
        });
        builder.addMatcher(isAnyOf(updateUserInfo.fulfilled,  updatePaymentCard.fulfilled), (state, action) => {
            state.isFormLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchAccountInformation.rejected, fetchPaymentCards.rejected, fetchActivityHistory.rejected, fetchLoyaltyOffers.rejected), (state, action) => {
            state.fetchResMsg = {
                message: action.payload as string,
                isError: true
            } as ResponseMessage;
            state.isFetchLoading = false;
        });
        builder.addMatcher(isAnyOf(purchaseLoyaltyOffer.rejected), (state, action) => {
            state.popupResMsg = {
                message: action.payload as string,
                isError: true
            } as ResponseMessage;
        });
        builder.addMatcher(isAnyOf(updateUserInfo.rejected,  updatePaymentCard.rejected), (state, action) => {
            state.formResMsg = {
                message: action.payload as string,
                isError: true
            } as ResponseMessage;
            state.isFormLoading = false;
        });
        builder.addMatcher(isAnyOf(fetchAccountInformation.pending, fetchPaymentCards.pending, fetchActivityHistory.pending, fetchLoyaltyOffers.pending), (state, action) => {
                state.fetchResMsg = null;
                state.isFetchLoading = true;
        });
        builder.addMatcher(isAnyOf(updateUserInfo.pending,  updatePaymentCard.pending), (state, action) => {
            state.formResMsg = null;
            state.isFormLoading = true;
        });
        builder.addMatcher(isAnyOf(purchaseLoyaltyOffer.pending), (state, action) => {
            state.popupResMsg = null;
            state.isPopupLoading = false;
        });
    })
});

export const { setPopupResMessage, setAccountInformation, setUserInfoForm, setFormResMessage,
    setPaymentCards, setActivityHistory, setLoyaltyOffers } = accountSlice.actions;
