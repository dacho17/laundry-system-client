import { addDays } from 'date-fns';
import CONSTANTS from "../../assets/constants";

export function getTenantHeaderLinks(): string[][] {
    const headerLinkLabels = CONSTANTS.headerTenantLinkLabels;
    const headerLinks = [CONSTANTS.availabilityRoute, CONSTANTS.bookingRoute, CONSTANTS.accountRoute];

    let res = [];
    for (let i = 0; i < headerLinks.length; i++) {
        res.push([headerLinkLabels[i], headerLinks[i]]);
    }

    return res;
}

export function getResidenceAdminHeaderLinks(): string[][] {
    const headerLinkLabels = CONSTANTS.headerResidenceAdminLinkLabels;
    const headerLinks = [CONSTANTS.residenceAdminRoute, CONSTANTS.tenantsRoute, CONSTANTS.laundryAssetsRoute];

    let res = [];
    for (let i = 0; i < headerLinks.length; i++) {
        res.push([headerLinkLabels[i], headerLinks[i]]);
    }

    return res;
}

export function validateEmail(emailCandidate: string): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailCandidate);
}

export function validateMobileNumberDUMMY(mobileNumberCandidate: string) {
    return mobileNumberCandidate.length > 7;
}

// date helpers
export function getCurrentDate(): Date {
    return new Date(Date.now());
}

export function getCurrentUTCms(): number {
    const curDate = getCurrentDate();
    return curDate.getUTCMilliseconds();
}

export function getDateWithRoundedHour(date: Date, hour: number): Date {
    const newDate = new Date(date);
    newDate.setMilliseconds(0);
    newDate.setSeconds(0);
    newDate.setMinutes(0);
    newDate.setHours(hour);
    
    return newDate;
}

export function getOffsetDate(date: Date, increment: number): Date {
    return addDays(date, increment);
}

export function isDifferenceAtLeast30Days(fromDate: Date, toDate: Date): boolean {
    return addDays(fromDate, 30).getTime() <= toDate.getTime();
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let dayStr = day.toString();
    let monthStr = month.toString();
    if (dayStr.length === 1) dayStr = `0${dayStr}`;
    if (monthStr.length === 1) monthStr = `0${monthStr}`;

    return `${dayStr}/${monthStr}/${year}`;
}

export function formatTimeslot(date: Date): string {
    let fromHour = date.getHours();
    let toHour = (fromHour + 1).toString();
    let fromHourStr = fromHour.toString();

    if (fromHourStr.length === 1) fromHourStr = `0${fromHour}`;
    if (toHour.length === 1) toHour = `0${toHour}`;

    return `${fromHourStr}:00 - ${toHour}:00`;
}

export function formatFromToTimeslot(fromTimestamp: number, toTimestamp: number) {
    const fromDate = new Date(fromTimestamp);
    const toDate = new Date(toTimestamp);

    return `${getDateHourMinute(fromDate)}-${getDateHourMinute(toDate)}`;
}

export function getDateHourMinute(date: Date): string {
    let hour = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    
    hour = hour.length === 1 ? `0${hour}` : hour;
    minutes = minutes.length === 1 ? `0${minutes}` : minutes;

    return `${hour}:${minutes}`;
}