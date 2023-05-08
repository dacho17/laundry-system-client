import ReservedBooking from "./ReservedBooking";

export default interface ActiveBookingsDto {
    bookingsToPurchase: ReservedBooking[];
	purchasedBookings: ReservedBooking[];
	// expiredBookings: ActivityDto[];
}
