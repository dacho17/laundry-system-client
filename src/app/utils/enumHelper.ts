import CONSTANTS from "../../assets/constants";
import { ActivityType } from "../../enums/ActivityType";


export function getActivity(activityType: ActivityType) {
    switch (activityType.toString()) {
        case ActivityType[ActivityType.BOOKING]:
            return CONSTANTS.bookingLabel;
        case ActivityType[ActivityType.PURCHASE]:
            return CONSTANTS.paymentLabel;
        default:
            return CONSTANTS.unknownType;
    }
}
