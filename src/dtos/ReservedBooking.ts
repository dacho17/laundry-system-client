export default interface ReservedBooking {
    fromTimeslot: number;
	toTimeslot: number;
    assetName: string;
	assetId: number;
	servicePrice?: number;
	currency?: string;
}
