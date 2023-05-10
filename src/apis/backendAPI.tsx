import axios, { AxiosError } from "axios";

import TenantAuthForm from "../dtos/TenantAuthForm";
import BookingRequestDto from "../dtos/BookingRequestDto";
import UpdateUserInfoForm from "../dtos/UpdateUserInfoForm";
import UpdatePaymentCardForm from "../dtos/UpdatePaymentCardForm";
import ResidenceDto from "../dtos/ResidenceDto";
import LaundryAssetRegFormDto from "../dtos/LaundryAssetRegFormDto";
import TenantRegistrationFormDto from "../dtos/TenantRegFormDto";
import ResidenceAdminRegFormDto from "../dtos/ResidenceAdminRegFormDto";

// NOTE: attaching jwt to Authorization header if the token is present
axios.interceptors.request.use(request => {
    request.headers['Authorization'] = `Bearer ${localStorage.getItem("userJwt")}`;
    return request;
});

axios.interceptors.response.use(response => {
    return response;
}, (err: AxiosError) => {
    let res = err.response;
    let status: number = res?.status!;
    let data: any = res?.data;

    switch(status) {
        case 400:
            if (data.errors) {
                console.log(data.errors);
            }

            console.log("400 error intercepted by Axios!");
            break
        case 401:
            console.log(`An authroization error intercepted by Axios! -[${data.errors}]`);
            break
        case 404:
            if (data.errors) {
                console.log(data.errors);
            }

            console.log("404 error intercepted by Axios!");
            break;
        case 500:
            if (data.errors) {
                console.log(data.errors);
            }

            console.log("500 error intercepted by Axios!");
            break;
        default:
            console.log(`${status} error intercepted by Axios!`);
            break;
    }

    return Promise.reject(res);
});

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}),
    post: (url: string, body: {}) => axios.post(url, body),
}

// const BE_API_URL = process.env.BE_API_URL || 'http://localhost:8080';
const BE_API_URL = 'https://be-coliv-demo.herokuapp.com';
const backendAPI = {
    login: (values: TenantAuthForm) => requests.post(`${BE_API_URL}/auth/login`, values),
    logout: () => requests.get(`${BE_API_URL}/auth/logout`),
    // signup: (values: User) => requests.post(`${BE_API_URL}/auth/signup`, values),

    getLaundryAssetsEarliestAvailabilities: () => requests.get(`${BE_API_URL}/availability`),
    purchaseLaundryService: (values: BookingRequestDto) => requests.post(`${BE_API_URL}/availability/purchase`, values),

    getAccessibleLaundryAssets: () => requests.get(`${BE_API_URL}/booking/laundry-assets`),
    getLaundryAssetDailyBookings: (values: BookingRequestDto) => requests.post(`${BE_API_URL}/booking/daily-bookings`, values),
    getMyFutureBookings: () => requests.get(`${BE_API_URL}/booking/my-bookings`),
    getMyActiveBookings: () => requests.get(`${BE_API_URL}/booking/my-active-bookings`),
    bookLaundryAsset: (values: BookingRequestDto) => requests.post(`${BE_API_URL}/booking`, values),

    getAccountInformation: () => requests.get(`${BE_API_URL}/account/account-information`),
    updateUserInformation: (values: UpdateUserInfoForm) => requests.post(`${BE_API_URL}/account/user-information`, values),
    getPaymentCards: () => requests.get(`${BE_API_URL}/account/payment-cards`),
    updatePaymentCard: (values: UpdatePaymentCardForm) => requests.post(`${BE_API_URL}/account/payment-card`, values),
    getActivityHistory: () => requests.get(`${BE_API_URL}/account/activity-history`),

    createResidenceTenant: (values: TenantRegistrationFormDto) => requests.post(`${BE_API_URL}/residence-admin/tenant`, values),
    getResidenceTenants: () => requests.get(`${BE_API_URL}/residence-admin/tenants`),
    updateResidenceTenant: (values: TenantRegistrationFormDto) => requests.post(`${BE_API_URL}/residence-admin/update-tenant`, values),
    createResidenceAdmin: (values: ResidenceAdminRegFormDto) => requests.post(`${BE_API_URL}/residence-admin`, values),
    getResidenceAdmins: () => requests.get(`${BE_API_URL}/residence-admin`),
    updateResidenceAdmin: (values: ResidenceAdminRegFormDto) => requests.post(`${BE_API_URL}/residence-admin/update-residence-admin`, values),
    createLaundryAsset: (values: LaundryAssetRegFormDto) => requests.post(`${BE_API_URL}/residence-admin/create-asset`, values),
    getLaundryAssets: () => requests.get(`${BE_API_URL}/residence-admin/laundry-assets`),
    updateLaundryAsset: (values: LaundryAssetRegFormDto) => requests.post(`${BE_API_URL}/residence-admin/update-asset`, values),

    createResidence: (values: ResidenceDto) => requests.post(`${BE_API_URL}/admin/residence`, values),
    getResidences: () => requests.get(`${BE_API_URL}/admin/residences`),
}

export default backendAPI;
