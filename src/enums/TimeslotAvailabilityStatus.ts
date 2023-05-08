export enum TimeslotAvailabilityStatus {
    RUNNING_BY_USER = 1,
    FREE_TO_USE = 2,
    FREE_TO_USE_BOOKED = 3,
    BOOKED_BY_USER = 4,
    AVAILABLE_FROM = 5
}

export function getTimeslotAvailabilityStatus(status: string | number): TimeslotAvailabilityStatus {
    if (typeof status == 'string') {
        const statusNum = parseInt(status);
        if (!isNaN(statusNum)) {
            status = statusNum;
        }
    }


    if (typeof status == 'string') {
        switch(status) {
            case TimeslotAvailabilityStatus[TimeslotAvailabilityStatus.AVAILABLE_FROM]:
                return TimeslotAvailabilityStatus.AVAILABLE_FROM;
            case TimeslotAvailabilityStatus[TimeslotAvailabilityStatus.BOOKED_BY_USER]:
                return TimeslotAvailabilityStatus.BOOKED_BY_USER;
                case TimeslotAvailabilityStatus[TimeslotAvailabilityStatus.FREE_TO_USE_BOOKED]:
                    return TimeslotAvailabilityStatus.FREE_TO_USE_BOOKED;
            case TimeslotAvailabilityStatus[TimeslotAvailabilityStatus.FREE_TO_USE]:
                return TimeslotAvailabilityStatus.FREE_TO_USE;
            case TimeslotAvailabilityStatus[TimeslotAvailabilityStatus.RUNNING_BY_USER]:
                return TimeslotAvailabilityStatus.RUNNING_BY_USER;
            default:
                throw Error(`TimeAvailability status provided ${status} did not match any defined enums`);
        }
    }

    else if (typeof status == 'number') {
        switch(status) {
            case TimeslotAvailabilityStatus.AVAILABLE_FROM:
                return TimeslotAvailabilityStatus.AVAILABLE_FROM;
            case TimeslotAvailabilityStatus.BOOKED_BY_USER:
                return TimeslotAvailabilityStatus.BOOKED_BY_USER;
            case TimeslotAvailabilityStatus.FREE_TO_USE_BOOKED:
                return TimeslotAvailabilityStatus.FREE_TO_USE_BOOKED;
            case TimeslotAvailabilityStatus.FREE_TO_USE:
                return TimeslotAvailabilityStatus.FREE_TO_USE;
            case TimeslotAvailabilityStatus.RUNNING_BY_USER:
                return TimeslotAvailabilityStatus.RUNNING_BY_USER;
            default:
                throw Error(`TimeAvailability status provided ${status} did not match any defined enums`);
        }
    }

    else throw Error('Unrecognized type');
}
