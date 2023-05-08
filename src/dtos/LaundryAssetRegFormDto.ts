import { AssetType } from "../enums/AssetType";

export default interface LaundryAssetRegFormDto {
    id: number;
    name: string;
    assetType: AssetType;
    runningTime: number;
    servicePrice: number;
    currency: string;
    isOperational: boolean;
}
