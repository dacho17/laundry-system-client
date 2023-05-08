import { ActivityType } from "../enums/ActivityType";

export default interface ActivityDto {
    timeOfActivity: string;
	activityType: ActivityType;
	chosenTimeslot: number;
	assetName: string;
	assetId: number;
	servicePrice?: number;
	currency?: string;
}
