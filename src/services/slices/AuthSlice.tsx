import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import backendAPI from "../../apis/backendAPI";
import User from "../../dtos/User";
import TenantAuthForm from "../../dtos/TenantAuthForm";
import CONSTANTS from "../../assets/constants";
import { getUserRole } from "../../enums/UserRole";
import ForgotPasswordFormDto from "../../dtos/ForgotPasswordFormDto";
import ResetPasswordFormDto from "../../dtos/ResetPasswordFormDto";



interface AuthState {
    user: User | null;
    authErrorMsg: string | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    authErrorMsg: null,
    isLoading: false,
}

export const logIn = createAsyncThunk<any, TenantAuthForm>(
    "auth/logIn",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.login(data);
            const user: User = res.data.data!;
            thunkAPI.dispatch(loginUser(user));
            // thunkAPI.dispatch(refreshUserLogin());
        } catch (err: any) {
            thunkAPI.dispatch(logoutUser());

            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

// Not used at the moment:
// export const signUp = createAsyncThunk<User | null, User>(
//     "auth/signUp",
//     async (data, thunkAPI) => {
//         try {
//             const res: AppResponse<User | null> = await agent.signup(data);
//             if (res.body.data) {
//                 thunkAPI.dispatch(loginUser(res.body.data));
//                 return res.body.data!;
//             }
//             throw new Error(res.body.error);
//         } catch (err: any) {
//             if (err.status === 401) {
//                 thunkAPI.dispatch(signoutUser());
//             }
//             const authErrorMsg = err.data.error;

//             return thunkAPI.rejectWithValue(authErrorMsg);
//         }
//     }
// );

export const logOut = createAsyncThunk<any> (
    "auth/logOut",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.logout();
            // const user: User = res.data.data!;
            thunkAPI.dispatch(logoutUser());
        } catch (err: any) {
            thunkAPI.dispatch(logoutUser());

            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const requestForgotPassword = createAsyncThunk<any, ForgotPasswordFormDto> (
    "auth/requestForgotPassword",
    async (data, thunkAPI) => {
        try {
            const res: AxiosResponse = await backendAPI.forgotPasswordRequest(data);
            const resMessage: String = res.data.message!;
            return thunkAPI.fulfillWithValue(resMessage);
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const requestResetPassword = createAsyncThunk<any, ResetPasswordFormDto> (
    "auth/requestResetPassword",
    async (data, thunkAPI) => {
        try {
            const config = {params: {
                passwordResetToken: data.passwordResetToken // sending a query parameter next to the POST request body
            }};
            const res: AxiosResponse = await backendAPI.passwordResetRequest(data, config);
            const resMessage: String = res.data.message!;
            return thunkAPI.fulfillWithValue(resMessage);
        } catch (err: any) {
            const authErrorMsg = err.data.message;
            return thunkAPI.rejectWithValue(authErrorMsg);
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const { username, role, jwt, loyaltyPoints } = action.payload as User;
            const cleanedRole = role.valueOf().toString().replace(CONSTANTS.beApiRolePrefix, '');
            const formattedRole = getUserRole(cleanedRole);
            localStorage.setItem(CONSTANTS.usernameLabelLocalStorage, username);
            localStorage.setItem(CONSTANTS.userRoleLabelLocalStorage, formattedRole.toString());
            localStorage.setItem(CONSTANTS.userLoyaltyPointsStorage, loyaltyPoints.toString());
            localStorage.setItem(CONSTANTS.userJwtLabelLocalStorage, jwt);

            state.user = {
                username: username,
                role: getUserRole(formattedRole.toString()),
                loyaltyPoints: loyaltyPoints,
                jwt: jwt,
            } as User;
        },
        logoutUser: (state) => {
            localStorage.removeItem(CONSTANTS.usernameLabelLocalStorage);
            localStorage.removeItem(CONSTANTS.userRoleLabelLocalStorage);
            localStorage.removeItem(CONSTANTS.userLoyaltyPointsStorage);
            localStorage.removeItem(CONSTANTS.userJwtLabelLocalStorage);
        },
        setAuthErrorMsg: (state, action) => {
            state.authErrorMsg = action.payload as string;
        },
        refreshUserLogin: (state) => {
            state.isLoading = true;
            const username = localStorage.getItem(CONSTANTS.usernameLabelLocalStorage);
            const userRole = localStorage.getItem(CONSTANTS.userRoleLabelLocalStorage);
            const loyaltyPoints = localStorage.getItem(CONSTANTS.userLoyaltyPointsStorage);
            const userJwt = localStorage.getItem(CONSTANTS.userJwtLabelLocalStorage);

            if (username && userRole && userJwt) {
                state.user = {
                    username: username,
                    role: getUserRole(userRole),
                    loyaltyPoints: loyaltyPoints ? parseInt(loyaltyPoints) : 0,
                    jwt: userJwt,
                } as User;
            }
            state.isLoading = false;
        },
        setLoyaltyPoints: (state, action) => {
            const newPointBalance = action.payload as number;
            localStorage.setItem(CONSTANTS.userLoyaltyPointsStorage, newPointBalance.toString());

            state.user = {
                username: localStorage.getItem(CONSTANTS.usernameLabelLocalStorage),
                role: getUserRole(localStorage.getItem(CONSTANTS.userRoleLabelLocalStorage)!),
                loyaltyPoints: newPointBalance,
                jwt: localStorage.getItem(CONSTANTS.userJwtLabelLocalStorage),
            } as User;
        }
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(logIn.fulfilled), (state, action) => {
            state.user = {...action.payload};
            state.isLoading = false;
        });
        builder.addMatcher(isAnyOf(logOut.fulfilled), (state, action) => {
            state.user = null;
            state.isLoading = false;
        });
        builder.addMatcher(isAnyOf(logIn.rejected, logOut.rejected), (state, action) => {
            state.user = null;
            state.authErrorMsg = action.payload as string;
            state.isLoading = false;
        });
        builder.addMatcher(isAnyOf(logIn.pending, logOut.pending), (state, action) => {
            state.isLoading = true;
            state.authErrorMsg = null;
        });
    })
});

export const { setLoyaltyPoints, loginUser, logoutUser, refreshUserLogin, setAuthErrorMsg } = authSlice.actions;
