import { useState } from 'react';
import CtaButton from '../ctaButton/CtaButton';
import CONSTANTS from '../../../assets/constants';
import AvailabilityEntryIcon from '../availabilityEntryIcon/AvailabilityEntryIcon';
import { useNavigate } from 'react-router-dom';
import ActivityDto from '../../../dtos/ActivityDto';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { purchaseLaundryAssetService, setPopupResMessage } from '../../../services/slices/AvailabilitySlice';
import TimeslotAvailabilityDto from '../../../dtos/TimeslotAvailabilityDto';
import { TimeslotAvailabilityStatus, getTimeslotAvailabilityStatus } from '../../../enums/TimeslotAvailabilityStatus';
import { formatDate, formatTimeslot, getDateHourMinute } from '../../utils/elementHelper';
import PurchasePopup from '../purchasePopup/PurchasePopup';
import { convertPriceToPoints } from '../../utils/priceConverter';
import PurchaseRequestDto from '../../../dtos/PurchaseRequestDto';
import { setLoyaltyPoints } from '../../../services/slices/AuthSlice';
import './AvailabilityEntry.css';

interface AvailabilityEntryProps {
    availability: TimeslotAvailabilityDto
}

function getLabels(availability: TimeslotAvailabilityDto) {
    if (!availability.isAssetOperational) {
        return [CONSTANTS.notInUseLabel, CONSTANTS.currentlyNotOperationalLabel]
    }

    const chosenTs = new Date(availability.activity.chosenTimeslot);
    switch (getTimeslotAvailabilityStatus(availability.status)) {
        case TimeslotAvailabilityStatus.FREE_TO_USE:
            return [CONSTANTS.useLabel, CONSTANTS.availableImmediatelyLabel];
        case TimeslotAvailabilityStatus.RUNNING_BY_USER:
            const endTime = new Date(availability.runningTimeEnd!);
            return [CONSTANTS.usingLabel, `${CONSTANTS.assetFinishesAtLabel} ${formatDate(endTime)} ${getDateHourMinute(new Date(endTime))}`];
        case TimeslotAvailabilityStatus.FREE_TO_USE_BOOKED:
            const bookingSlotEnd = new Date(availability.bookingSlotEnd!);
            return [CONSTANTS.useLabel, `${CONSTANTS.youBookedThisAssetUntilLabel} ${formatDate(chosenTs)} ${getDateHourMinute(bookingSlotEnd)}`];
        case TimeslotAvailabilityStatus.BOOKED_BY_USER:
            return [CONSTANTS.bookLabel, `${CONSTANTS.youBookedThisAssetOnLabel} ${formatDate(chosenTs)} ${getDateHourMinute(chosenTs)}`];
        case TimeslotAvailabilityStatus.AVAILABLE_FROM:
            return [CONSTANTS.bookLabel, `${CONSTANTS.availableOnLabel} ${formatDate(chosenTs)} ${formatTimeslot(chosenTs)}`];
    }
}

export default function AvailabilityEntry({availability}: AvailabilityEntryProps) {
    const [isPopupShown, setIsPopupShown] = useState(false);
    const dispatch = useAppDispatch();
    const { isPopupLoading, popupResMsg } = useAppSelector(state => state.availability);
    const { user } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    console.log(`AvailabilityEntry reloaded. IsPopupShown=${isPopupShown}, popupResMsg=${popupResMsg}\n\n`);

    function handlePurchaseAsset(activity: ActivityDto, isPayingWithLoyaltyPoints: boolean) {
        const purchaseRequest = {
            assetId: activity.assetId,
            isPayingWithLoyaltyPoints: isPayingWithLoyaltyPoints
        } as PurchaseRequestDto;

        dispatch(purchaseLaundryAssetService(purchaseRequest)).then(res => {
            if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                const currentPointBalance = user!.loyaltyPoints;
                const newPointBalance = currentPointBalance - convertPriceToPoints(activity.servicePrice!, activity.currency!);
                dispatch(setLoyaltyPoints(newPointBalance));
                dispatch(setPopupResMessage(null));
            }
        });
    }

    const isAvailable = [TimeslotAvailabilityStatus.FREE_TO_USE, TimeslotAvailabilityStatus.FREE_TO_USE_BOOKED].includes(getTimeslotAvailabilityStatus(availability.status));
    let [buttonLabel, note] = getLabels(availability);

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

    function handlePopupClose() {
        dispatch(setPopupResMessage(null));
        setIsPopupShown(false);
    }

    function showPopup(activity: ActivityDto) { // showing popup only for purchases
        const contentMsg = `You are about to pay for the usage of ${activity.assetName}.\n\nYour card will be charged with ${activity.servicePrice?.toFixed(2)} ${activity.currency}.\n\n\nPlease confirm your payment. The wash button will then be activated.`;
        const priceInPoints = convertPriceToPoints(activity.servicePrice!, activity.currency!);
        let pointBalanceContent = null;

        if (priceInPoints < user?.loyaltyPoints!) {
            pointBalanceContent = `You have enough loyalty points to pay for the service: ${priceInPoints}.\nPoint balance: ${user?.loyaltyPoints}`;
        }

        return isPopupShown && <PurchasePopup
            user={user!}
            useCardButtonLabel={CONSTANTS.useCardLabel}
            usePointsButtonLabel={CONSTANTS.usePointsLabel}
            title={CONSTANTS.paymentConfirmationTitleLabel}
            content={contentMsg}
            priceInPoints={priceInPoints}
            pointBalanceContent={pointBalanceContent ?? undefined}
            errorMsg={popupResMsg?.isError ? popupResMsg.message : undefined}
            closePopupFn={() => handlePopupClose()}
            assetId={availability.activity.assetId}
            actionFn={(isPayingWithLoyaltyPoints: boolean) => handlePurchaseAsset(activity, isPayingWithLoyaltyPoints)}
            isLoading={isPopupLoading}
            successMsg={popupResMsg?.isError === false ? popupResMsg.message : undefined}
        />
    }

    return (
        <div className='availability-entry'>
            <div className='availability-entry__container'>
                <AvailabilityEntryIcon isAssetAvailable={isAvailable && availability.isAssetOperational} />
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
                        isDisabled={!availability.isAssetOperational}
                    />
                    {showPopup(availability.activity)}
                    </>
                    : <div className='empty-div' />}
            </div>
        </div>
    )
}
