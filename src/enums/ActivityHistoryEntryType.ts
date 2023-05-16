export enum ActivityHistoryEntryType {
    ASSET_BOOKING = 1,
    ASSET_PURCHASE = 2,
    OFFER_PURCHASE = 3
}

export function getActivityHistoryEntryType(entryType: string | number): ActivityHistoryEntryType {
    if (typeof entryType == 'string') {
        const entrytTypeNum = parseInt(entryType);
        if (!isNaN(entrytTypeNum)) {
            entryType = entrytTypeNum;
        }
    }


    if (typeof entryType == 'string') {
        switch(entryType) {
            case ActivityHistoryEntryType[ActivityHistoryEntryType.ASSET_BOOKING]:
                return ActivityHistoryEntryType.ASSET_BOOKING;
            case ActivityHistoryEntryType[ActivityHistoryEntryType.ASSET_PURCHASE]:
                return ActivityHistoryEntryType.ASSET_PURCHASE;
            case ActivityHistoryEntryType[ActivityHistoryEntryType.OFFER_PURCHASE]:
                return ActivityHistoryEntryType.OFFER_PURCHASE;
            default:
                throw Error(`entryType provided ${entryType} did not match any defined types`);
        }
    }

    else if (typeof entryType == 'number') {
        switch(entryType) {
            case ActivityHistoryEntryType.ASSET_BOOKING:
                return ActivityHistoryEntryType.ASSET_BOOKING;
            case ActivityHistoryEntryType.ASSET_PURCHASE:
                return ActivityHistoryEntryType.ASSET_PURCHASE;
            case ActivityHistoryEntryType.OFFER_PURCHASE:
                return ActivityHistoryEntryType.OFFER_PURCHASE;
            default:
                throw Error(`entryType provided ${entryType} did not match any defined types`);
        }
    }

    else throw Error('Unrecognized type');
}
