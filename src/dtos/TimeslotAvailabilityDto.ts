import { TimeslotAvailabilityStatus } from "../enums/TimeslotAvailabilityStatus";
import ActivityDto from "./ActivityDto";

export default interface TimeslotAvailabilityDto {
    activity: ActivityDto;
    status: TimeslotAvailabilityStatus;
    runningTimeEnd: number | null;
    bookingSlotEnd: number | null;
}
