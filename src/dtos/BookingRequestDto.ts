export default interface BookingRequestDto {
    assetId: number;
    timeslot: number;
    // for fetching dailyBookings, this value is 00:00 of the day in question (future or current timestamp of today)
}
