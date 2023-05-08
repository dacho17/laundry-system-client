import { useState } from 'react';
import Popup from '../popup/Popup';
import CtaButton from '../ctaButton/CtaButton';
import CONSTANTS from '../../../assets/constants';
import './AvailabilityEntry.css';
import AvailabilityEntryIcon from '../availabilityEntryIcon/AvailabilityEntryIcon';
import { useNavigate } from 'react-router-dom';
import ActivityDto from '../../../dtos/ActivityDto';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { fetchEarliestAvailabilities, purchaseLaundryAssetService, setPopupResMessage } from '../../../services/slices/AvailabilitySlice';
import BookingRequestDto from '../../../dtos/BookingRequestDto';
import TimeslotAvailabilityDto from '../../../dtos/TimeslotAvailabilityDto';
import { TimeslotAvailabilityStatus, getTimeslotAvailabilityStatus } from '../../../enums/TimeslotAvailabilityStatus';
import { formatDate, formatTimeslot, getDateHourMinute } from '../../utils/elementHelper';


interface AvailabilityEntryProps {
    availability: TimeslotAvailabilityDto
}

function getLabels(availability: TimeslotAvailabilityDto) {
    const chosenTs = new Date(availability.activity.chosenTimeslot);
    switch (getTimeslotAvailabilityStatus(availability.status)) {
        case TimeslotAvailabilityStatus.FREE_TO_USE:
            return [CONSTANTS.useLabel, CONSTANTS.availableImmediatelyLabel];
        case TimeslotAvailabilityStatus.RUNNING_BY_USER:
            const endTime = new Date(availability.runningTimeEnd!);
            return [CONSTANTS.usingLabel, `${CONSTANTS.machineFinishesAtLabel} ${formatDate(endTime)} ${getDateHourMinute(new Date(endTime))}`];
        case TimeslotAvailabilityStatus.FREE_TO_USE_BOOKED:
            const bookingSlotEnd = new Date(availability.bookingSlotEnd!);
            return [CONSTANTS.useLabel, `${CONSTANTS.youBookedThisMachineUntilLabel} ${formatDate(chosenTs)} ${getDateHourMinute(bookingSlotEnd)}`];
        case TimeslotAvailabilityStatus.BOOKED_BY_USER:
            return [CONSTANTS.bookLabel, `${CONSTANTS.youBookedThisMachineOnLabel} ${formatDate(chosenTs)} ${getDateHourMinute(chosenTs)}`];
        case TimeslotAvailabilityStatus.AVAILABLE_FROM:
            return [CONSTANTS.bookLabel, `${CONSTANTS.availableOnLabel} ${formatDate(chosenTs)} ${formatTimeslot(chosenTs)}`];
    }
}

export default function AvailabilityEntry({availability}: AvailabilityEntryProps) {
    const [isPopupShown, setIsPopupShown] = useState(false);
    const dispatch = useAppDispatch();
    const { isPopupLoading, popupResMsg } = useAppSelector(state => state.availability);
    const navigate = useNavigate();

    const isAvailable = TimeslotAvailabilityStatus.FREE_TO_USE === getTimeslotAvailabilityStatus(availability.status);
    const [buttonLabel, note] = getLabels(availability);

    function handleButtonClick(status: TimeslotAvailabilityStatus) {
        switch (status) {
            case TimeslotAvailabilityStatus.FREE_TO_USE:
                setIsPopupShown(true);
                break;
            case TimeslotAvailabilityStatus.AVAILABLE_FROM:
                navigate(CONSTANTS.bookingRoute);
                break;
            case TimeslotAvailabilityStatus.FREE_TO_USE_BOOKED:
                setIsPopupShown(true);
                break;
            case TimeslotAvailabilityStatus.BOOKED_BY_USER:
                navigate(CONSTANTS.bookingRoute);
                break;
            case TimeslotAvailabilityStatus.RUNNING_BY_USER:    // no button showed
            default:
                break;
        }
    }

    function handlePurchaseAsset() {
        console.log('purchase has been clicked');

        const purchaseRequest = {
            assetId: availability.activity.assetId,
            timeslot: availability.activity.chosenTimeslot
        } as BookingRequestDto;

        console.log(`The object to be sent: ${JSON.stringify(purchaseRequest)}`);
        dispatch(purchaseLaundryAssetService(purchaseRequest)).then(res => {
            if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                dispatch(fetchEarliestAvailabilities());
            }
        });
    }

    function handlePopupClose() {
        dispatch(setPopupResMessage(null));
        setIsPopupShown(false);
    }

    function showPopup(activity: ActivityDto) {
        const contentMsg = `You are about to pay for the usage of ${activity.assetName}.\n\nYour card will be charged with ${activity.servicePrice?.toFixed(2)} ${activity.currency}.\n\n\nPlease confirm your payment. The wash button will then be activated.`;

        return isPopupShown && <Popup
            buttonLabel={CONSTANTS.confirmPaymentLabel}
            title={CONSTANTS.paymentConfirmationTitleLabel}
            content={contentMsg}
            errorMsg={popupResMsg?.isError ? popupResMsg.message : undefined}
            closePopupFn={() => handlePopupClose()}
            actionFn={() => handlePurchaseAsset()}
            isLoading={isPopupLoading}
            successMsg={popupResMsg?.isError === false ? popupResMsg.message : undefined}
        />
    }

    return (
        <div className='availability-entry'>
            <div className='availability-entry__container'>
                <AvailabilityEntryIcon isAssetAvailable={isAvailable} />    
            </div>
            <div className='availability-entry__item availability-entry__text'>
                {availability.activity.assetName}
            </div>
            <div className='availability-entry__item availability-entry__text'>
                {note}
            </div>
            <div className='availability-entry__item'>
                { TimeslotAvailabilityStatus.RUNNING_BY_USER !== getTimeslotAvailabilityStatus(availability.status) ? <>
                    <CtaButton
                        label={buttonLabel}
                        actionFn={() => handleButtonClick(getTimeslotAvailabilityStatus(availability.status))}
                        isDisabled={false} 
                    />
                    {showPopup(availability.activity)}
                    </>
                    : <div className='empty-div' />}
            </div>
        </div>
    )
}
