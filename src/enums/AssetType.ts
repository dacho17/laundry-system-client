export enum AssetType {
    WASHER = 1,
    DRYER = 2,
}

export function getAssetType(assetType: string | number): AssetType {
    if (typeof assetType == 'string') {
        const assetTypeNum = parseInt(assetType);
        if (!isNaN(assetTypeNum)) {
            assetType = assetTypeNum;
        }
    }


    if (typeof assetType == 'string') {
        switch(assetType) {
            case AssetType[AssetType.DRYER]:
                return AssetType.DRYER;
            case AssetType[AssetType.WASHER]:
                return AssetType.WASHER;
            default:
                throw Error(`AssetType provided ${assetType} did not match any defined types`);
        }
    }

    else if (typeof assetType == 'number') {
        switch(assetType) {
            case AssetType.DRYER:
                return AssetType.DRYER;
            case AssetType.WASHER:
                return AssetType.WASHER;
            default:
                throw Error(`AssetType provided ${assetType} did not match any defined types`);
        }
    }

    else throw Error('Unrecognized type');
}
