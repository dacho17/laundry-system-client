import { AssetType } from "../enums/AssetType";

export default interface LaundryAssetDto {
	id: number;
	name: string;
	assetType: AssetType;
	runningTime: number;
	servicePrice: string;
	currency: string;
	isOperational: boolean;
}
