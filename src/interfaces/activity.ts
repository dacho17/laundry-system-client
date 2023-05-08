import { ActivityType } from "../enums/ActivityType";

export default interface Activity {
    timeOfActivity: string;
    activityType: ActivityType;
    chosenTimeslot: string;
    asset: string;
    paidAmount?: string; 
}
