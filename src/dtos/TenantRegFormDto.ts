export default interface TenantRegFormDto {
    name: string;
    surname: string;
    username: string;
    password: string;
    tenancyFrom: Date;
    tenancyTo: Date;
    email: string;
    countryDialCode: string;
    mobileNumber: string;
}
