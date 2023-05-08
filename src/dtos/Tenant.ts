export default interface Tenant {
    name: string;
    surname: string;
    username: string;
    tenancyFrom: Date;
    tenancyTo: Date;
    tenancyActive: boolean;
    email: string;
    mobileNumber: string;
}
