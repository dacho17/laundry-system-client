import { ActivityHistoryEntryType } from "../enums/ActivityHistoryEntryType";
import { AssetType } from "../enums/AssetType";

export default interface ActivityHistoryEntryDto {
    timeOfActivity: string;
	activityType: ActivityHistoryEntryType;
	loyaltyPointsUsed: number;
	paidAmount?: number;
	currency?: string;
    assetType?: AssetType;
	chosenTimeslot?: number;
	assetName?: string;
    offerName?: string;
    loyaltyPointsPurchased?: number;
}
